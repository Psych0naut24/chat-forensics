import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Code,
  Copy,
  Check,
  ShieldCheck,
  Share2,
  Sparkles,
} from 'lucide-react';
import { DiagnosticReport, ChatMetrics } from '../types';
import { generateMarkdownReport, downloadFile } from '../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DiagnosticReport;
  metrics: ChatMetrics;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  report,
  metrics,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'formats' | 'card'>('formats');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];

  const handlePrintPDF = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(report, metrics);
    const filename = `chat-forensics-${p1}-vs-${p2}.md`.replace(/\s+/g, '-').toLowerCase();
    downloadFile(md, filename, 'text/markdown;charset=utf-8;');
    setDownloadedFormat('md');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  const handleDownloadJSON = () => {
    const payload = JSON.stringify({ report, metrics }, null, 2);
    const filename = `chat-forensics-data-${p1}-vs-${p2}.json`.replace(/\s+/g, '-').toLowerCase();
    downloadFile(payload, filename, 'application/json;charset=utf-8;');
    setDownloadedFormat('json');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  const handleCopySummary = () => {
    const text =
      `🔍 CHAT FORENSICS REPORT: ${p1} & ${p2}\n\n` +
      `Verdict: "${report.overallVerdict.headline}"\n` +
      `Archetype: ${report.overallVerdict.archetypeTitle}\n` +
      `Brutality Score: ${report.overallVerdict.brutalityScore}/100\n` +
      `Dominant Party: ${report.powerDynamic.dominantParticipant} (${report.powerDynamic.leveragePercentage}% leverage)\n` +
      `Initiation Ratio: ${p1} (${s1.initiationPercentage}%) vs ${p2} (${s2.initiationPercentage}%)\n` +
      `Median Latency: ${p1} (${s1.medianResponseTimeMinutes}m) vs ${p2} (${s2.medianResponseTimeMinutes}m)\n\n` +
      `Bottom Line: "${report.actionableAdvice.theBottomLine}"\n\n` +
      `Analyzed 100% client-side with Chat Forensics.`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-amber-500/10 dark:border-amber-500/30 flex items-center justify-center text-indigo-600 dark:text-amber-500">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                Export & Share Case Dossier
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {p1} vs {p2} • Case {report.caseMetadata.caseNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pb-3 border-b border-slate-200 dark:border-obsidian-800">
          <button
            onClick={() => setActiveTab('formats')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'formats'
                ? 'bg-indigo-600 text-white dark:bg-amber-500 dark:text-obsidian-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-850'
            }`}
          >
            Document & Data Formats
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'card'
                ? 'bg-indigo-600 text-white dark:bg-amber-500 dark:text-obsidian-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-850'
            }`}
          >
            Social Story Card
          </button>
        </div>

        {activeTab === 'formats' ? (
          /* Formats Grid */
          <div className="space-y-3.5 mt-4">
            {/* 1. PDF / Print Dossier */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-obsidian-800 bg-slate-50/70 dark:bg-obsidian-950/70 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-obsidian-700 transition">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0 mt-0.5">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Clinical Case Dossier (PDF / Print)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Formatted multi-page report with scorecards, Gottman metrics, and relationship epochs.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePrintPDF}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-obsidian-950 font-mono text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
              >
                Print / PDF
              </button>
            </div>

            {/* 2. Markdown Export */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-obsidian-800 bg-slate-50/70 dark:bg-obsidian-950/70 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-obsidian-700 transition">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Structured Markdown Report (.md)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Full formatted document with headers and tables. Ideal for Notion, Obsidian, or local docs.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadMarkdown}
                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                {downloadedFormat === 'md' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Download .md</span>
                )}
              </button>
            </div>

            {/* 3. Raw Forensic JSON */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-obsidian-800 bg-slate-50/70 dark:bg-obsidian-950/70 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-obsidian-700 transition">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-700 dark:text-purple-400 shrink-0 mt-0.5">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Raw Forensic Data (.json)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Complete statistical payload: hourly activity bins, weekly velocity, and scorecards.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadJSON}
                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                {downloadedFormat === 'json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Download .json</span>
                )}
              </button>
            </div>

            {/* 4. Copy Summary */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-obsidian-800 bg-slate-50/70 dark:bg-obsidian-950/70 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-obsidian-700 transition">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Copy Executive Summary
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Quick formatted brief for pasting into messages, notes, or messages.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopySummary}
                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <span>Copy Text</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Social Story Card Preview */
          <div className="mt-4 flex flex-col items-center space-y-4">
            <div
              ref={cardRef}
              className="w-full max-w-xs rounded-2xl p-5 shadow-2xl space-y-4 border-2 select-none"
              style={{
                background: 'linear-gradient(180deg, #0F172A 0%, #030712 100%)',
                borderColor: 'rgba(245, 158, 11, 0.45)',
                color: '#FFFFFF',
              }}
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between pb-3"
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#FBBF24',
                    }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className="font-serif font-bold text-xs uppercase tracking-wider"
                    style={{ color: '#F1F5F9' }}
                  >
                    Chat Forensics
                  </span>
                </div>
                <span
                  className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#FBBF24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {report.caseMetadata.caseNumber}
                </span>
              </div>

              {/* Subjects */}
              <div className="text-center space-y-0.5">
                <div
                  className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: '#94A3B8' }}
                >
                  Diagnostic Dossier
                </div>
                <div
                  className="text-lg font-serif font-bold"
                  style={{ color: '#FFFFFF' }}
                >
                  {p1}{' '}
                  <span style={{ color: '#FBBF24', fontFamily: 'sans-serif', fontWeight: 300 }}>
                    &
                  </span>{' '}
                  {p2}
                </div>
                <div className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
                  {metrics.totalMessages} Messages • {metrics.dateRange.totalDays} Days
                </div>
              </div>

              {/* Verdict */}
              <div
                className="p-3.5 rounded-xl text-center space-y-1 shadow-inner"
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                }}
              >
                <div
                  className="text-[9px] font-mono uppercase tracking-wider font-bold"
                  style={{ color: '#FBBF24' }}
                >
                  Executive Verdict
                </div>
                <div
                  className="text-sm font-serif font-bold leading-snug"
                  style={{ color: '#FFFFFF' }}
                >
                  "{report.overallVerdict.headline}"
                </div>
                <div className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
                  {report.overallVerdict.archetypeTitle}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid #1F2937',
                  }}
                >
                  <div
                    className="text-[9px] font-mono uppercase"
                    style={{ color: '#94A3B8' }}
                  >
                    Initiation Gap
                  </div>
                  <div
                    className="text-xs font-mono font-bold mt-0.5"
                    style={{ color: '#FCD34D' }}
                  >
                    {s1.initiationPercentage}% vs {s2.initiationPercentage}%
                  </div>
                  <div
                    className="text-[9px] truncate"
                    style={{ color: '#64748B' }}
                  >
                    {s1.initiationPercentage > 50 ? p1 : p2} texts first
                  </div>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid #1F2937',
                  }}
                >
                  <div
                    className="text-[9px] font-mono uppercase"
                    style={{ color: '#94A3B8' }}
                  >
                    Median Latency
                  </div>
                  <div
                    className="text-xs font-mono font-bold mt-0.5"
                    style={{ color: '#FCD34D' }}
                  >
                    {s1.medianResponseTimeMinutes}m vs {s2.medianResponseTimeMinutes}m
                  </div>
                  <div
                    className="text-[9px] truncate"
                    style={{ color: '#64748B' }}
                  >
                    {s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes ? p1 : p2} replies slower
                  </div>
                </div>
              </div>

              {/* Bottom Line */}
              <div className="text-center px-1">
                <p
                  className="text-[10px] italic leading-relaxed"
                  style={{ color: '#E2E8F0' }}
                >
                  "{report.actionableAdvice.theBottomLine}"
                </p>
              </div>

              <div
                className="text-center pt-2 text-[9px] font-mono"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#64748B',
                }}
              >
                100% Client-Side Privacy • Chat Forensics
              </div>
            </div>

            <button
              onClick={handleCopySummary}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-obsidian-950 font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-md"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied Card Summary' : 'Copy Summary Text'}</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-obsidian-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Zero Server Uploads • 100% Private
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-850 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
