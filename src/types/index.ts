export interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: string;
  text: string;
  isMedia: boolean;
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  wordCount: number;
  characterCount: number;
  conversationsInitiated: number;
  initiationPercentage: number;
  medianResponseTimeMinutes: number;
  averageResponseTimeMinutes: number;
  doubleTextCount: number;
  nightOwlMessages: number;
  questionsAsked: number;
  topEmojis: { emoji: string; count: number }[];
}

export interface RelationalScorecard {
  equity: number; // 0 to 100
  responsiveness: number;
  curiosity: number;
  vulnerability: number;
  consistency: number;
}

export interface ChatMetrics {
  participants: [string, string];
  totalMessages: number;
  dateRange: {
    start: Date;
    end: Date;
    totalDays: number;
  };
  stats: Record<string, ParticipantStats>;
  hourlyActivity: Record<number, { hour: number; countA: number; countB: number }>;
  weeklyVelocity: Array<{ weekLabel: string; countA: number; countB: number }>;
  scorecard: RelationalScorecard;
}

export interface BehavioralPattern {
  title: string;
  subject: string;
  evidence: string;
  interpretation: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AttachmentProfile {
  style: 'Anxious-Preoccupied' | 'Dismissive-Avoidant' | 'Fearful-Avoidant' | 'Secure-Autonomous';
  summary: string;
  observableTriggers: string[];
}

export interface GottmanFrictionMarker {
  type: 'Criticism' | 'Contempt' | 'Defensiveness' | 'Stonewalling';
  instigator: string;
  quote: string;
  analysis: string;
}

export interface RelationshipEpoch {
  chapterNumber: number;
  title: string;
  timeframe: string;
  vibeScore: number;
  cadence: string;
  summary: string;
  keyMomentQuote: string;
}

export interface QnAPair {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  isAiGenerated: boolean;
}

export interface DiagnosticReport {
  caseMetadata: {
    caseNumber: string;
    participants: [string, string];
    dateRange: string;
    totalMessagesAnalyzed: number;
    generatedAt: string;
    depthLevel: 'Standard Forensics' | 'Deep Clinical Psychology';
  };
  overallVerdict: {
    headline: string;
    archetypeTitle: string;
    brutalityScore: number;
    summary: string;
    coreDynamic: string;
  };
  powerDynamic: {
    dominantParticipant: string | 'Equal Balance';
    leveragePercentage: number;
    explanation: string;
    tacticsObserved: string[];
  };
  inflectionPoint: {
    detected: boolean;
    period: string;
    description: string;
    quoteOrTrigger: string;
    beforeVibe: string;
    afterVibe: string;
  };
  attachmentDynamics: {
    dynamicType: string;
    personA: AttachmentProfile;
    personB: AttachmentProfile;
    systemicLoop: string;
  };
  gottmanAnalysis: {
    turnTowardsRateA: number;
    turnTowardsRateB: number;
    bidSummary: string;
    frictionMarkers: GottmanFrictionMarker[];
  };
  relationshipEpochs: RelationshipEpoch[];
  behavioralPatterns: BehavioralPattern[];
  flags: {
    redFlags: Array<{ person: string; flag: string }>;
    greenFlags: Array<{ person: string; flag: string }>;
  };
  actionableAdvice: {
    forPersonA: string;
    forPersonB: string;
    theBottomLine: string;
  };
}

export type ToneMode = 'candid' | 'constructive' | 'analytical';
export type AiModelChoice = 'gemini-2.5-flash' | 'gemini-2.5-pro';
