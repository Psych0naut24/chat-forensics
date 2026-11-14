import { ChatMessage, ChatMetrics, ParticipantStats } from '../types';

/**
 * Computes deterministic statistics and conversational dynamics from parsed messages
 */
export function calculateMetrics(
  messages: ChatMessage[],
  participants: [string, string]
): ChatMetrics {
  const [p1, p2] = participants;

  const stats: Record<string, ParticipantStats> = {
    [p1]: createInitialStats(p1),
    [p2]: createInitialStats(p2),
  };

  const hourlyActivity: Record<number, { hour: number; countA: number; countB: number }> = {};
  for (let h = 0; h < 24; h++) {
    hourlyActivity[h] = { hour: h, countA: 0, countB: 0 };
  }

  const responseLatencies: Record<string, number[]> = {
    [p1]: [],
    [p2]: [],
  };

  const INITIATION_GAP_MS = 4 * 60 * 60 * 1000; // 4 hours gap marks a new conversation initiation
  let lastMessage: ChatMessage | null = null;
  let currentRunSender: string | null = null;
  let runLength = 0;

  // Track weekly velocity
  const weeklyMap: Record<string, { countA: number; countB: number }> = {};

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.sender !== p1 && msg.sender !== p2) continue;

    const pStat = stats[msg.sender];
    pStat.messageCount++;

    // Word and character count
    const words = msg.text.trim().split(/\s+/).filter(Boolean);
    pStat.wordCount += words.length;
    pStat.characterCount += msg.text.length;

    // Questions
    if (msg.text.includes('?')) {
      pStat.questionsAsked += (msg.text.match(/\?/g) || []).length;
    }

    // Hourly distribution
    const hour = msg.timestamp.getHours();
    if (msg.sender === p1) {
      hourlyActivity[hour].countA++;
    } else {
      hourlyActivity[hour].countB++;
    }

    // Night owl (11 PM to 5 AM)
    if (hour >= 23 || hour < 5) {
      pStat.nightOwlMessages++;
    }

    // Weekly velocity key
    const weekKey = getWeekKey(msg.timestamp);
    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = { countA: 0, countB: 0 };
    }
    if (msg.sender === p1) {
      weeklyMap[weekKey].countA++;
    } else {
      weeklyMap[weekKey].countB++;
    }

    // Double-texting and response latencies
    if (lastMessage) {
      const timeDiffMs = msg.timestamp.getTime() - lastMessage.timestamp.getTime();

      // Check initiation
      if (timeDiffMs >= INITIATION_GAP_MS) {
        pStat.conversationsInitiated++;
      }

      // Check response time (when sender changed)
      if (msg.sender !== lastMessage.sender) {
        const latencyMinutes = Math.max(0.1, timeDiffMs / (60 * 1000));
        // Discard multi-day pauses from standard median latency calculation to avoid skew
        if (latencyMinutes <= 72 * 60) {
          responseLatencies[msg.sender].push(latencyMinutes);
        }
      }
    } else {
      // First message is an initiation
      pStat.conversationsInitiated++;
    }

    // Double-text run tracking
    if (msg.sender === currentRunSender) {
      runLength++;
      if (runLength >= 2) {
        pStat.doubleTextCount++;
      }
    } else {
      currentRunSender = msg.sender;
      runLength = 1;
    }

    lastMessage = msg;
  }

  // Calculate initiation percentages
  const totalInitiations = stats[p1].conversationsInitiated + stats[p2].conversationsInitiated;
  stats[p1].initiationPercentage =
    totalInitiations > 0 ? Math.round((stats[p1].conversationsInitiated / totalInitiations) * 100) : 50;
  stats[p2].initiationPercentage =
    totalInitiations > 0 ? Math.round((stats[p2].conversationsInitiated / totalInitiations) * 100) : 50;

  // Calculate median & average response times
  for (const p of [p1, p2]) {
    const latencies = responseLatencies[p];
    if (latencies.length > 0) {
      latencies.sort((a, b) => a - b);
      const mid = Math.floor(latencies.length / 2);
      stats[p].medianResponseTimeMinutes = Math.round(
        latencies.length % 2 !== 0 ? latencies[mid] : (latencies[mid - 1] + latencies[mid]) / 2
      );
      const sum = latencies.reduce((acc, v) => acc + v, 0);
      stats[p].averageResponseTimeMinutes = Math.round(sum / latencies.length);
    } else {
      stats[p].medianResponseTimeMinutes = 5;
      stats[p].averageResponseTimeMinutes = 10;
    }
  }

  // Format weekly velocity array
  const weeklyVelocity = Object.keys(weeklyMap)
    .sort()
    .map((weekLabel) => ({
      weekLabel,
      countA: weeklyMap[weekLabel].countA,
      countB: weeklyMap[weekLabel].countB,
    }));

  const startDate = messages.length > 0 ? messages[0].timestamp : new Date();
  const endDate = messages.length > 0 ? messages[messages.length - 1].timestamp : new Date();
  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (86400 * 1000)));

  return {
    participants,
    totalMessages: messages.length,
    dateRange: {
      start: startDate,
      end: endDate,
      totalDays,
    },
    stats,
    hourlyActivity,
    weeklyVelocity,
  };
}

function createInitialStats(name: string): ParticipantStats {
  return {
    name,
    messageCount: 0,
    wordCount: 0,
    characterCount: 0,
    conversationsInitiated: 0,
    initiationPercentage: 50,
    medianResponseTimeMinutes: 0,
    averageResponseTimeMinutes: 0,
    doubleTextCount: 0,
    nightOwlMessages: 0,
    questionsAsked: 0,
    topEmojis: [],
  };
}

function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}
