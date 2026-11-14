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
    }, 700);
  };

  const hasEnvKey = Boolean((import.meta as any).env?.VITE_GEMINI_API_KEY);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-obsidian-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-450">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">Intelligence & Model Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-obsidian-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 mt-5">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Key className="w-3.5 h-3.5 text-amber-450" />
                Gemini API Key (Optional)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-450 hover:underline flex items-center gap-1 font-semibold font-mono"
              >
                Get free key &rarr;
              </a>
            </div>

            {hasEnvKey && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  Netlify Environment Key Active
                </span>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
            )}

            <input
              type="password"
              placeholder={hasEnvKey ? '•••••••••••••••• (Using Netlify Key)' : 'AIzaSy...'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono transition"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enables live generative clinical diagnosis and interactive interrogation Q&A. Saved only in your browser's private local storage.
            </p>
          </div>

          {/* Model Choice: Flash vs Pro */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-450" />
              Reasoning Engine (Depth Level)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Flash Option */}
              <button
                type="button"
                onClick={() => onChangeModel('gemini-2.5-flash')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start justify-between ${
                  model === 'gemini-2.5-flash'
                    ? 'bg-amber-500/15 border-amber-500 shadow-sm'
                    : 'bg-obsidian-950 border-obsidian-800 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 font-mono">2.5 Flash</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-450 font-bold font-mono">
                      Fast
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    High-speed synthesis and standard sampling.
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                    model === 'gemini-2.5-flash'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-400'
                  }`}
                >
                  {model === 'gemini-2.5-flash' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Pro Option */}
              <button
                type="button"
                onClick={() => onChangeModel('gemini-2.5-pro')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start justify-between ${
                  model === 'gemini-2.5-pro'
                    ? 'bg-amber-500/15 border-amber-500 shadow-sm'
                    : 'bg-obsidian-950 border-obsidian-800 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 font-mono">2.5 Pro</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold font-mono">
                      2M
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Deep clinical reasoning for multi-year chats.
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                    model === 'gemini-2.5-pro'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-400'
                  }`}
                >
                  {model === 'gemini-2.5-pro' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-450" />
              Diagnostic Tone
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {/* Tone 1: Candid */}
              <button
                type="button"
                onClick={() => onChangeTone('candid')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start justify-between ${
                  tone === 'candid'
                    ? 'bg-amber-500/15 border-amber-500 shadow-sm'
                    : 'bg-obsidian-950 border-obsidian-800 hover:border-slate-400'
                }`}
              >
                <div className="pr-3">
                  <div className="text-xs font-bold text-slate-100">Candid & Direct</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Unfiltered psychological honesty, calls out subtle leverage and detachment.
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    tone === 'candid'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-400'
                  }`}
                >
                  {tone === 'candid' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Tone 2: Constructive */}
              <button
                type="button"
                onClick={() => onChangeTone('constructive')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start justify-between ${
                  tone === 'constructive'
                    ? 'bg-amber-500/15 border-amber-500 shadow-sm'
                    : 'bg-obsidian-950 border-obsidian-800 hover:border-slate-400'
                }`}
              >
                <div className="pr-3">
                  <div className="text-xs font-bold text-slate-100">Constructive & Relational</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Rooted in Gottman methods, attachment psychology, and relational repair.
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    tone === 'constructive'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-400'
                  }`}
                >
                  {tone === 'constructive' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Tone 3: Analytical */}
              <button
                type="button"
                onClick={() => onChangeTone('analytical')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start justify-between ${
                  tone === 'analytical'
                    ? 'bg-amber-500/15 border-amber-500 shadow-sm'
                    : 'bg-obsidian-950 border-obsidian-800 hover:border-slate-400'
                }`}
              >
                <div className="pr-3">
                  <div className="text-xs font-bold text-slate-100">Clinical & Data-Driven</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Objective forensic behavioral profiling with statistical metrics.
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    tone === 'analytical'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-400'
                  }`}
                >
                  {tone === 'analytical' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-slate-400 text-xs">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-slate-200">Zero Server Storage:</strong> Your chat files are parsed in your browser memory and never uploaded to any backend database.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-obsidian-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-mono transition shadow-md cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved
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
