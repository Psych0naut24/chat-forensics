import { ChatMessage } from '../types';

/**
 * Normalizes and parses raw chat exports (WhatsApp iOS/Android, Telegram, generic text)
 */
export function parseChatLog(rawText: string, scrubPII = true): { messages: ChatMessage[]; participants: string[] } {
  const lines = rawText.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  const participantSet = new Set<string>();

  // WhatsApp iOS: [dd/mm/yy, hh:mm:ss AM/PM] Name: Message or [dd/mm/yyyy, hh:mm:ss] Name: Message
  const iosRegex = /^\[(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]\s+([^:]+):\s+(.*)$/;

  // WhatsApp Android: dd/mm/yy, hh:mm - Name: Message or mm/dd/yyyy, hh:mm am - Name: Message
  const androidRegex = /^(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)\s+-\s+([^:]+):\s+(.*)$/;

  // Telegram text export: [dd.mm.yy hh:mm:ss] Name: Message
  const telegramRegex = /^\[?(\d{2}[/.]\d{2}[/.]\d{2,4}\s+\d{2}:\d{2}(?::\d{2})?)\]?\s+([^:]+):\s+(.*)$/;

  // Generic direct paste format: Name: Message or [12:34] Name: Message
  const genericPasteRegex = /^(?:\[?(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)\]?\s+)?([^:\n]{1,30}):\s+(.*)$/;

  let currentMsg: ChatMessage | null = null;
  let idCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check iOS WhatsApp format
    let match = line.match(iosRegex);
    if (match) {
      const [, datePart, timePart, senderRaw, textRaw] = match;
      const parsedDate = parseDateTimeString(datePart, timePart);
      const sender = cleanSenderName(senderRaw);
      if (isValidMessage(sender, textRaw)) {
        participantSet.add(sender);
        currentMsg = {
          id: `msg-${idCounter++}`,
          timestamp: parsedDate,
          sender,
          text: scrubPII ? sanitizePII(textRaw) : textRaw,
          isMedia: isMediaMessage(textRaw),
        };
        messages.push(currentMsg);
      }
      continue;
    }

    // Check Android WhatsApp format
    match = line.match(androidRegex);
    if (match) {
      const [, datePart, timePart, senderRaw, textRaw] = match;
      const parsedDate = parseDateTimeString(datePart, timePart);
      const sender = cleanSenderName(senderRaw);
      if (isValidMessage(sender, textRaw)) {
        participantSet.add(sender);
        currentMsg = {
          id: `msg-${idCounter++}`,
          timestamp: parsedDate,
          sender,
          text: scrubPII ? sanitizePII(textRaw) : textRaw,
          isMedia: isMediaMessage(textRaw),
        };
        messages.push(currentMsg);
      }
      continue;
    }

    // Check Telegram format
    match = line.match(telegramRegex);
    if (match) {
      const [, dateTimePart, senderRaw, textRaw] = match;
      const parts = dateTimePart.split(/\s+/);
      const parsedDate = parseDateTimeString(parts[0], parts[1]);
      const sender = cleanSenderName(senderRaw);
      if (isValidMessage(sender, textRaw)) {
        participantSet.add(sender);
        currentMsg = {
          id: `msg-${idCounter++}`,
          timestamp: parsedDate,
          sender,
          text: scrubPII ? sanitizePII(textRaw) : textRaw,
          isMedia: isMediaMessage(textRaw),
        };
        messages.push(currentMsg);
      }
      continue;
    }

    // Check Generic Paste format
    match = line.match(genericPasteRegex);
    if (match && !line.includes('Messages and calls are end-to-end encrypted')) {
      const [, , senderRaw, textRaw] = match;
      const sender = cleanSenderName(senderRaw);
      // Ensure sender doesn't look like sentence text
      if (sender.length < 25 && !sender.includes('?') && isValidMessage(sender, textRaw)) {
        participantSet.add(sender);
        // Estimate sequential timestamp
        const simulatedDate = new Date(Date.now() - (lines.length - i) * 120000);
        currentMsg = {
          id: `msg-${idCounter++}`,
          timestamp: simulatedDate,
          sender,
          text: scrubPII ? sanitizePII(textRaw) : textRaw,
          isMedia: isMediaMessage(textRaw),
        };
        messages.push(currentMsg);
        continue;
      }
    }

    // If multiline continuation of previous message
    if (currentMsg) {
      currentMsg.text += '\n' + (scrubPII ? sanitizePII(line) : line);
    }
  }

  // Sort chronologically
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Determine top 2 most active participants
  const senderCounts: Record<string, number> = {};
  messages.forEach((m) => {
    senderCounts[m.sender] = (senderCounts[m.sender] || 0) + 1;
  });

  const sortedParticipants = Object.keys(senderCounts).sort(
    (a, b) => senderCounts[b] - senderCounts[a]
  );

  return {
    messages,
    participants: sortedParticipants.slice(0, 2),
  };
}

function cleanSenderName(name: string): string {
  return name.replace(/^[\u200e\u200f\s]+|[\u200e\u200f\s]+$/g, '').trim();
}

function isValidMessage(sender: string, text: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerSender = sender.toLowerCase();
  
  if (lowerText.includes('messages and calls are end-to-end encrypted')) return false;
  if (lowerSender.includes('system') || lowerSender.includes('whatsapp')) return false;
  return true;
}

function isMediaMessage(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('<media omitted>') ||
    lower.includes('image omitted') ||
    lower.includes('video omitted') ||
    lower.includes('audio omitted') ||
    lower.includes('sticker omitted') ||
    lower.includes('document omitted')
  );
}

function parseDateTimeString(dateStr: string, timeStr: string): Date {
  try {
    const dateParts = dateStr.split(/[/.-]/).map((n) => parseInt(n, 10));
    let day = dateParts[0];
    let month = dateParts[1] - 1; // 0-indexed
    let year = dateParts[2];

    // Handle 2-digit years
    if (year < 100) {
      year += 2000;
    }

    // Handle US vs UK date format (if month > 12, swap)
    if (month > 11 && day <= 12) {
      const temp = day;
      day = month + 1;
      month = temp - 1;
    }

    // Parse time
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const isPM = /pm/i.test(timeStr);
    const isAM = /am/i.test(timeStr);
    const cleanTime = timeStr.replace(/[ap]m/gi, '').trim();
    const timeParts = cleanTime.split(':').map((n) => parseInt(n, 10));

    hours = timeParts[0] || 0;
    minutes = timeParts[1] || 0;
    seconds = timeParts[2] || 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const d = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(d.getTime())) {
      return d;
    }
  } catch {
    // fallback
  }
  return new Date();
}

/**
 * Strips phone numbers, email addresses, and potential PII
 */
export function sanitizePII(text: string): string {
  // Redact emails
  let sanitized = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  // Redact phone numbers (e.g. +1 555-123-4567, 123-456-7890)
  sanitized = sanitized.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE]');
  return sanitized;
}
