import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Share2,
  Moon,
  HelpCircle,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  GitBranch,
  HeartHandshake,
  Milestone,
} from 'lucide-react';
import {
  DiagnosticReport,
  ChatMetrics,
  ChatMessage,
  AiModelChoice,
} from '../types';
import { ShareableCardModal } from './ShareableCardModal';
import { CaseInterrogator } from './CaseInterrogator';
import { RadarScorecard } from './RadarScorecard';
import { ActivityCharts } from './ActivityCharts';
import { ChatTranscriptDrawer } from './ChatTranscriptDrawer';

interface ReportViewProps {
  report: DiagnosticReport;
  metrics: ChatMetrics;
  messages: ChatMessage[];
  apiKey?: string;
  model: AiModelChoice;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  metrics,
  messages,
  apiKey,
  model,
  onReset,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTranscriptDrawer, setShowTranscriptDrawer] = useState(false);
  const [expandedPattern, setExpandedPattern] = useState<number | null>(0);

  const [p1, p2] = metrics.participants;
  const s1 = metrics.stats[p1];
  const s2 = metrics.stats[p2];

  const totalWords = (s1.wordCount || 0) + (s2.wordCount || 0);
  const p1WordPct = totalWords > 0 ? Math.round((s1.wordCount / totalWords) * 100) : 50;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 animate-fadeIn">
      {/* 1. Case Dossier Header Bar */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              Case Closed • Forensic Diagnosis
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {report.caseMetadata.caseNumber}
            </span>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">
              {report.caseMetadata.depthLevel}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <span>{p1}</span>
            <span className="text-amber-450 font-sans font-light">vs</span>
            <span>{p2}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400 font-mono">
            <span>{metrics.totalMessages} Messages Processed</span>
            <span>•</span>
            <span>{report.caseMetadata.dateRange}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowTranscriptDrawer(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-white font-mono text-xs font-medium transition"
            title="Inspect raw chat messages and search keywords"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Transcript</span>
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-white font-mono text-xs font-medium transition"
          >
            <span>New Case</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-mono text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Verdict (Hero Card) */}
      <div className="bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-obsidian-950 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-obsidian-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-450 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Diagnostic Verdict
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-100 leading-snug">
              "{report.overallVerdict.headline}"
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-obsidian-950 border border-obsidian-800 shrink-0">
            <span className="text-xs font-mono text-slate-400">Brutality Score:</span>
            <span className="text-sm font-mono font-bold text-amber-400">
              {report.overallVerdict.brutalityScore}/100
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {report.overallVerdict.summary}
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-xs font-mono text-slate-400">
          <span className="text-amber-450 font-semibold">Core Dynamic:</span>
          <span>{report.overallVerdict.coreDynamic}</span>
        </div>
      </div>

      {/* 2.5 Relational Health Scorecard (5 Pillars) */}
      <RadarScorecard scorecard={metrics.scorecard} participants={metrics.participants} />

      {/* 3. Deep Relational Chapters: Relationship Epochs */}
      {report.relationshipEpochs && report.relationshipEpochs.length > 0 && (
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450">
                <Milestone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-serif">Relationship Arc & Chronological Epochs</h3>
                <p className="text-xs text-slate-400">How the communication temperature and velocity evolved across time</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {report.relationshipEpochs.map((epoch) => (
              <div
                key={epoch.chapterNumber}
                className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      Chapter {epoch.chapterNumber}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      Vibe: {epoch.vibeScore}/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 font-serif pt-1">{epoch.title}</h4>
                  <div className="text-[11px] font-mono text-slate-400">{epoch.timeframe}</div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">{epoch.summary}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-800/80 text-[11px] font-mono text-amber-400/90 italic">
                  "{epoch.keyMomentQuote}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Clinical Attachment Theory Breakdown */}
      {report.attachmentDynamics && (
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-serif">Attachment Theory Diagnostics</h3>
                <p className="text-xs text-slate-400">Classifying subconscious relational drivers and reactive triggers</p>
              </div>
            </div>
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
              {report.attachmentDynamics.dynamicType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Person A Profile */}
            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">{p1}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-700 text-slate-200">
                  {report.attachmentDynamics.personA.style}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.attachmentDynamics.personA.summary}
              </p>
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Observable Triggers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.attachmentDynamics.personA.observableTriggers.map((trig, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-obsidian-900 text-slate-300 border border-obsidian-800">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Person B Profile */}
            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">{p2}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-700 text-slate-200">
                  {report.attachmentDynamics.personB.style}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.attachmentDynamics.personB.summary}
              </p>
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Observable Triggers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.attachmentDynamics.personB.observableTriggers.map((trig, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-obsidian-900 text-slate-300 border border-obsidian-800">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Systemic Loop */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed font-mono">
            <strong className="text-purple-300 uppercase block mb-0.5 text-[10px]">The Systemic Feedback Loop:</strong>
            {report.attachmentDynamics.systemicLoop}
          </div>
        </div>
      )}

      {/* 5. Gottman Relational Diagnostics: Bids & Friction Markers */}
      {report.gottmanAnalysis && (
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-serif">Gottman Clinical Relational Health</h3>
              <p className="text-xs text-slate-400">Bids for emotional connection and presence of the Four Friction Markers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                "Turn Towards" Receptivity Rate
              </div>
              <div className="text-base font-mono font-bold text-slate-200">
                {p1}: <span className="text-emerald-400">{report.gottmanAnalysis.turnTowardsRateA}%</span> • {p2}: <span className="text-emerald-400">{report.gottmanAnalysis.turnTowardsRateB}%</span>
              </div>
              <p className="text-xs text-slate-400">{report.gottmanAnalysis.bidSummary}</p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                Friction Markers Detected ({report.gottmanAnalysis.frictionMarkers.length})
              </div>
              <div className="space-y-1.5">
                {report.gottmanAnalysis.frictionMarkers.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono">No severe Gottman markers detected.</p>
                ) : (
                  report.gottmanAnalysis.frictionMarkers.map((marker, idx) => (
                    <div key={idx} className="text-xs text-slate-300">
                      <strong className="text-amber-400 font-mono">[{marker.type}]</strong> by {marker.instigator}: {marker.analysis}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Power Dynamic & Conversational Leverage */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-serif">Power Balance & Leverage</h3>
              <p className="text-xs text-slate-400">Measured through initiation pacing, response latency, and word volume disparity</p>
            </div>
          </div>
          <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
            {report.powerDynamic.dominantParticipant === 'Equal Balance'
              ? 'Balanced Dynamic'
              : `${report.powerDynamic.dominantParticipant} Holds Leverage`}
          </span>
        </div>

        {/* Visual Balance Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>{p1} ({s1.initiationPercentage}% Initiation)</span>
            <span className="text-slate-500 font-sans">Center Balance</span>
            <span>{p2} ({s2.initiationPercentage}% Initiation)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-obsidian-950 border border-obsidian-800 overflow-hidden relative flex">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10 -translate-x-1/2" />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${s1.initiationPercentage}%` }}
            />
            <div
              className="bg-slate-700 h-full transition-all duration-500"
              style={{ width: `${100 - s1.initiationPercentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {report.powerDynamic.explanation}
        </p>

        {/* Observed Tactics */}
        <div className="pt-2 border-t border-obsidian-800/80">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
            Identified Conversational Tactics:
          </span>
          <div className="flex flex-wrap gap-2">
            {report.powerDynamic.tacticsObserved.map((tactic, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-obsidian-950 border border-obsidian-800 text-slate-300"
              >
                {tactic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Inflection Point (When Things Shifted) */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-serif">
              The Inflection Point ({report.inflectionPoint.period})
            </h3>
            <p className="text-xs text-slate-400">
              Pinpointing where the conversational energy and responsiveness altered
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800/80 space-y-2">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {report.inflectionPoint.description}
          </p>
          <div className="text-[11px] font-mono text-amber-400/90 pt-1 flex items-center gap-1.5">
            <span className="text-slate-500">Trigger Indicator:</span>
            <span>"{report.inflectionPoint.quoteOrTrigger}"</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-emerald-500/20 space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
              Before the Shift
            </div>
            <div className="text-xs text-slate-300">{report.inflectionPoint.beforeVibe}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-amber-500/20 space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
              After the Shift
            </div>
            <div className="text-xs text-slate-300">{report.inflectionPoint.afterVibe}</div>
          </div>
        </div>
      </div>

      {/* 8. Hard Quantitative Forensics Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold px-1">
          Quantitative Forensics Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Initiation Ratio (&gt;4h gap)
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {s1.initiationPercentage}% <span className="text-slate-500 text-sm">vs</span> {s2.initiationPercentage}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-obsidian-950 flex overflow-hidden">
              <div className="bg-amber-500" style={{ width: `${s1.initiationPercentage}%` }} />
              <div className="bg-slate-600" style={{ width: `${s2.initiationPercentage}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>{p1}: {s1.conversationsInitiated} starts</span>
              <span>{p2}: {s2.conversationsInitiated} starts</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Median Response Time
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {s1.medianResponseTimeMinutes}m <span className="text-slate-500 text-sm">vs</span> {s2.medianResponseTimeMinutes}m
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed font-mono">
              {s1.medianResponseTimeMinutes > s2.medianResponseTimeMinutes
                ? `${p1} takes ${(s1.medianResponseTimeMinutes / (s2.medianResponseTimeMinutes || 1)).toFixed(1)}x longer to reply`
                : `${p2} takes ${(s2.medianResponseTimeMinutes / (s1.medianResponseTimeMinutes || 1)).toFixed(1)}x longer to reply`}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Word Volume Share
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {p1WordPct}% <span className="text-slate-500 text-sm">vs</span> {100 - p1WordPct}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-obsidian-950 flex overflow-hidden">
              <div className="bg-amber-500" style={{ width: `${p1WordPct}%` }} />
              <div className="bg-slate-600" style={{ width: `${100 - p1WordPct}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>{p1}: {s1.wordCount} words</span>
              <span>{p2}: {s2.wordCount} words</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Double-Text Chases
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {s1.doubleTextCount} <span className="text-slate-500 text-sm">vs</span> {s2.doubleTextCount}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Follow-up messages sent into silence without an answer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                Night-Owl Messages (11PM-5AM)
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {s1.nightOwlMessages + s2.nightOwlMessages} Total
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {p1}: {s1.nightOwlMessages} msgs • {p2}: {s2.nightOwlMessages} msgs
            </p>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Curiosity & Questions Asked
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {s1.questionsAsked} <span className="text-slate-500 text-sm">vs</span> {s2.questionsAsked}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Measures who drives conversation through inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* 8.5 Circadian Cadence & Velocity Charts */}
      <ActivityCharts metrics={metrics} />

      {/* 9. Behavioral Diagnostic Patterns */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-serif">Observed Behavioral Patterns</h3>
            <p className="text-xs text-slate-400">Specific micro-dynamics and communicative tendencies spotted in the data</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {report.behavioralPatterns.map((pattern, idx) => {
            const isExpanded = expandedPattern === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-obsidian-950 border border-obsidian-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedPattern(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-obsidian-850/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        pattern.impactLevel === 'critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : pattern.impactLevel === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {pattern.impactLevel}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{pattern.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">Subject: {pattern.subject}</div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-obsidian-800/80 space-y-2.5 bg-obsidian-900/50 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-obsidian-950 border border-obsidian-800 font-mono text-[11px] text-amber-300/90">
                      <strong className="text-slate-400 uppercase font-sans text-[10px] block mb-0.5">Evidence:</strong>
                      "{pattern.evidence}"
                    </div>
                    <p className="leading-relaxed text-slate-300">
                      {pattern.interpretation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 10. Red & Green Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-obsidian-900 border border-red-500/20 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-serif font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Friction Points & Red Flags</span>
          </div>
          <div className="space-y-2">
            {report.flags.redFlags.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono">No severe red flags detected.</p>
            ) : (
              report.flags.redFlags.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-obsidian-950 border border-obsidian-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <div>
                    <strong className="text-red-300 font-mono text-[11px]">{item.person}: </strong>
                    <span>{item.flag}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-obsidian-900 border border-emerald-500/20 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Healthy Signals & Green Flags</span>
          </div>
          <div className="space-y-2">
            {report.flags.greenFlags.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono">No clear green flags identified.</p>
            ) : (
              report.flags.greenFlags.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-obsidian-950 border border-obsidian-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <div>
                    <strong className="text-emerald-300 font-mono text-[11px]">{item.person}: </strong>
                    <span>{item.flag}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 11. Actionable Guidance & The Bottom Line */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-base font-bold text-slate-100 font-serif">Actionable Guidance</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1.5">
            <div className="text-xs font-mono uppercase text-amber-400 font-bold">
              Direct Counsel for {p1}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {report.actionableAdvice.forPersonA}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1.5">
            <div className="text-xs font-mono uppercase text-amber-400 font-bold">
              Direct Counsel for {p2}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {report.actionableAdvice.forPersonB}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-450 border-y border-r border-obsidian-800 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
            The Bottom Line
          </span>
          <p className="text-sm sm:text-base font-serif italic text-slate-100 leading-relaxed">
            "{report.actionableAdvice.theBottomLine}"
          </p>
        </div>
      </div>

      {/* 12. Interactive "Interrogate the Case File" (Q&A Module) */}
      <CaseInterrogator
        messages={messages}
        metrics={metrics}
        report={report}
        apiKey={apiKey}
        model={model}
      />

      {/* Social Story Modal */}
      <ShareableCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        report={report}
        metrics={metrics}
      />

      {/* Transcript Inspector Drawer */}
      <ChatTranscriptDrawer
        isOpen={showTranscriptDrawer}
        onClose={() => setShowTranscriptDrawer(false)}
        messages={messages}
        participants={metrics.participants}
      />
    </div>
  );
};
