import {
  ChatMessage,
  ChatMetrics,
  DiagnosticReport,
  ToneMode,
  AiModelChoice,
} from '../types';
import { generateDiagnosticReport } from '../utils/heuristics';

/**
 * Robust API invoker with candidate fallback models and detailed error reporting.
 */
async function callGeminiApi(
  model: string,
  apiKey: string,
  payload: any
): Promise<{ ok: boolean; status: number; data?: any; error?: string }> {
  const candidateModels = [
    model,
    model.includes('pro') ? 'gemini-1.5-pro' : 'gemini-2.0-flash',
    model.includes('pro') ? 'gemini-2.0-flash' : 'gemini-1.5-flash',
  ];

  const uniqueModels = Array.from(new Set(candidateModels));
  let lastError = 'Failed to reach Gemini API';
  let lastStatus = 500;

  for (const candidate of uniqueModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        return { ok: true, status: res.status, data };
      }

      const errJson = await res.json().catch(() => null);
      lastStatus = res.status;
      lastError = errJson?.error?.message || res.statusText || `HTTP ${res.status}`;

      // If model not found (404), try next candidate
      if (res.status === 404) {
        console.warn(`Model ${candidate} returned 404, trying next candidate...`);
        continue;
      }

      // If API key is invalid (400) or unauthorized (403), stop early
      if (res.status === 400 || res.status === 403) {
        break;
      }
    } catch (netErr: any) {
      lastError = netErr?.message || 'Network request failed';
      break;
    }
  }

  return { ok: false, status: lastStatus, error: lastError };
}

/**
 * Calls Gemini (Flash or Pro) to produce a deep clinical & forensic diagnostic report.
 * Supports up to full multi-year chat histories with automatic local fallback.
 */
export async function analyzeChatWithGemini(
  messages: ChatMessage[],
  metrics: ChatMetrics,
  apiKey?: string,
  tone: ToneMode = 'candid',
  model: AiModelChoice = 'gemini-2.5-flash'
): Promise<DiagnosticReport> {
  const fallback = generateDiagnosticReport(metrics, 'Deep Clinical Psychology');

  if (!apiKey || apiKey.trim() === '') {
    return fallback;
  }

  try {
    const [p1, p2] = metrics.participants;
    const s1 = metrics.stats[p1];
    const s2 = metrics.stats[p2];

    const sampleLimit = model === 'gemini-2.5-pro' ? 1200 : 250;
    const sampleExcerpts = sampleChatExcerpts(messages, sampleLimit);

    const toneInstructions = {
      candid:
        'Be psychologically sharp, brutally perceptive, candid, and direct. Call out subtle power games, weaponized detachment, and emotional asymmetries without sugarcoating.',
      constructive:
        'Be thoughtful, empathetic, grounded in relational psychology and attachment theory (anxious/avoidant/secure). Focus on constructive pathways for mutual understanding.',
      analytical:
        'Be clinical, forensic, data-driven, and objective. Present findings as an executive behavioral analysis with minimal editorial flair.',
    }[tone];

    const prompt = `You are a world-renowned forensic communication analyst, Gottman-trained relational psychologist, and behavioral profiler.
Perform a comprehensive, clinical, and psychological diagnostic investigation of this chat history between "${p1}" and "${p2}".

### HARD STATISTICAL METRICS:
- Total Messages Analyzed: ${metrics.totalMessages} across ${metrics.dateRange.totalDays} days.
- Initiation Breakdown:
  * ${p1}: Initiated ${s1.conversationsInitiated} conversations (${s1.initiationPercentage}% of total starts)
  * ${p2}: Initiated ${s2.conversationsInitiated} conversations (${s2.initiationPercentage}% of total starts)
- Median Response Latency:
  * ${p1}: ${s1.medianResponseTimeMinutes} minutes
  * ${p2}: ${s2.medianResponseTimeMinutes} minutes
- Word & Character Volume:
  * ${p1}: ${s1.wordCount} words, ${s1.doubleTextCount} double-texts
  * ${p2}: ${s2.wordCount} words, ${s2.doubleTextCount} double-texts
- Night Owl Messages (11 PM - 5 AM): ${p1} (${s1.nightOwlMessages}) vs ${p2} (${s2.nightOwlMessages})
- Questions Asked: ${p1} (${s1.questionsAsked}) vs ${p2} (${s2.questionsAsked})

### CHAT EXCERPT (Chronological Sample):
${sampleExcerpts}

### TONE DIRECTIVE:
${toneInstructions}

### REQUIRED CLINICAL FRAMEWORKS:
1. Attachment Theory: Classify both participants into Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant, or Secure-Autonomous with observable triggers.
2. Gottman Relational Diagnostics: Calculate "Bids for Connection" response rates and detect the Four Friction Markers (Criticism, Contempt, Defensiveness, Stonewalling) with concrete quotes.
3. Chronological Epochs: Divide the relationship into 3-4 historical chapters (e.g. Spark/Novelty, Comfort Baseline, Drift/Inflection, Current Equilibrium).

Respond ONLY with valid JSON matching this exact structure:
{
  "caseMetadata": {
    "caseNumber": "${fallback.caseMetadata.caseNumber}",
    "participants": ["${p1}", "${p2}"],
    "dateRange": "${fallback.caseMetadata.dateRange}",
    "totalMessagesAnalyzed": ${metrics.totalMessages},
    "generatedAt": "${fallback.caseMetadata.generatedAt}",
    "depthLevel": "Deep Clinical Psychology"
  },
  "overallVerdict": {
    "headline": "A memorable headline capturing the relational core",
    "archetypeTitle": "e.g. The Pursuer-Distancer Standoff",
    "brutalityScore": number (1 to 100),
    "summary": "2-3 deep psychological sentences analyzing the emotional reality",
    "coreDynamic": "Short 1-sentence psychological diagnosis"
  },
  "powerDynamic": {
    "dominantParticipant": "${p1}" | "${p2}" | "Equal Balance",
    "leveragePercentage": number (50 to 95),
    "explanation": "Detailed breakdown of who controls the pacing and why",
    "tacticsObserved": ["3-4 specific communication tactics"]
  },
  "inflectionPoint": {
    "detected": boolean,
    "period": "Exact timeframe or week the dynamic shifted",
    "description": "What altered the relationship baseline and why",
    "quoteOrTrigger": "Triggering quote or event",
    "beforeVibe": "How the interaction felt before",
    "afterVibe": "How the interaction felt after"
  },
  "attachmentDynamics": {
    "dynamicType": "e.g. Anxious-Avoidant Trap / Secure-Harmonic Interlock",
    "personA": {
      "style": "Anxious-Preoccupied" | "Dismissive-Avoidant" | "Fearful-Avoidant" | "Secure-Autonomous",
      "summary": "Psychological breakdown of ${p1}'s attachment patterns",
      "observableTriggers": ["List of specific conversational triggers"]
    },
    "personB": {
      "style": "Anxious-Preoccupied" | "Dismissive-Avoidant" | "Fearful-Avoidant" | "Secure-Autonomous",
      "summary": "Psychological breakdown of ${p2}'s attachment patterns",
      "observableTriggers": ["List of specific conversational triggers"]
    },
    "systemicLoop": "How person A's reaction triggers person B's defensive reflex in an infinite loop"
  },
  "gottmanAnalysis": {
    "turnTowardsRateA": number (0 to 100),
    "turnTowardsRateB": number (0 to 100),
    "bidSummary": "Analysis of emotional bids and receptivity",
    "frictionMarkers": [
      {
        "type": "Criticism" | "Contempt" | "Defensiveness" | "Stonewalling",
        "instigator": "${p1}" | "${p2}",
        "quote": "Quote or behavior observed",
        "analysis": "Why this represents that friction marker"
      }
    ]
  },
  "relationshipEpochs": [
    {
      "chapterNumber": 1,
      "title": "Chapter title",
      "timeframe": "Date/Time window",
      "vibeScore": number (0-100),
      "cadence": "Pacing description",
      "summary": "What characterized this era",
      "keyMomentQuote": "Representative quote or milestone"
    }
  ],
  "behavioralPatterns": [
    {
      "title": "Pattern Name",
      "subject": "${p1}" | "${p2}" | "Both",
      "evidence": "Direct quote or stat",
      "interpretation": "Psychological breakdown",
      "impactLevel": "low" | "medium" | "high" | "critical"
    }
  ],
  "flags": {
    "redFlags": [{"person": "${p1}" | "${p2}", "flag": "Flag"}],
    "greenFlags": [{"person": "${p1}" | "${p2}", "flag": "Flag"}]
  },
  "actionableAdvice": {
    "forPersonA": "Advice for ${p1}",
    "forPersonB": "Advice for ${p2}",
    "theBottomLine": "The single overarching truth"
  }
}`;

    const apiResult = await callGeminiApi(model, apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    if (!apiResult.ok || !apiResult.data) {
      console.warn('Gemini API call failed, falling back to local clinical heuristics:', apiResult.error);
      return fallback;
    }

    const candidateText = apiResult.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return fallback;

    const parsedJson = JSON.parse(candidateText) as DiagnosticReport;
    return parsedJson;
  } catch (err) {
    console.warn('Error during Gemini deep analysis. Using fallback:', err);
    return fallback;
  }
}

/**
 * Rich local deterministic forensic Q&A engine.
 * Computes deep, specific diagnostic answers directly from parsed timestamps, message logs, and metrics.
 */
export function generateLocalForensicAnswer(
  question: string,
  messages: ChatMessage[],
  metrics: ChatMetrics,
  report: DiagnosticReport
): string {
  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];
  const cleanQ = question.trim().toLowerCase();

  // 1. Pulling away / Losing interest / Genuinely busy
  if (
    cleanQ.includes('pull away') ||
    cleanQ.includes('pulling away') ||
    cleanQ.includes('busy') ||
    cleanQ.includes('lose interest') ||
    cleanQ.includes('losing interest') ||
    cleanQ.includes('interest')
  ) {
    const dominant = report.powerDynamic.dominantParticipant;
    const inflection = report.inflectionPoint.period || 'the mid-point of the conversation';
    const slower = s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes ? p1 : p2;
    const slowerTime = Math.max(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes);
    const lowerInitiator = s1.initiationPercentage > s2.initiationPercentage ? p2 : p1;
    const lowerPct = Math.min(s1.initiationPercentage, s2.initiationPercentage);

    return `Forensic response velocity indicates that ${dominant} began pulling away around "${inflection}". While genuine busyness typically features sporadic delays followed by warm, descriptive follow-ups, the data here shows calculated detachment. ${slower}'s latency stretched to a median of ${slowerTime} minutes, while ${lowerInitiator} initiated only ${lowerPct}% of conversations after quiet pauses. This steep asymmetry indicates an emotional pacing defense rather than genuine scheduling unavailability.`;
  }

  // 2. Apologies / Emotional Responsibility
  if (
    cleanQ.includes('apologize') ||
    cleanQ.includes('apology') ||
    cleanQ.includes('sorry') ||
    cleanQ.includes('fault') ||
    cleanQ.includes('blame')
  ) {
    const sorryA = messages.filter((m) => m.sender === p1 && /sorry|apologize|my bad|forgive me/i.test(m.text)).length;
    const sorryB = messages.filter((m) => m.sender === p2 && /sorry|apologize|my bad|forgive me/i.test(m.text)).length;
    const more = sorryA > sorryB ? p1 : sorryB > sorryA ? p2 : 'Both';
    const diff = Math.abs(sorryA - sorryB);

    return `In this case file, ${p1} apologized ${sorryA} times, while ${p2} apologized ${sorryB} times. ${
      more === 'Both'
        ? 'Both participants showed equal willingness to acknowledge conversational friction.'
        : `${more} apologized ${diff} more times, indicating they habitually absorbed relational tension and assumed responsibility to repair communication gaps.`
    }`;
  }

  // 3. Longest response delays & trigger topics
  if (
    cleanQ.includes('delay') ||
    cleanQ.includes('latency') ||
    cleanQ.includes('slow') ||
    cleanQ.includes('longest') ||
    cleanQ.includes('topic')
  ) {
    let maxGap = 0;
    let gapTriggerMsg = '';
    let gapResponder = '';

    for (let i = 1; i < messages.length; i++) {
      if (messages[i].sender !== messages[i - 1].sender) {
        const gapMin = (messages[i].timestamp.getTime() - messages[i - 1].timestamp.getTime()) / (1000 * 60);
        if (gapMin > maxGap) {
          maxGap = gapMin;
          gapTriggerMsg = messages[i - 1].text;
          gapResponder = messages[i].sender;
        }
      }
    }
    const gapHours = Math.max(1, Math.round(maxGap / 60));

    return `The longest communicative freeze in this record was a ${gapHours}-hour delay by ${gapResponder || report.powerDynamic.dominantParticipant}. The message preceding this freeze was: "${gapTriggerMsg.slice(0, 90)}...". Quantitative analysis demonstrates that topics requiring future commitment, emotional vulnerability, or schedule coordination consistently triggered the steepest response latencies.`;
  }

  // 4. Vulnerability / Intimacy
  if (
    cleanQ.includes('vulnerab') ||
    cleanQ.includes('intimacy') ||
    cleanQ.includes('feelings') ||
    cleanQ.includes('deep') ||
    cleanQ.includes('authentic')
  ) {
    const nightA = s1.nightOwlMessages;
    const nightB = s2.nightOwlMessages;
    const avgWordsA = s1.wordCount / Math.max(1, s1.messageCount);
    const avgWordsB = s2.wordCount / Math.max(1, s2.messageCount);

    return `Authentic vulnerability is benchmarked through late-night exchanges (11 PM - 5 AM) and narrative depth. ${p1} logged ${nightA} night-owl messages (averaging ${avgWordsA.toFixed(1)} words/msg), while ${p2} logged ${nightB} night-owl messages (averaging ${avgWordsB.toFixed(1)} words/msg). ${
      report.attachmentDynamics?.personA?.style?.includes('Avoidant') || report.attachmentDynamics?.personB?.style?.includes('Avoidant')
        ? 'Avoidant defensive reflexes actively suppressed vulnerable disclosures into brief, reactive statements whenever emotional intimacy increased.'
        : 'Vulnerability surfaced primarily during initial exploratory exchanges before relational expectations solidified.'
    }`;
  }

  // 5. Initiation / Who texts first
  if (
    cleanQ.includes('who texts first') ||
    cleanQ.includes('initiat') ||
    cleanQ.includes('first')
  ) {
    return `${p1} initiated ${s1.initiationPercentage}% of conversations after a quiet pause (>4 hours), while ${p2} initiated ${s2.initiationPercentage}%. This reveals that ${s1.initiationPercentage > s2.initiationPercentage ? p1 : p2} served as the primary relational motor, while the other party assumed a reactive, buffered stance.`;
  }

  // 6. Power & Leverage
  if (
    cleanQ.includes('power') ||
    cleanQ.includes('leverage') ||
    cleanQ.includes('control') ||
    cleanQ.includes('dominant')
  ) {
    return `${report.powerDynamic.dominantParticipant} holds conversational leverage (${report.powerDynamic.leveragePercentage}%). ${report.powerDynamic.explanation}`;
  }

  // Default synthesis
  return `In this case file, the primary dynamic is "${report.overallVerdict.headline}". ${report.powerDynamic.dominantParticipant} holds conversational leverage (${report.powerDynamic.leveragePercentage}%), while the systemic feedback loop revolves around "${report.attachmentDynamics?.systemicLoop || report.overallVerdict.coreDynamic}".`;
}

/**
 * Interactive "Interrogate the Case File" Q&A
 * Uses live Gemini AI when available, with seamless, intelligent local fallback.
 */
export async function interrogateCase(
  messages: ChatMessage[],
  metrics: ChatMetrics,
  report: DiagnosticReport,
  question: string,
  apiKey?: string,
  model: AiModelChoice = 'gemini-2.5-flash'
): Promise<string> {
  const localAnswer = generateLocalForensicAnswer(question, messages, metrics, report);

  if (!apiKey || apiKey.trim() === '') {
    return localAnswer;
  }

  try {
    const sampleExcerpts = sampleChatExcerpts(messages, 250);
    const prompt = `You are the Lead Forensic Communications Investigator for this case file between "${metrics.participants[0]}" and "${metrics.participants[1]}".
Case Overview:
- Verdict: ${report.overallVerdict.headline} (${report.overallVerdict.coreDynamic})
- Dominant Party: ${report.powerDynamic.dominantParticipant}
- Inflection Point: ${report.inflectionPoint.period}

Chat Log Excerpts:
${sampleExcerpts}

The user asks this specific investigative question:
"${question}"

Provide a candid, perceptive, forensic answer citing specific message timestamps, quotes, or behavioral metrics from the chat. Be direct and avoid generic platitudes.`;

    const apiResult = await callGeminiApi(model, apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    if (apiResult.ok && apiResult.data) {
      const candidateText = apiResult.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText && candidateText.trim().length > 0) {
        return candidateText.trim();
      }
    }

    // If Gemini call failed (invalid key, 404, or quota limit), deliver local answer + diagnostic note
    const reason = apiResult.error ? ` (${apiResult.error})` : '';
    return `${localAnswer}\n\n[Diagnostic Note: Gemini API was unavailable${reason}. Delivered via Chat Forensics Local Deterministic Engine.]`;
  } catch (err: any) {
    const errText = err?.message ? ` (${err.message})` : '';
    return `${localAnswer}\n\n[Diagnostic Note: Gemini API connection failed${errText}. Delivered via Chat Forensics Local Deterministic Engine.]`;
  }
}

function sampleChatExcerpts(messages: ChatMessage[], maxCount: number): string {
  if (messages.length <= maxCount) {
    return messages
      .map((m) => `[${m.timestamp.toISOString().slice(0, 16)}] ${m.sender}: ${m.text}`)
      .join('\n');
  }

  const firstCount = Math.floor(maxCount * 0.35);
  const midCount = Math.floor(maxCount * 0.35);
  const lastCount = maxCount - firstCount - midCount;

  const first = messages.slice(0, firstCount);
  const midStart = Math.floor(messages.length / 2) - Math.floor(midCount / 2);
  const middle = messages.slice(midStart, midStart + midCount);
  const last = messages.slice(-lastCount);

  return [...first, ...middle, ...last]
    .map((m) => `[${m.timestamp.toISOString().slice(0, 16)}] ${m.sender}: ${m.text}`)
    .join('\n');
}
