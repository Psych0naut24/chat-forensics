import React from 'react';
import { RelationalScorecard } from '../types';
import { Scale, Zap, HelpCircle, Heart, Activity } from 'lucide-react';

interface RadarScorecardProps {
  scorecard: RelationalScorecard;
  participants: [string, string];
}

export const RadarScorecard: React.FC<RadarScorecardProps> = ({ scorecard, participants }) => {
  const [p1, p2] = participants;

  const pillars = [
    {
      label: 'Conversational Equity',
      score: scorecard.equity,
      icon: Scale,
      color: 'amber',
      desc: 'Balance of initiation and word volume between both participants.',
      grade: scorecard.equity > 75 ? 'Harmonic' : scorecard.equity > 50 ? 'Mild Asymmetry' : 'Severe Imbalance',
    },
    {
      label: 'Responsiveness',
      score: scorecard.responsiveness,
      icon: Zap,
      color: 'emerald',
      desc: 'Speed of replies and minimal intentional latency buffering.',
      grade: scorecard.responsiveness > 75 ? 'Synchronized' : scorecard.responsiveness > 50 ? 'Buffered' : 'Protracted Delay',
    },
    {
      label: 'Curiosity & Inquiry',
      score: scorecard.curiosity,
      icon: HelpCircle,
      color: 'cyan',
      desc: 'Frequency of questions and reciprocal follow-up inquiries.',
      grade: scorecard.curiosity > 70 ? 'Deep Inquiry' : scorecard.curiosity > 45 ? 'Moderate' : 'Low Reciprocity',
    },
    {
      label: 'Vulnerability Depth',
      score: scorecard.vulnerability,
      icon: Heart,
      color: 'purple',
      desc: 'Night-owl exchanges and willingness to share long-form emotion.',
      grade: scorecard.vulnerability > 70 ? 'High Intimacy' : scorecard.vulnerability > 45 ? 'Guarded' : 'Transactional',
    },
    {
      label: 'Pacing Consistency',
      score: scorecard.consistency,
      icon: Activity,
      color: 'rose',
      desc: 'Stability of communication cadence without abrupt velocity drops.',
      grade: scorecard.consistency > 75 ? 'Stable' : scorecard.consistency > 50 ? 'Fluctuating' : 'High Friction',
    },
  ];

  const overallHealth = Math.round(
    (scorecard.equity +
      scorecard.responsiveness +
      scorecard.curiosity +
      scorecard.vulnerability +
      scorecard.consistency) /
      5
  );

  return (
    <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-obsidian-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 font-serif flex items-center gap-2">
            <span>Relational Health Scorecard</span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              5-Pillar Matrix
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Psychometric evaluation of conversational dynamics between {p1} and {p2}
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Relational Health</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {overallHealth > 75 ? 'Optimal Bond' : overallHealth > 55 ? 'Moderate Friction' : 'High Attrition'}
            </span>
          </div>
          <div className="text-2xl font-serif font-extrabold text-slate-100 font-mono">
            {overallHealth}<span className="text-slate-500 text-sm font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* 5 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 flex flex-col justify-between space-y-3 relative group hover:border-obsidian-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-obsidian-900 border border-obsidian-800 flex items-center justify-center text-indigo-600 dark:text-amber-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {p.score}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{p.label}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-obsidian-900">
                <div className="w-full h-1.5 rounded-full bg-obsidian-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-amber-500 dark:to-amber-400 transition-all duration-500"
                    style={{ width: `${p.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-700 dark:text-amber-400/90 font-bold block">
                  {p.grade}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
