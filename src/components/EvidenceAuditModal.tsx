import React, { useState } from 'react';
import {
  X,
  Search,
  Scale,
  ShieldAlert,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { DiagnosticReport, ChatMetrics, ChatMessage } from '../types';
import { buildEvidenceAudit, EvidenceAuditItem } from '../utils/evidenceAudit';

interface EvidenceAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
  report: DiagnosticReport;
  metrics: ChatMetrics;
  messages: ChatMessage[];
  onOpenTranscript?: () => void;
}

export const EvidenceAuditModal: React.FC<EvidenceAuditModalProps> = ({
  isOpen,
  onClose,
  initialDomain = 'verdict',
  report,
  metrics,
  messages,
  onOpenTranscript,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);

  if (!isOpen) return null;

  const auditMap = buildEvidenceAudit(report, metrics, messages);
  const activeItem: EvidenceAuditItem = auditMap[selectedDomain] || auditMap.verdict;

  const DOMAIN_TABS = [
    { id: 'verdict', label: 'Executive Verdict', icon: Sparkles },
    { id: 'power', label: 'Power & Leverage', icon: Scale },
    { id: 'attachment', label: 'Attachment Styles', icon: ShieldAlert },
    { id: 'gottman', label: 'Gottman Friction', icon: HelpCircle },
    { id: 'scorecard', label: '5-Pillar Scorecard', icon: BookOpen },
    { id: 'inflection', label: 'Timeline Inflection', icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-obsidian-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-obsidian-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-amber-500/10 dark:border-amber-500/30 flex items-center justify-center text-indigo-600 dark:text-amber-450 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
                  Forensic Evidence & Source Audit
                </h3>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-amber-500/15 text-indigo-700 dark:text-amber-400 font-bold border border-indigo-200 dark:border-amber-500/30">
                  Explainable AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed rationale, statistical grounding, and cited transcript timestamps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-2.5 border-b border-slate-200 dark:border-obsidian-800 overflow-x-auto shrink-0 bg-slate-100/60 dark:bg-obsidian-950/80">
          {DOMAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDomain(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white dark:bg-amber-500 dark:text-obsidian-950 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-obsidian-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Section 1: The Claim */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-amber-400 font-bold">
                {activeItem.category}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-amber-500/10 text-indigo-800 dark:text-amber-300 border border-indigo-200 dark:border-amber-500/20 font-bold">
                {activeItem.badge}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white leading-snug">
              {activeItem.claimHeadline}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeItem.claimDetail}
            </p>
          </div>

          {/* Section 2: Why Is The Report Saying This? (Statistical Proof) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-amber-450" />
              <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900 dark:text-slate-100">
                1. Empirical Metrics & Formula Grounding (The Math)
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeItem.statisticalProof.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-1 shadow-sm"
                >
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block truncate">
                    {stat.label}
                  </span>
                  <div className="text-sm font-mono font-bold text-indigo-700 dark:text-amber-400">
                    {stat.value}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {stat.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: What Is The Source In Detail? (Cited Chat Log Excerpts) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900 dark:text-slate-100">
                  2. Cited Source Excerpts from Transcript (Primary Evidence)
                </h5>
              </div>
              {onOpenTranscript && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTranscript();
                  }}
                  className="text-[11px] font-mono text-indigo-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Full Transcript</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {activeItem.citedExcerpts.length > 0 ? (
              <div className="space-y-2.5">
                {activeItem.citedExcerpts.map((excerpt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-amber-400" />
                        {excerpt.sender}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{excerpt.timestamp}</span>
                    </div>
                    <blockquote className="text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-100 bg-white dark:bg-obsidian-900 p-2.5 rounded-lg border border-slate-200 dark:border-obsidian-800/80 italic">
                      "{excerpt.text}"
                    </blockquote>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      <strong className="text-slate-700 dark:text-slate-300">Forensic Relevance:</strong>{' '}
                      {excerpt.relevance}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-500 italic">
                Derived from aggregate cross-session time distributions across {metrics.totalMessages} messages.
              </div>
            )}
          </div>

          {/* Section 4: Clinical Psychological Framework */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-obsidian-950 border border-indigo-200/80 dark:border-obsidian-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-900 dark:text-amber-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Psychological Framework: {activeItem.clinicalRationale.framework}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeItem.clinicalRationale.explanation}
            </p>
          </div>

          {/* Section 5: Clinical Action Recommendation */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Corrective Actionable Guidance</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeItem.recommendation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-obsidian-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-obsidian-950">
          <div className="text-[11px] font-mono text-slate-500">
            Case {report.caseMetadata.caseNumber} • 100% Deterministic Evidence
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-obsidian-950 font-mono text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
