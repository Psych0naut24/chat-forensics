import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SAMPLE_CHATS, SampleChatOption } from '../data/sampleChats';

interface ChatInputProps {
  onAnalyze: (rawText: string, scrubPII: boolean) => void;
  isLoading: boolean;
  apiKeyConfigured?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onAnalyze,
  isLoading,
  apiKeyConfigured = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [scrubPII, setScrubPII] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt chat export file (e.g. WhatsApp export).');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleChatOption) => {
    setPastedText(sample.content);
    setActiveTab('paste');
    onAnalyze(sample.content, scrubPII);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textToAnalyze = activeTab === 'upload' ? fileContent : pastedText;
    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      alert('Please provide a chat export or paste messages first.');
      return;
    }
    onAnalyze(textToAnalyze, scrubPII);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Intro */}
      <div className="text-center space-y-3 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Conversational Forensics & Diagnostic Intelligence
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100 font-serif max-w-2xl mx-auto leading-tight">
          What your chat history actually reveals about your dynamic.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Upload or paste any messaging log (WhatsApp, Telegram, iMessage) to analyze conversational leverage, response latency, double-text ratios, and turning points.
        </p>

        {/* API Guidance Callout */}
        <div className="max-w-xl mx-auto p-3 rounded-xl bg-obsidian-900/80 border border-obsidian-800 text-xs text-slate-300 flex items-center justify-between gap-3 text-left">
          {apiKeyConfigured ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-300 font-mono">
                <strong>Gemini AI Active:</strong> Deep clinical relational analysis & interactive Q&A enabled.
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-450 animate-pulse" />
                <span className="text-[11px] text-slate-300">
                  <strong>Deep AI Mode:</strong> Add your free Gemini API key in <em>API Settings</em> (top right) to unlock full relational psychological synthesis and interactive Q&A.
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 font-semibold"
              >
                Get Free Key &rarr;
              </a>
            </>
          )}
        </div>
      </div>

      {/* Preset Demo Case Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
            Try a Pre-Packaged Case File (Instant 1-Click)
          </span>
          <span className="text-[11px] text-amber-400/80 font-mono">Zero setup required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {SAMPLE_CHATS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleSelect(sample)}
              disabled={isLoading}
              className="group p-4 rounded-xl bg-obsidian-900/90 border border-obsidian-800 hover:border-amber-500/40 hover:bg-obsidian-850/80 transition-all text-left flex flex-col justify-between shadow-lg shadow-black/40 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {sample.tag}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {sample.participants.join(' & ')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-amber-300 transition">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {sample.subtitle}
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-obsidian-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400 group-hover:translate-x-0.5 transition-transform">
                <span>Run Diagnostic</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Input Container */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-obsidian-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeTab === 'upload'
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/50'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Upload Chat (.txt)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeTab === 'paste'
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Raw Messages
            </button>
          </div>

          {/* PII Scrub Toggle */}
          <label className="hidden sm:flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={scrubPII}
              onChange={(e) => setScrubPII(e.target.checked)}
              className="rounded bg-obsidian-950 border-obsidian-700 text-amber-500 focus:ring-amber-500/40"
            />
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Scrub Phone Numbers & PII
            </span>
          </label>
        </div>

        {/* Tab 1: Upload */}
        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-obsidian-700 bg-obsidian-950/60 hover:border-obsidian-600 hover:bg-obsidian-950'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3.5 text-amber-450 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            {fileName ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-semibold text-sm font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {fileName}
                </div>
                <p className="text-xs text-slate-400">File loaded successfully. Click to replace.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-200">
                  Drop your WhatsApp export here, or <span className="text-amber-400 underline underline-offset-4">browse files</span>
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Export chat without media from WhatsApp on iOS or Android (produces a .txt file).
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Paste */
          <div className="space-y-2">
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste chat lines here... Example:&#10;Alex: Are we still meeting for lunch?&#10;Jordan: Yeah definitely, 1pm works!&#10;Alex: Perfect, see you there"
              className="w-full p-4 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 font-mono focus:outline-none focus:border-amber-500/80 transition"
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-obsidian-800">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Client-side parsing active • 100% private
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || (activeTab === 'upload' && !fileContent) || (activeTab === 'paste' && !pastedText.trim())}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 shadow-xl ${
              isLoading || (activeTab === 'upload' && !fileContent) || (activeTab === 'paste' && !pastedText.trim())
                ? 'bg-obsidian-800 text-slate-500 cursor-not-allowed border border-obsidian-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-obsidian-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <span>Analyzing Forensics...</span>
            ) : (
              <>
                <span>Run Diagnostic Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
