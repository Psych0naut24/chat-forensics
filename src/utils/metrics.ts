import { ChatMessage, ChatMetrics, ParticipantStats, RelationalScorecard } from '../types';

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

  const INITIATION_GAP_MS = 4 * 60 * 60 * 1000;
  let lastMessage: ChatMessage | null = null;
  let currentRunSender: string | null = null;
  let runLength = 0;

  const weeklyMap: Record<string, { countA: number; countB: number }> = {};

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.sender !== p1 && msg.sender !== p2) continue;

    const pStat = stats[msg.sender];
    pStat.messageCount++;

    const words = msg.text.trim().split(/\s+/).filter(Boolean);
    pStat.wordCount += words.length;
    pStat.characterCount += msg.text.length;

    if (msg.text.includes('?')) {
      pStat.questionsAsked += (msg.text.match(/\?/g) || []).length;
    }

    const hour = msg.timestamp.getHours();
    if (msg.sender === p1) {
      hourlyActivity[hour].countA++;
    } else {
      hourlyActivity[hour].countB++;
    }

    if (hour >= 23 || hour < 5) {
      pStat.nightOwlMessages++;
    }

    const weekKey = getWeekKey(msg.timestamp);
    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = { countA: 0, countB: 0 };
    }
    if (msg.sender === p1) {
      weeklyMap[weekKey].countA++;
    } else {
      weeklyMap[weekKey].countB++;
    }

    if (lastMessage) {
      const timeDiffMs = msg.timestamp.getTime() - lastMessage.timestamp.getTime();

      if (timeDiffMs >= INITIATION_GAP_MS) {
        pStat.conversationsInitiated++;
      }

      if (msg.sender !== lastMessage.sender) {
        const latencyMinutes = Math.max(0.1, timeDiffMs / (60 * 1000));
        if (latencyMinutes <= 72 * 60) {
          responseLatencies[msg.sender].push(latencyMinutes);
        }
      }
    } else {
      pStat.conversationsInitiated++;
    }

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

  const totalInitiations = stats[p1].conversationsInitiated + stats[p2].conversationsInitiated;
  stats[p1].initiationPercentage =
    totalInitiations > 0 ? Math.round((stats[p1].conversationsInitiated / totalInitiations) * 100) : 50;
  stats[p2].initiationPercentage =
    totalInitiations > 0 ? Math.round((stats[p2].conversationsInitiated / totalInitiations) * 100) : 50;

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

  // Relational Scorecard (0 to 100)
  const totalWords = stats[p1].wordCount + stats[p2].wordCount;
  const initDiff = Math.abs(stats[p1].initiationPercentage - 50);
  const wordDiff = Math.abs((stats[p1].wordCount / (totalWords || 1)) * 100 - 50);
  const equityScore = Math.max(15, Math.min(98, Math.round(100 - (initDiff * 1.1 + wordDiff * 0.7))));

  const avgLatency = (stats[p1].medianResponseTimeMinutes + stats[p2].medianResponseTimeMinutes) / 2;
  const responsivenessScore = Math.max(15, Math.min(98, Math.round(100 - Math.min(85, avgLatency * 0.35))));

  const totalQuestions = stats[p1].questionsAsked + stats[p2].questionsAsked;
  const curiosityScore = Math.max(20, Math.min(95, Math.round(Math.min(95, 30 + (totalQuestions / (messages.length || 1)) * 300))));

  const totalNight = stats[p1].nightOwlMessages + stats[p2].nightOwlMessages;
  const vulnerabilityScore = Math.max(25, Math.min(95, Math.round(35 + (totalNight / (messages.length || 1)) * 250)));

  const consistencyScore =
    weeklyVelocity.length <= 1
      ? 85
      : Math.max(20, Math.min(95, Math.round(85 - Math.abs(stats[p1].doubleTextCount - stats[p2].doubleTextCount) * 4)));

  const scorecard: RelationalScorecard = {
    equity: equityScore,
    responsiveness: responsivenessScore,
    curiosity: curiosityScore,
    vulnerability: vulnerabilityScore,
    consistency: consistencyScore,
  };

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
    scorecard,
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
