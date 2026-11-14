import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Ingesting chat timestamps and participant signatures...',
  'Scrubbing phone numbers, emails, and entity data...',
  'Calculating conversation initiation rates (>4h pauses)...',
  'Measuring median response latencies and pacing buffers...',
  'Mapping double-text frequencies and word volume ratios...',
  'Detecting conversational velocity drops and inflection points...',
  'Evaluating psychological leverage and unstated power dynamics...',
  'Compiling final diagnostic case dossier...',
];

export const AnalyzingState: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4 animate-fadeIn">
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-450 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Diagnostic Engine Processing
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            {Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Terminal Logs */}
        <div className="bg-obsidian-950 rounded-xl p-4 border border-obsidian-800/80 font-mono text-xs space-y-2 min-h-[160px]">
          <div className="text-slate-500 flex items-center gap-1.5 pb-1 border-b border-obsidian-800/50 text-[11px]">
            <Terminal className="w-3 h-3 text-amber-400" />
            forensic_stream.log
          </div>
          {ANALYSIS_STEPS.slice(0, currentStepIndex + 1).map((step, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                idx === currentStepIndex ? 'text-amber-300 font-medium' : 'text-slate-400'
              }`}
            >
              <span className="text-slate-600 select-none">&gt;</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 text-center font-mono">
          Evaluating communication patterns against relational behavioral models...
        </p>
      </div>
    </div>
  );
};
