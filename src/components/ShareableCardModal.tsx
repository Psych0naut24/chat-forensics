import React, { useRef, useState } from 'react';
import { X, Share2, ShieldCheck, Check } from 'lucide-react';
import { DiagnosticReport, ChatMetrics } from '../types';

interface ShareableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DiagnosticReport;
  metrics: ChatMetrics;
}

export const ShareableCardModal: React.FC<ShareableCardModalProps> = ({
  isOpen,
  onClose,
  report,
  metrics,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];

  const handleCopySummary = () => {
    const text = `🔍 CHAT FORENSICS REPORT: ${p1} & ${p2}\n\n` +
      `Verdict: ${report.overallVerdict.headline}\n` +
      `Archetype: ${report.overallVerdict.archetypeTitle}\n` +
      `Dominant Party: ${report.powerDynamic.dominantParticipant} (${report.powerDynamic.leveragePercentage}% leverage)\n` +
      `Initiations: ${p1} (${s1.initiationPercentage}%) vs ${p2} (${s2.initiationPercentage}%)\n` +
      `Response Latency: ${p1} (${s1.medianResponseTimeMinutes}m) vs ${p2} (${s2.medianResponseTimeMinutes}m)\n\n` +
      `Bottom Line: "${report.actionableAdvice.theBottomLine}"\n\n` +
      `Generated with Chat Forensics.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-obsidian-900 border border-obsidian-700/80 rounded-2xl shadow-2xl p-5 overflow-hidden flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-obsidian-800">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
            Social Report Card
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 9:16 Social Story Card Preview */}
        <div
          ref={cardRef}
          className="w-full rounded-2xl bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-black border-2 border-amber-500/40 p-5 shadow-2xl space-y-4 relative overflow-hidden"
        >
          {/* Card Top Branding */}
          <div className="flex items-center justify-between border-b border-obsidian-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-450">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200">
                Chat Forensics
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {report.caseMetadata.caseNumber}
            </span>
          </div>

          {/* Subjects */}
          <div className="text-center space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Diagnostic Dossier
            </div>
            <div className="text-lg font-serif font-bold text-slate-100">
              {p1} <span className="text-amber-400 font-sans font-normal">&</span> {p2}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              {metrics.totalMessages} Messages • {metrics.dateRange.totalDays} Days
            </div>
          </div>

          {/* Headline Verdict */}
          <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-amber-500/30 text-center space-y-1 shadow-inner">
            <div className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              The Verdict
            </div>
            <div className="text-sm font-serif font-bold text-slate-100 leading-snug">
              "{report.overallVerdict.headline}"
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              {report.overallVerdict.archetypeTitle}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-obsidian-900 border border-obsidian-800">
              <div className="text-[9px] font-mono text-slate-400 uppercase">Initiation Gap</div>
              <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                {s1.initiationPercentage}% vs {s2.initiationPercentage}%
              </div>
              <div className="text-[9px] text-slate-500 truncate">{s1.initiationPercentage > 50 ? p1 : p2} texts first</div>
            </div>
            <div className="p-2 rounded-lg bg-obsidian-900 border border-obsidian-800">
              <div className="text-[9px] font-mono text-slate-400 uppercase">Median Latency</div>
              <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                {s1.medianResponseTimeMinutes}m vs {s2.medianResponseTimeMinutes}m
              </div>
              <div className="text-[9px] text-slate-500 truncate">{s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes ? p1 : p2} replies slower</div>
            </div>
          </div>

          {/* Power Balance Meter */}
          <div className="p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-800/80 space-y-1.5">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="text-slate-400">Leverage:</span>
              <span className="text-amber-400 font-semibold">{report.powerDynamic.dominantParticipant}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-obsidian-950 border border-obsidian-800 overflow-hidden flex">
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${s1.initiationPercentage}%` }}
              />
              <div
                className="bg-slate-700 h-full transition-all"
                style={{ width: `${100 - s1.initiationPercentage}%` }}
              />
            </div>
          </div>

          {/* Bottom Line Quote */}
          <div className="text-center px-2 py-1">
            <p className="text-[10px] text-slate-300 italic leading-relaxed">
              "{report.actionableAdvice.theBottomLine}"
            </p>
          </div>

          {/* Watermark Footer */}
          <div className="text-center pt-2 border-t border-obsidian-800/50 text-[9px] font-mono text-slate-400">
            Analyzed 100% privately via Chat Forensics
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full mt-4 flex items-center justify-between gap-3">
          <button
            onClick={handleCopySummary}
            className="flex-1 py-2 px-3 rounded-xl border border-obsidian-700 bg-obsidian-850 hover:bg-obsidian-800 text-xs font-medium text-slate-200 transition flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold text-xs font-mono transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
