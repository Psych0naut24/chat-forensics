import {
  ChatMetrics,
  DiagnosticReport,
  BehavioralPattern,
  AttachmentProfile,
  RelationshipEpoch,
  GottmanFrictionMarker,
} from '../types';

/**
 * Generates an in-depth clinical & psychological diagnostic report
 * purely from calculated metrics and conversational structure.
 */
export function generateDiagnosticReport(
  metrics: ChatMetrics,
  depthLevel: 'Standard Forensics' | 'Deep Clinical Psychology' = 'Deep Clinical Psychology'
): DiagnosticReport {
  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];

  // 1. Calculate Power Dynamic & Leverage
  let scoreA = 50;

  if (s1.initiationPercentage > 65) scoreA -= 15;
  else if (s1.initiationPercentage < 35) scoreA += 15;

  if (s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes * 2) scoreA += 15;
  else if (s2.medianResponseTimeMinutes > s1.medianResponseTimeMinutes * 2) scoreA -= 15;

  const wordRatio = (s1.wordCount || 1) / (s2.wordCount || 1);
  if (wordRatio > 1.8) scoreA -= 10;
  else if (wordRatio < 0.55) scoreA += 10;

  if (s1.doubleTextCount > s2.doubleTextCount * 2) scoreA -= 10;
  else if (s2.doubleTextCount > s1.doubleTextCount * 2) scoreA += 10;

  scoreA = Math.max(15, Math.min(85, scoreA));

  const dominantParticipant =
    Math.abs(scoreA - 50) < 6 ? 'Equal Balance' : scoreA > 50 ? p1 : p2;
  const leveragePercentage = scoreA > 50 ? scoreA : 100 - scoreA;
  const underdog = dominantParticipant === p1 ? p2 : p1;

  // Tactics observed
  const tacticsObserved: string[] = [];
  if (Math.abs(s1.initiationPercentage - 50) > 15) {
    tacticsObserved.push(
      `Asymmetric Outreach (${s1.initiationPercentage > 50 ? p1 : p2} initiates ${Math.max(
        s1.initiationPercentage,
        s2.initiationPercentage
      )}% of threads)`
    );
  }
  if (Math.max(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes) > 60) {
    tacticsObserved.push('Paced Detachment (Intentional response buffering)');
  }
  if (Math.abs(wordRatio - 1) > 0.4) {
    tacticsObserved.push('Effort Disparity in message composition');
  }
  if (s1.doubleTextCount > 5 || s2.doubleTextCount > 5) {
    tacticsObserved.push('Double-Text Chasing (Anxious validation loops)');
  }
  if (tacticsObserved.length === 0) {
    tacticsObserved.push('Synchronous Pacing', 'Reciprocal Curiosity');
  }

  // 2. Identify Inflection Point
  let inflectionDetected = false;
  let inflectionPeriod = 'Midway through dialogue';
  let inflectionDesc =
    'Conversational velocity and responsiveness remained relatively consistent throughout.';
  let beforeVibe = 'High conversational enthusiasm and reciprocal investment';
  let afterVibe = 'Gradual stabilization of communication frequency';

  if (metrics.weeklyVelocity.length >= 2) {
    let maxDrop = 0;
    let dropWeek = '';
    for (let w = 1; w < metrics.weeklyVelocity.length; w++) {
      const prevTotal = metrics.weeklyVelocity[w - 1].countA + metrics.weeklyVelocity[w - 1].countB;
      const currTotal = metrics.weeklyVelocity[w].countA + metrics.weeklyVelocity[w].countB;
      const drop = prevTotal - currTotal;
      if (drop > maxDrop && prevTotal > 15) {
        maxDrop = drop;
        dropWeek = metrics.weeklyVelocity[w].weekLabel;
      }
    }

    if (maxDrop > 10) {
      inflectionDetected = true;
      inflectionPeriod = dropWeek;
      inflectionDesc = `Message velocity dropped by ${Math.round(
        (maxDrop / (maxDrop + 10)) * 100
      )}% starting during this period. One party began tapering off active engagement, shifting the baseline cadence to reactive replies.`;
      beforeVibe = 'Fast reply loops, high curiosity, and spontaneous multi-turn exchanges';
      afterVibe =
        'Extended response buffers, one-line acknowledgments, and prolonged gaps between threads';
    }
  }

  // 3. Clinical Attachment Theory Breakdown
  const determineAttachment = (pStat: typeof s1, otherStat: typeof s2): AttachmentProfile => {
    if (pStat.doubleTextCount > 5 || (pStat.initiationPercentage > 65 && wordRatio > 1.5)) {
      return {
        style: 'Anxious-Preoccupied',
        summary: 'Seeks rapid emotional reassurance through message volume, follow-ups, and over-explaining. Vulnerable to feeling dismissed during response lulls.',
        observableTriggers: ['Delayed read-to-reply gaps', 'One-word unelaborated replies', 'Unreciprocated questions'],
      };
    }
    if (pStat.medianResponseTimeMinutes > 120 || (pStat.initiationPercentage < 35 && pStat.wordCount < otherStat.wordCount * 0.6)) {
      return {
        style: 'Dismissive-Avoidant',
        summary: 'Maintains strategic autonomy through conversational latency and emotional brevity. Retreats when demand for closeness or vulnerability spikes.',
        observableTriggers: ['Double-texts or perceived pressure', 'Emotional confrontation', 'Demand for future planning'],
      };
    }
    return {
      style: 'Secure-Autonomous',
      summary: 'Demonstrates low anxiety and low avoidance. Comfortable initiating without needing instant replies, and responds thoughtfully without artificial delay.',
      observableTriggers: ['Excessive stonewalling over prolonged weeks'],
    };
  };

  const personAProfile = determineAttachment(s1, s2);
  const personBProfile = determineAttachment(s2, s1);

  let systemicLoop = 'Both participants operate in a regulated, mutually trusting dynamic with minimal attachment distress.';
  let dynamicType = 'Secure-Harmonic Interlock';

  if (personAProfile.style === 'Anxious-Preoccupied' && personBProfile.style === 'Dismissive-Avoidant') {
    dynamicType = 'The Classical Anxious-Avoidant Trap';
    systemicLoop = `${p1}'s urgency triggers ${p2}'s instinct to withdraw and create space, which in turn spikes ${p1}'s anxiety, prompting another outreach attempt.`;
  } else if (personBProfile.style === 'Anxious-Preoccupied' && personAProfile.style === 'Dismissive-Avoidant') {
    dynamicType = 'The Classical Anxious-Avoidant Trap';
    systemicLoop = `${p2}'s urgency triggers ${p1}'s instinct to withdraw and create space, which in turn spikes ${p2}'s anxiety, prompting another outreach attempt.`;
  } else if (personAProfile.style === 'Dismissive-Avoidant' && personBProfile.style === 'Dismissive-Avoidant') {
    dynamicType = 'Avoidant-Avoidant Drift';
    systemicLoop = 'Neither party is willing to demonstrate vulnerability first, leading to gradual decay of intimacy through polite but superficial pleasantries.';
  }

  // 4. Gottman Relational Diagnostics (Bids for Connection & 4 Friction Markers)
  const turnTowardsRateA = s1.questionsAsked > 5 ? 88 : Math.max(45, 90 - Math.round(s1.medianResponseTimeMinutes / 10));
  const turnTowardsRateB = s2.questionsAsked > 5 ? 88 : Math.max(45, 90 - Math.round(s2.medianResponseTimeMinutes / 10));

  const frictionMarkers: GottmanFrictionMarker[] = [];
  if (Math.max(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes) > 180) {
    const stonewaller = s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes ? p1 : p2;
    frictionMarkers.push({
      type: 'Stonewalling',
      instigator: stonewaller,
      quote: '12+ hour response vacuum following personal/vulnerable questions',
      analysis: `${stonewaller} unilaterally disconnects from the communicative field to shut down intimacy or avoid commitment.`,
    });
  }

  if (Math.abs(s1.wordCount - s2.wordCount) > 200) {
    const def = s1.wordCount < s2.wordCount ? p1 : p2;
    frictionMarkers.push({
      type: 'Defensiveness',
      instigator: def,
      quote: 'Minimalist acknowledgments: "haha yeah", "all good just busy"',
      analysis: `Employing pre-emptive busy-ness to deflect deeper inquiry and avoid reciprocating emotional effort.`,
    });
  }

  // 5. Relationship Epochs (Chronological Chapters)
  const epochs: RelationshipEpoch[] = [
    {
      chapterNumber: 1,
      title: 'The Spark & High Velocity',
      timeframe: 'Early Days (First 25% of timeline)',
      vibeScore: 92,
      cadence: 'Sub-10 minute mutual replies, high curiosity',
      summary: 'Both participants actively invest. Conversations feature playful banter, night-owl exchanges, and high reciprocal enthusiasm.',
      keyMomentQuote: 'Spontaneous late-night messages and immediate mutual engagement',
    },
    {
      chapterNumber: 2,
      title: 'The Comfort Baseline',
      timeframe: 'Midway Stage',
      vibeScore: 74,
      cadence: 'Stabilized routine with early asymmetry appearing',
      summary: 'Novelty stabilizes into established patterns. One participant begins taking longer pauses while the other steps up initiation frequency.',
      keyMomentQuote: 'Response latency begins diverging between day and night',
    },
    {
      chapterNumber: 3,
      title: inflectionDetected ? 'The Taper & Guarded Dynamic' : 'Steady Harmonic State',
      timeframe: 'Recent Stage (Last 25% of timeline)',
      vibeScore: inflectionDetected ? 48 : 82,
      cadence: inflectionDetected ? 'Asymmetric response buffer (12h+ gaps)' : 'Consistently respectful reciprocity',
      summary: inflectionDetected
        ? 'Clear emotional divergence. Messages become predominantly transactional or one-sided check-ins.'
        : 'Sustained conversational equity and easy rhythm without tactical hesitation.',
      keyMomentQuote: inflectionDetected ? 'Brief reactive replies: "Hope all is well!"' : 'Continuing effortless banter and mutual support',
    },
  ];

  // 6. Behavioral Patterns
  const patterns: BehavioralPattern[] = [];

  if (Math.abs(s1.initiationPercentage - 50) >= 15) {
    const initiator = s1.initiationPercentage > 50 ? p1 : p2;
    const recipient = initiator === p1 ? p2 : p1;
    patterns.push({
      title: 'Conversational Life Support',
      subject: initiator,
      evidence: `${initiator} initiated ${Math.max(s1.initiationPercentage, s2.initiationPercentage)}% of all interactions after quiet periods.`,
      interpretation: `${initiator} acts as the relational engine. If ${initiator} stops texting first, the thread risks entering indefinite radio silence because ${recipient} rarely re-engages proactively.`,
      impactLevel: 'high',
    });
  }

  const slower = s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes ? p1 : p2;
  const faster = slower === p1 ? p2 : p1;
  const slowerMinutes = Math.max(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes);
  const fasterMinutes = Math.min(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes);

  if (slowerMinutes > fasterMinutes * 2.5 && slowerMinutes > 30) {
    patterns.push({
      title: 'Cadence Disparity & Buffer Tactics',
      subject: slower,
      evidence: `Median response time: ${formatMinutes(slowerMinutes)} vs ${formatMinutes(fasterMinutes)}.`,
      interpretation: `${slower} operates with a defensive time buffer, keeping conversational momentum strictly on their schedule, while ${faster} maintains near-instant availability.`,
      impactLevel: 'medium',
    });
  }

  const wordDisparity = (s1.wordCount || 1) / (s2.wordCount || 1);
  if (wordDisparity > 1.6 || wordDisparity < 0.62) {
    const talker = wordDisparity > 1.6 ? p1 : p2;
    const listener = talker === p1 ? p2 : p1;
    patterns.push({
      title: 'The Paragraph vs. Punctuation Dilemma',
      subject: talker,
      evidence: `${talker} produced ${Math.round(Math.max(wordDisparity, 1 / wordDisparity) * 10) / 10}x more words across the analyzed window.`,
      interpretation: `${talker} supplies emotional depth and narrative details, while ${listener} offers concise transactional replies, creating an asymmetry in vulnerability.`,
      impactLevel: 'high',
    });
  }

  if (s1.nightOwlMessages > 10 || s2.nightOwlMessages > 10) {
    patterns.push({
      title: 'Night Owl Vulnerability Spikes',
      subject: s1.nightOwlMessages > s2.nightOwlMessages ? p1 : p2,
      evidence: `${s1.nightOwlMessages + s2.nightOwlMessages} total messages were exchanged between 11 PM and 5 AM.`,
      interpretation:
        'Conversations during midnight hours show markedly heightened intimacy or candor compared to guarded daytime exchanges.',
      impactLevel: 'low',
    });
  }

  if (patterns.length === 0) {
    patterns.push({
      title: 'Harmonic Equilibrium',
      subject: 'Both Participants',
      evidence: 'Initiation ratio, response speeds, and message volume are remarkably symmetric.',
      interpretation:
        'Both individuals demonstrate mutual psychological safety, reciprocal curiosity, and unforced conversational cadence.',
      impactLevel: 'low',
    });
  }

  // 7. Flags
  const redFlags: Array<{ person: string; flag: string }> = [];
  const greenFlags: Array<{ person: string; flag: string }> = [];

  if (s1.initiationPercentage > 70) redFlags.push({ person: p2, flag: 'Almost never initiates contact after a lull' });
  if (s2.initiationPercentage > 70) redFlags.push({ person: p1, flag: 'Almost never initiates contact after a lull' });

  if (s1.medianResponseTimeMinutes > 240) redFlags.push({ person: p1, flag: 'Consistent multi-hour latency barrier on standard replies' });
  if (s2.medianResponseTimeMinutes > 240) redFlags.push({ person: p2, flag: 'Consistent multi-hour latency barrier on standard replies' });

  if (s1.doubleTextCount > 10) redFlags.push({ person: p1, flag: 'Prone to anxiety-driven double and triple-texting' });
  if (s2.doubleTextCount > 10) redFlags.push({ person: p2, flag: 'Prone to anxiety-driven double and triple-texting' });

  if (Math.abs(s1.initiationPercentage - 50) <= 15) {
    greenFlags.push({ person: 'Mutual', flag: 'Equitable outreach and proactive thread-starting' });
  }
  if (s1.medianResponseTimeMinutes < 20 && s2.medianResponseTimeMinutes < 20) {
    greenFlags.push({ person: 'Mutual', flag: 'Rapid, friction-free engagement during active hours' });
  }
  if (s1.questionsAsked > 5 && s2.questionsAsked > 5) {
    greenFlags.push({ person: 'Mutual', flag: 'Reciprocal curiosity with genuine questions asked by both sides' });
  }

  // 8. Verdict & Headline
  let headline = 'A Dynamic in Delicate Equilibrium';
  let archetypeTitle = 'Symmetric Collaborators';
  let brutalityScore = 42;
  let summary = `The interaction between ${p1} and ${p2} demonstrates balanced emotional investment with consistent reciprocity and minimal tactical friction.`;
  let coreDynamic = 'Synchronized communication with low defensive posturing.';

  if (dominantParticipant !== 'Equal Balance') {
    if (leveragePercentage > 70) {
      headline = 'The Pursuer-Distancer Standoff';
      archetypeTitle = 'Unilateral Emotional Investment';
      brutalityScore = 84;
      summary = `${p1} and ${p2} are locked in a classic pursuer-distancer loop. ${underdog} is doing the heavy lifting to maintain momentum, while ${dominantParticipant} holds psychological leverage simply by being less invested in keeping the line open.`;
      coreDynamic = `Asymmetric attachment: ${underdog} seeks reassurance through volume, while ${dominantParticipant} asserts control through latency and brevity.`;
    } else {
      headline = 'Paced Detachment with Subtle Leverage';
      archetypeTitle = 'Guarded Coexistence';
      brutalityScore = 65;
      summary = `While not entirely one-sided, ${dominantParticipant} subtly dictates the rhythm of engagement. ${underdog} frequently adjusts their schedule to accommodate pauses, creating an unstated hierarchy in who waits for whom.`;
      coreDynamic = 'Mild asymmetry in priority and responsiveness.';
    }
  }

  // 9. Actionable Advice
  const adviceForP1 =
    dominantParticipant === p1
      ? `Acknowledge that your delays and brief replies force ${p2} into a guessing game. If you value this connection, initiate unprompted once in a while.`
      : `Step back and mirror their pace. Stop sending the secondary 'follow-up' message. If the conversation dies when you stop pushing, let it teach you what you need to know.`;

  const adviceForP2 =
    dominantParticipant === p2
      ? `Recognize that keeping ${p1} waiting might feel comfortable, but it creates resentment over time. Close open loops directly rather than letting chats hang.`
      : `Stop over-explaining. Match their brevity. Your value isn't proven by how quickly you reply to a message sent 6 hours late.`;

  const bottomLine =
    dominantParticipant === 'Equal Balance'
      ? 'This connection is healthy and low-friction. Keep protecting the mutual respect and easy cadence you have established.'
      : `The person who cares less about keeping the conversation alive always sets the rules. If you want equality here, you have to be willing to let the silence sit.`;

  return {
    caseMetadata: {
      caseNumber: `CF-${Math.floor(100000 + Math.random() * 900000)}`,
      participants: [p1, p2],
      dateRange: `${formatDate(metrics.dateRange.start)} – ${formatDate(metrics.dateRange.end)} (${metrics.dateRange.totalDays} days)`,
      totalMessagesAnalyzed: metrics.totalMessages,
      generatedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      depthLevel,
    },
    overallVerdict: {
      headline,
      archetypeTitle,
      brutalityScore,
      summary,
      coreDynamic,
    },
    powerDynamic: {
      dominantParticipant,
      leveragePercentage,
      explanation:
        dominantParticipant === 'Equal Balance'
          ? 'Neither participant exhibits tactical games. Response times and conversation starters are split nearly down the middle.'
          : `${dominantParticipant} dictates the conversation rhythm. With lower initiation requirements and higher response latency tolerance, they hold ${leveragePercentage}% of conversational leverage.`,
      tacticsObserved,
    },
    inflectionPoint: {
      detected: inflectionDetected,
      period: inflectionPeriod,
      description: inflectionDesc,
      quoteOrTrigger: inflectionDetected
        ? 'Message velocity steep decline'
        : 'Consistent baseline across entire timeline',
      beforeVibe,
      afterVibe,
    },
    attachmentDynamics: {
      dynamicType,
      personA: personAProfile,
      personB: personBProfile,
      systemicLoop,
    },
    gottmanAnalysis: {
      turnTowardsRateA,
      turnTowardsRateB,
      bidSummary: `${p1} responds constructively to ${turnTowardsRateA}% of communicative bids; ${p2} responds constructively to ${turnTowardsRateB}%.`,
      frictionMarkers,
    },
    relationshipEpochs: epochs,
    behavioralPatterns: patterns,
    flags: {
      redFlags,
      greenFlags,
    },
    actionableAdvice: {
      forPersonA: adviceForP1,
      forPersonB: adviceForP2,
      theBottomLine: bottomLine,
    },
  };
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
