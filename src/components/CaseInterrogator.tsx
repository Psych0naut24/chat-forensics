import React, { useState } from 'react';
import { Send, MessageSquare, Bot, User, CornerDownRight, Loader2 } from 'lucide-react';
import { ChatMessage, ChatMetrics, DiagnosticReport, AiModelChoice, QnAPair } from '../types';
import { interrogateCase } from '../services/gemini';

interface CaseInterrogatorProps {
  messages: ChatMessage[];
  metrics: ChatMetrics;
  report: DiagnosticReport;
  apiKey?: string;
  model: AiModelChoice;
}

const SUGGESTED_QUESTIONS = [
  'What is the exact source and evidence for these findings?',
  'Were they genuinely busy or emotionally pulling away?',
  'Who apologized more after tense moments?',
  'What specific topics triggered the longest response delays?',
  'Did they ever demonstrate authentic vulnerability?',
];

export const CaseInterrogator: React.FC<CaseInterrogatorProps> = ({
  messages,
  metrics,
  report,
  apiKey,
  model,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<QnAPair[]>([]);

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return;

    const currentQ = questionText.trim();
    setQuery('');
    setIsLoading(true);

    const answer = await interrogateCase(messages, metrics, report, currentQ, apiKey, model);

    const newPair: QnAPair = {
      id: `qna-${Date.now()}`,
      question: currentQ,
      answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: !!apiKey && apiKey.trim().length > 0,
    };

    setHistory((prev) => [...prev, newPair]);
    setIsLoading(false);
  };

  return (
    <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450 shadow-inner">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-serif flex items-center gap-2">
              <span>Interrogate the Case File</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/30 dark:text-purple-300 font-semibold">
                Interactive Forensics
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Ask direct investigative questions about hidden subtext, avoidance triggers, or exact timestamps
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Questions Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
          Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(sq)}
              disabled={isLoading}
              className="text-xs text-slate-300 hover:text-amber-300 bg-obsidian-950 hover:bg-obsidian-850 border border-obsidian-800 hover:border-amber-500/40 rounded-xl px-3 py-1.5 transition text-left flex items-center gap-1.5 disabled:opacity-50"
            >
              <CornerDownRight className="w-3 h-3 text-amber-450 shrink-0" />
              <span>{sq}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Q&A Stream */}
      {history.length > 0 && (
        <div className="space-y-4 pt-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-obsidian-950 border border-obsidian-800/80 p-4 space-y-3"
            >
              {/* Question */}
              <div className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                    <span>Investigator Query</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div>"{item.question}"</div>
                </div>
              </div>

              {/* Answer */}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 pl-6 border-t border-obsidian-850 pt-2.5">
                <Bot className="w-4 h-4 text-amber-450 mt-0.5 shrink-0" />
                <div className="flex-1 leading-relaxed">
                  <p className="whitespace-pre-line">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="flex items-center gap-2 pt-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a forensic question about this dynamic..."
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 font-sans transition disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-obsidian-800 disabled:text-slate-600 text-obsidian-950 font-bold text-xs uppercase font-mono transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
