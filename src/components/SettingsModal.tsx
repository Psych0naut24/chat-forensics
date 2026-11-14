import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Sparkles, Sliders, Check, Cpu } from 'lucide-react';
import { ToneMode, AiModelChoice } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  tone: ToneMode;
  onChangeTone: (tone: ToneMode) => void;
  model: AiModelChoice;
  onChangeModel: (model: AiModelChoice) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  tone,
  onChangeTone,
  model,
  onChangeModel,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const hasEnvKey = Boolean(
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_API_KEY
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-obsidian-800 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Sliders className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">
                Intelligence & Diagnostic Settings
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure reasoning models, diagnostic tone & API access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-obsidian-800 transition"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 mt-5">
          {/* Section 1: Gemini API Key */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                Gemini API Key (Optional)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-500 hover:underline flex items-center gap-1 font-semibold font-mono"
              >
                Get free key &rarr;
              </a>
            </div>

            {hasEnvKey && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Netlify Environment Key Active
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Connected
                </span>
              </div>
            )}

            <input
              type="password"
              placeholder={hasEnvKey ? '•••••••••••••••• (Using Netlify Key)' : 'AIzaSy... (Paste custom key)'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono transition"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enables live generative clinical diagnosis and interactive interrogation Q&A. Stored strictly in your browser's private local storage.
            </p>
          </div>

          {/* Section 2: Model Choice (2.5 Flash vs 2.5 Pro) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-500" />
                Reasoning Engine (Depth Level)
              </label>
              <span className="text-[10px] font-mono text-slate-400">Click to select</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Gemini 2.5 Flash */}
              <button
                type="button"
                onClick={() => onChangeModel('gemini-2.5-flash')}
                className={`p-3.5 rounded-xl text-left transition flex items-start justify-between cursor-pointer ${
                  model === 'gemini-2.5-flash'
                    ? 'border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 ring-2 ring-amber-500/25 shadow-sm'
                    : 'border border-slate-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-950 hover:border-slate-300 dark:hover:border-obsidian-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold font-mono ${
                        model === 'gemini-2.5-flash'
                          ? 'text-amber-950 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      2.5 Flash
                    </span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono ${
                        model === 'gemini-2.5-flash'
                          ? 'bg-amber-500 text-white dark:bg-amber-500/25 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-obsidian-850 dark:text-slate-400'
                      }`}
                    >
                      Fast
                    </span>
                  </div>
                  <div
                    className={`text-[11px] mt-1.5 leading-snug ${
                      model === 'gemini-2.5-flash'
                        ? 'text-amber-900/90 dark:text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    High-speed synthesis & standard sampling.
                  </div>
                  {model === 'gemini-2.5-flash' && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Active Selection
                    </div>
                  )}
                </div>

                {/* Selection Indicator Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-2 transition ${
                    model === 'gemini-2.5-flash'
                      ? 'bg-amber-500 text-white dark:text-obsidian-950 shadow-sm'
                      : 'border-2 border-slate-300 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-900'
                  }`}
                >
                  {model === 'gemini-2.5-flash' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Option 2: Gemini 2.5 Pro */}
              <button
                type="button"
                onClick={() => onChangeModel('gemini-2.5-pro')}
                className={`p-3.5 rounded-xl text-left transition flex items-start justify-between cursor-pointer ${
                  model === 'gemini-2.5-pro'
                    ? 'border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 ring-2 ring-amber-500/25 shadow-sm'
                    : 'border border-slate-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-950 hover:border-slate-300 dark:hover:border-obsidian-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold font-mono ${
                        model === 'gemini-2.5-pro'
                          ? 'text-amber-950 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      2.5 Pro
                    </span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono ${
                        model === 'gemini-2.5-pro'
                          ? 'bg-purple-600 text-white dark:bg-purple-500/25 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-obsidian-850 dark:text-slate-400'
                      }`}
                    >
                      Deep 2M
                    </span>
                  </div>
                  <div
                    className={`text-[11px] mt-1.5 leading-snug ${
                      model === 'gemini-2.5-pro'
                        ? 'text-amber-900/90 dark:text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    Deep clinical reasoning for multi-year logs.
                  </div>
                  {model === 'gemini-2.5-pro' && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Active Selection
                    </div>
                  )}
                </div>

                {/* Selection Indicator Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-2 transition ${
                    model === 'gemini-2.5-pro'
                      ? 'bg-amber-500 text-white dark:text-obsidian-950 shadow-sm'
                      : 'border-2 border-slate-300 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-900'
                  }`}
                >
                  {model === 'gemini-2.5-pro' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Tone Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Diagnostic Tone
              </label>
              <span className="text-[10px] font-mono text-slate-400">Active framework</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Tone 1: Candid & Direct */}
              <button
                type="button"
                onClick={() => onChangeTone('candid')}
                className={`p-3.5 rounded-xl text-left transition flex items-start justify-between cursor-pointer ${
                  tone === 'candid'
                    ? 'border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 ring-2 ring-amber-500/25 shadow-sm'
                    : 'border border-slate-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-950 hover:border-slate-300 dark:hover:border-obsidian-700'
                }`}
              >
                <div className="pr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        tone === 'candid'
                          ? 'text-amber-950 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Candid & Direct
                    </span>
                    {tone === 'candid' && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono bg-amber-500 text-white dark:bg-amber-500/25 dark:text-amber-300">
                        Selected
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] mt-1 leading-relaxed ${
                      tone === 'candid'
                        ? 'text-amber-900/90 dark:text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    Unfiltered psychological honesty; calls out subtle leverage, defensive silence, and emotional asymmetry.
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition ${
                    tone === 'candid'
                      ? 'bg-amber-500 text-white dark:text-obsidian-950 shadow-sm'
                      : 'border-2 border-slate-300 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-900'
                  }`}
                >
                  {tone === 'candid' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Tone 2: Constructive & Relational */}
              <button
                type="button"
                onClick={() => onChangeTone('constructive')}
                className={`p-3.5 rounded-xl text-left transition flex items-start justify-between cursor-pointer ${
                  tone === 'constructive'
                    ? 'border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 ring-2 ring-amber-500/25 shadow-sm'
                    : 'border border-slate-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-950 hover:border-slate-300 dark:hover:border-obsidian-700'
                }`}
              >
                <div className="pr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        tone === 'constructive'
                          ? 'text-amber-950 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Constructive & Relational
                    </span>
                    {tone === 'constructive' && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono bg-amber-500 text-white dark:bg-amber-500/25 dark:text-amber-300">
                        Selected
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] mt-1 leading-relaxed ${
                      tone === 'constructive'
                        ? 'text-amber-900/90 dark:text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    Rooted in Gottman methods, attachment psychology (anxious/avoidant), and actionable relational repair pathways.
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition ${
                    tone === 'constructive'
                      ? 'bg-amber-500 text-white dark:text-obsidian-950 shadow-sm'
                      : 'border-2 border-slate-300 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-900'
                  }`}
                >
                  {tone === 'constructive' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Tone 3: Clinical & Data-Driven */}
              <button
                type="button"
                onClick={() => onChangeTone('analytical')}
                className={`p-3.5 rounded-xl text-left transition flex items-start justify-between cursor-pointer ${
                  tone === 'analytical'
                    ? 'border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 ring-2 ring-amber-500/25 shadow-sm'
                    : 'border border-slate-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-950 hover:border-slate-300 dark:hover:border-obsidian-700'
                }`}
              >
                <div className="pr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        tone === 'analytical'
                          ? 'text-amber-950 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Clinical & Data-Driven
                    </span>
                    {tone === 'analytical' && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono bg-amber-500 text-white dark:bg-amber-500/25 dark:text-amber-300">
                        Selected
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] mt-1 leading-relaxed ${
                      tone === 'analytical'
                        ? 'text-amber-900/90 dark:text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    Forensic behavioral profiling with statistical metrics, latency velocity charts, and objective findings.
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition ${
                    tone === 'analytical'
                      ? 'bg-amber-500 text-white dark:text-obsidian-950 shadow-sm'
                      : 'border-2 border-slate-300 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-900'
                  }`}
                >
                  {tone === 'analytical' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-slate-400 text-xs">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-slate-200">Zero Server Storage:</strong> Your chat files are parsed locally in browser memory and never uploaded to any remote database.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-obsidian-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold rounded-xl bg-amber-500 text-white dark:text-obsidian-950 hover:bg-amber-600 font-mono transition shadow-lg cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Preferences Saved</span>
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
