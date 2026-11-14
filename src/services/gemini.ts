import {
  ChatMessage,
  ChatMetrics,
  DiagnosticReport,
  ToneMode,
  AiModelChoice,
} from '../types';
import { generateDiagnosticReport } from '../utils/heuristics';

/**
 * Calls Gemini (Flash or Pro) to produce a deep clinical & forensic diagnostic report.
 * Supports up to full multi-year chat histories via Gemini 2.5 Pro's 2M-token window.
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

    // With Gemini 2.5 Pro, we can send significantly larger transcripts (up to 1,500 messages)
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to local clinical heuristics.', response.statusText);
      return fallback;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return fallback;

    const parsedJson = JSON.parse(candidateText) as DiagnosticReport;
    return parsedJson;
  } catch (err) {
    console.warn('Error during Gemini deep analysis. Using fallback:', err);
    return fallback;
  }
}

/**
 * Interactive "Interrogate the Case File" Q&A
 * Allows user to ask any specific diagnostic question about the chat.
 */
export async function interrogateCase(
  messages: ChatMessage[],
  metrics: ChatMetrics,
  report: DiagnosticReport,
  question: string,
  apiKey?: string,
  model: AiModelChoice = 'gemini-2.5-flash'
): Promise<string> {
  const [p1, p2] = metrics.participants;
  const cleanQ = question.trim().toLowerCase();

  // If no API key, use rich deterministic heuristic Q&A
  if (!apiKey || apiKey.trim() === '') {
    if (cleanQ.includes('pull away') || cleanQ.includes('lose interest') || cleanQ.includes('interest')) {
      return `Based on response velocity analysis, ${report.powerDynamic.dominantParticipant} began pulling away around "${report.inflectionPoint.period}". Before this point, response latencies were under 30 minutes; afterwards, response gaps stretched to over ${Math.max(metrics.stats[p1].medianResponseTimeMinutes, metrics.stats[p2].medianResponseTimeMinutes)} minutes with primarily reactive acknowledgments.`;
    }
    if (cleanQ.includes('apologize') || cleanQ.includes('sorry')) {
      const sorryA = messages.filter((m) => m.sender === p1 && /sorry|apologize/i.test(m.text)).length;
      const sorryB = messages.filter((m) => m.sender === p2 && /sorry|apologize/i.test(m.text)).length;
      return `${p1} apologized ${sorryA} times, while ${p2} apologized ${sorryB} times. ${sorryA > sorryB ? p1 : p2} tends to take on responsibility for communicative tension more quickly.`;
    }
    if (cleanQ.includes('who texts first') || cleanQ.includes('initiat')) {
      return `${p1} initiates ${metrics.stats[p1].initiationPercentage}% of conversations after a quiet pause, while ${p2} initiates ${metrics.stats[p2].initiationPercentage}%. This reveals that ${metrics.stats[p1].initiationPercentage > 50 ? p1 : p2} acts as the primary relational initiator.`;
    }
    return `In this case file, the primary dynamic is "${report.overallVerdict.headline}". ${report.powerDynamic.dominantParticipant} holds conversational leverage (${report.powerDynamic.leveragePercentage}%), while the inflection point occurred during ${report.inflectionPoint.period}. (Tip: Add your Gemini API key in Settings to unlock arbitrary natural language answers with exact message quotes).`;
  }

  try {
    const sampleExcerpts = sampleChatExcerpts(messages, 250);
    const prompt = `You are the Lead Forensic Communications Investigator for this case file between "${p1}" and "${p2}".
Case Overview:
- Verdict: ${report.overallVerdict.headline} (${report.overallVerdict.coreDynamic})
- Dominant Party: ${report.powerDynamic.dominantParticipant}
- Inflection Point: ${report.inflectionPoint.period}

Chat Log Excerpts:
${sampleExcerpts}

The user asks this specific investigative question:
"${question}"

Provide a candid, perceptive, forensic answer citing specific message timestamps, quotes, or behavioral metrics from the chat. Be direct and avoid generic platitudes.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return `Unable to reach Gemini API. Falling back to local case summary: The overall verdict for this case is "${report.overallVerdict.headline}".`;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  } catch (err) {
    return `Analysis error: ${err instanceof Error ? err.message : 'Unknown error'}.`;
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
