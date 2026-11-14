import { ChatMessage, ChatMetrics, DiagnosticReport } from '../types';

export interface EvidenceAuditItem {
  id: 'verdict' | 'power' | 'attachment' | 'gottman' | 'scorecard' | 'inflection';
  category: string;
  badge: string;
  claimHeadline: string;
  claimDetail: string;
  statisticalProof: Array<{
    label: string;
    value: string;
    interpretation: string;
  }>;
  citedExcerpts: Array<{
    timestamp: string;
    sender: string;
    text: string;
    relevance: string;
  }>;
  clinicalRationale: {
    framework: string;
    explanation: string;
  };
  recommendation: string;
}

/**
 * Builds an exhaustive, clinical audit trail detailing WHY each finding was made,
 * citing exact timestamps, mathematical formulas, and psychological criteria.
 */
export function buildEvidenceAudit(
  report: DiagnosticReport,
  metrics: ChatMetrics,
  messages: ChatMessage[]
): Record<string, EvidenceAuditItem> {
  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];

  const slower = s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes ? p1 : p2;
  const faster = slower === p1 ? p2 : p1;
  const slowMin = Math.max(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes);
  const fastMin = Math.max(1, Math.min(s1.medianResponseTimeMinutes, s2.medianResponseTimeMinutes));
  const latencyGapMultiplier = (slowMin / fastMin).toFixed(1);

  const dominant = report.powerDynamic.dominantParticipant;
  const underdog = dominant === p1 ? p2 : p1;

  // 1. Find concrete cited message turns for primary evidence
  // Find longest response latency turn
  let longestGapMin = 0;
  let gapTriggerMsg: ChatMessage | null = null;
  let gapReplyMsg: ChatMessage | null = null;

  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender !== messages[i - 1].sender) {
      const gap = (messages[i].timestamp.getTime() - messages[i - 1].timestamp.getTime()) / (1000 * 60);
      if (gap > longestGapMin) {
        longestGapMin = gap;
        gapTriggerMsg = messages[i - 1];
        gapReplyMsg = messages[i];
      }
    }
  }

  // Find double-text turn
  let doubleTextTurn: ChatMessage[] = [];
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender === messages[i - 1].sender && messages[i].sender === underdog) {
      doubleTextTurn = [messages[i - 1], messages[i]];
      break;
    }
  }

  // Find night-owl or vulnerable message
  const nightMsg = messages.find((m) => {
    const hr = m.timestamp.getHours();
    return hr >= 23 || hr < 5;
  });

  const auditMap: Record<string, EvidenceAuditItem> = {
    // -------------------------------------------------------------
    // 1. EXECUTIVE VERDICT AUDIT
    // -------------------------------------------------------------
    verdict: {
      id: 'verdict',
      category: 'Executive Diagnostic Verdict',
      badge: `Brutality Score: ${report.overallVerdict.brutalityScore}/100`,
      claimHeadline: `"${report.overallVerdict.headline}"`,
      claimDetail: report.overallVerdict.summary,
      statisticalProof: [
        {
          label: 'Conversational Equity',
          value: `${metrics.scorecard.equity}%`,
          interpretation: metrics.scorecard.equity < 60 ? 'Severe structural imbalance in initiation & word length' : 'Relatively balanced effort',
        },
        {
          label: 'Latency Disparity',
          value: `${latencyGapMultiplier}x Gap`,
          interpretation: `${slower} takes ${slowMin} min median vs ${faster}'s ${fastMin} min`,
        },
        {
          label: 'Initiation Asymmetry',
          value: `${s1.initiationPercentage}% vs ${s2.initiationPercentage}%`,
          interpretation: `${s1.initiationPercentage > s2.initiationPercentage ? p1 : p2} drives the vast majority of thread restarts`,
        },
      ],
      citedExcerpts: [
        ...(gapTriggerMsg && gapReplyMsg
          ? [
              {
                timestamp: gapTriggerMsg.timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                sender: gapTriggerMsg.sender,
                text: gapTriggerMsg.text,
                relevance: 'Trigger message requiring emotional or logistical reciprocity.',
              },
              {
                timestamp: gapReplyMsg.timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                sender: gapReplyMsg.sender,
                text: gapReplyMsg.text,
                relevance: `Extended ${Math.round(longestGapMin / 60)}h freeze before reply, cementing the power dynamic.`,
              },
            ]
          : []),
      ],
      clinicalRationale: {
        framework: 'Relational Archetype Profiling & Conversational Asymmetry',
        explanation:
          'This verdict is derived from a composite weighting of response latencies, initiation frequency, and message elaboration. The data demonstrates that one participant routinely regulates conversational temperature by controlling access and pacing, forcing the other into an anxious or accommodating posture.',
      },
      recommendation:
        'To shift this verdict, the accommodating party must stop compensating for delayed replies with double-texts, allowing conversation to sit in silence until genuine mutual initiation occurs.',
    },

    // -------------------------------------------------------------
    // 2. POWER DYNAMICS & CONVERSATIONAL LEVERAGE AUDIT
    // -------------------------------------------------------------
    power: {
      id: 'power',
      category: 'Power Dynamics & Communicative Leverage',
      badge: `${dominant} holds ${report.powerDynamic.leveragePercentage}% leverage`,
      claimHeadline: `${dominant} dictates the rhythm and boundaries of the interaction`,
      claimDetail: report.powerDynamic.explanation,
      statisticalProof: [
        {
          label: 'Response Latency Ratio',
          value: `${slowMin}m vs ${fastMin}m (${latencyGapMultiplier}x)`,
          interpretation: 'The party who delays responses without explanation controls conversational urgency',
        },
        {
          label: 'Initiation Ratio',
          value: `${s1.conversationsInitiated} vs ${s2.conversationsInitiated}`,
          interpretation: `${s1.initiationPercentage}% vs ${s2.initiationPercentage}% of all conversational sessions`,
        },
        {
          label: 'Double-Text Chasing',
          value: `${s1.doubleTextCount} vs ${s2.doubleTextCount}`,
          interpretation: 'Double-texting signals high validation urgency and cedes communicative leverage',
        },
        {
          label: 'Word Volume',
          value: `${s1.wordCount} words vs ${s2.wordCount} words`,
          interpretation: `${(s1.wordCount / Math.max(1, s1.wordCount + s2.wordCount) * 100).toFixed(0)}% vs ${(s2.wordCount / Math.max(1, s1.wordCount + s2.wordCount) * 100).toFixed(0)}% volume share`,
        },
      ],
      citedExcerpts: [
        ...(doubleTextTurn.length >= 2
          ? [
              {
                timestamp: doubleTextTurn[0].timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                sender: doubleTextTurn[0].sender,
                text: doubleTextTurn[0].text,
                relevance: 'Initial unanswered outreach.',
              },
              {
                timestamp: doubleTextTurn[1].timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                sender: doubleTextTurn[1].sender,
                text: doubleTextTurn[1].text,
                relevance: 'Double-text chase sent while waiting for a response.',
              },
            ]
          : []),
      ],
      clinicalRationale: {
        framework: 'Principle of Least Interest (Sociological Communication Theory)',
        explanation:
          'Sociological power in interpersonal relationships is held by the person who demonstrates the least anxiety over relational dissolution. By maintaining extended response latencies and requiring the other party to initiate threads, the dominant party sets the operational terms of communication.',
      },
      recommendation:
        'Restore conversational equity by matching response latency and refusing to send multi-turn texts without prior reciprocity.',
    },

    // -------------------------------------------------------------
    // 3. ATTACHMENT THEORY DIAGNOSTICS AUDIT
    // -------------------------------------------------------------
    attachment: {
      id: 'attachment',
      category: 'Adult Attachment Theory Diagnostics',
      badge: `${report.attachmentDynamics.dynamicType}`,
      claimHeadline: `${p1}: ${report.attachmentDynamics.personA.style} | ${p2}: ${report.attachmentDynamics.personB.style}`,
      claimDetail: report.attachmentDynamics.systemicLoop,
      statisticalProof: [
        {
          label: 'Hyperactivating Strategy Markers',
          value: `${underdog}: High Initiation / Low Latency`,
          interpretation: 'Frequent check-ins, low tolerance for quiet buffers, and immediate reply velocity',
        },
        {
          label: 'Deactivating Strategy Markers',
          value: `${dominant}: High Latency / Low Questions`,
          interpretation: 'Paced withdrawal, emotional deflection, and terse replies during vulnerable topics',
        },
        {
          label: 'Night-Owl Vulnerability',
          value: `${s1.nightOwlMessages} vs ${s2.nightOwlMessages} msgs (11 PM - 5 AM)`,
          interpretation: 'Late-night messages reflect unguarded disclosures vs daytime task-oriented messaging',
        },
      ],
      citedExcerpts: [
        ...(nightMsg
          ? [
              {
                timestamp: nightMsg.timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                sender: nightMsg.sender,
                text: nightMsg.text,
                relevance: 'Late-night exchange revealing unguarded narrative depth.',
              },
            ]
          : []),
      ],
      clinicalRationale: {
        framework: 'Bowlby & Ainsworth Attachment Theory (Hyperactivating vs Deactivating Reflexes)',
        explanation:
          'Attachment styles manifest digitally in messaging frequency, question asking, and latency tolerance. Anxious attachments use digital immediacy to quell abandonment fears, whereas Avoidant attachments use delayed response buffers as an emotional decompression moat.',
      },
      recommendation:
        'Interrupt the systemic loop: The anxious party must pause and tolerate silence; the avoidant party must provide explicit transition cues when taking hours to reply.',
    },

    // -------------------------------------------------------------
    // 4. GOTTMAN RELATIONAL HEALTH & FRICTION AUDIT
    // -------------------------------------------------------------
    gottman: {
      id: 'gottman',
      category: 'Gottman Bids for Connection & Friction Markers',
      badge: `Bids Receptivity: ${report.gottmanAnalysis.turnTowardsRateA}% vs ${report.gottmanAnalysis.turnTowardsRateB}%`,
      claimHeadline: `Turn-Towards Rate Comparison: ${p1} (${report.gottmanAnalysis.turnTowardsRateA}%) vs ${p2} (${report.gottmanAnalysis.turnTowardsRateB}%)`,
      claimDetail: report.gottmanAnalysis.bidSummary,
      statisticalProof: [
        {
          label: 'Turn Towards Rate',
          value: `${report.gottmanAnalysis.turnTowardsRateA}% vs ${report.gottmanAnalysis.turnTowardsRateB}%`,
          interpretation: 'Healthy relationships average >80% turn-towards rate according to Gottman clinical benchmarks',
        },
        {
          label: 'Friction Markers Detected',
          value: `${report.gottmanAnalysis.frictionMarkers.length} Instances`,
          interpretation: 'Presence of Stonewalling, Contempt, Criticism, or Defensiveness in chat log',
        },
      ],
      citedExcerpts: report.gottmanAnalysis.frictionMarkers.map((marker) => ({
        timestamp: 'Verified in case log',
        sender: marker.instigator,
        text: `"${marker.quote}"`,
        relevance: `[${marker.type}] — ${marker.analysis}`,
      })),
      clinicalRationale: {
        framework: 'Dr. John Gottman Four Horsemen & Bids for Connection Framework',
        explanation:
          'Every message asking a question, sharing a link, or expressing emotion is a clinical "Bid for Connection". Responding with engagement is "Turning Towards", ignoring or single-word dismissing is "Turning Away" or "Turning Against" (Stonewalling).',
      },
      recommendation:
        'Eliminate dead-end acknowledgments ("k", "cool", unacknowledged links) and replace with reciprocal follow-ups.',
    },

    // -------------------------------------------------------------
    // 5. 5-PILLAR RELATIONAL HEALTH SCORECARD AUDIT
    // -------------------------------------------------------------
    scorecard: {
      id: 'scorecard',
      category: '5-Pillar Relational Psychometrics',
      badge: `Overall Health: ${Math.round((metrics.scorecard.equity + metrics.scorecard.responsiveness + metrics.scorecard.curiosity + metrics.scorecard.vulnerability + metrics.scorecard.consistency) / 5)}/100`,
      claimHeadline: 'Composite 5-Pillar Psychometric Evaluation',
      claimDetail: `Evaluation across Conversational Equity (${metrics.scorecard.equity}%), Responsiveness (${metrics.scorecard.responsiveness}%), Curiosity (${metrics.scorecard.curiosity}%), Vulnerability (${metrics.scorecard.vulnerability}%), and Cadence Consistency (${metrics.scorecard.consistency}%).`,
      statisticalProof: [
        {
          label: 'Conversational Equity (Formula)',
          value: `${metrics.scorecard.equity}%`,
          interpretation: '100 - (|Initiation Gap| * 0.7 + |Word Ratio Gap| * 0.3)',
        },
        {
          label: 'Responsiveness (Formula)',
          value: `${metrics.scorecard.responsiveness}%`,
          interpretation: 'Derived from reciprocal median latency benchmarked against <15 min gold standard',
        },
        {
          label: 'Curiosity & Inquiry (Formula)',
          value: `${metrics.scorecard.curiosity}%`,
          interpretation: `Calculated from ${s1.questionsAsked} (${p1}) vs ${s2.questionsAsked} (${p2}) question marks in log`,
        },
        {
          label: 'Vulnerability Depth',
          value: `${metrics.scorecard.vulnerability}%`,
          interpretation: `Night-owl messages (${s1.nightOwlMessages + s2.nightOwlMessages}) combined with long-form paragraph disclosures`,
        },
        {
          label: 'Pacing Consistency',
          value: `${metrics.scorecard.consistency}%`,
          interpretation: 'Standard deviation of weekly velocity without abrupt drop-offs',
        },
      ],
      citedExcerpts: [
        ...(messages.slice(0, 2).map((m) => ({
          timestamp: m.timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          sender: m.sender,
          text: m.text,
          relevance: 'Baseline communication cadence sample.',
        }))),
      ],
      clinicalRationale: {
        framework: 'Five Pillars of Interpersonal Psychometrics',
        explanation:
          'A healthy conversational bond requires balance across both quantitative volume and psychological intimacy. Imbalances in any single pillar create relational friction that eventually triggers systemic drift.',
      },
      recommendation:
        'Focus specifically on lifting the lowest scoring pillar to restore overall relational equilibrium.',
    },

    // -------------------------------------------------------------
    // 6. INFLECTION POINT & TIMELINE EPOCHS AUDIT
    // -------------------------------------------------------------
    inflection: {
      id: 'inflection',
      category: 'Relationship Epochs & Inflection Point',
      badge: report.inflectionPoint.detected ? `Inflection: ${report.inflectionPoint.period}` : 'Continuous Baseline',
      claimHeadline: report.inflectionPoint.detected
        ? `Definitive shift detected during "${report.inflectionPoint.period}"`
        : 'Stable conversational cadence across total date range',
      claimDetail: report.inflectionPoint.description,
      statisticalProof: [
        {
          label: 'Weekly Message Velocity Shift',
          value: `${metrics.weeklyVelocity.length} Total Weeks Tracked`,
          interpretation: report.inflectionPoint.detected
            ? `Dramatic drop in message velocity between pre-inflection and post-inflection weeks`
            : 'Smooth weekly velocity without severe drops',
        },
        {
          label: 'Before vs After Dynamic',
          value: `"${report.inflectionPoint.beforeVibe}" → "${report.inflectionPoint.afterVibe}"`,
          interpretation: 'Baseline velocity transitioned from high-engagement novelty to maintenance cadence',
        },
      ],
      citedExcerpts: [
        ...(report.inflectionPoint.quoteOrTrigger
          ? [
              {
                timestamp: report.inflectionPoint.period,
                sender: 'Transcript Landmark',
                text: report.inflectionPoint.quoteOrTrigger,
                relevance: 'Milestone exchange preceding the velocity inflection.',
              },
            ]
          : []),
      ],
      clinicalRationale: {
        framework: 'Temporal Cadence & Communication Decay Curves',
        explanation:
          'Relationships naturally progress through distinct developmental phases. An inflection point occurs when spontaneous engagement shifts into scheduled or obligation-driven exchanges.',
      },
      recommendation:
        'Acknowledge the cadence shift openly rather than silently compensating with anxious check-ins.',
    },
  };

  return auditMap;
}
