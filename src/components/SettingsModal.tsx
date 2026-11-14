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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-obsidian-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">Intelligence & Model Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 mt-5">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Key className="w-3.5 h-3.5 text-amber-450" />
                Gemini API Key (Optional)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                Get free key &rarr;
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 font-mono transition"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enables live generative clinical diagnosis and interactive interrogation Q&A. Saved only in your browser's private local storage.
            </p>
          </div>

          {/* Model Choice: Flash vs Pro */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-450" />
              Reasoning Engine (Depth Level)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onChangeModel('gemini-2.5-flash')}
                className={`p-3 rounded-xl border text-left transition ${
                  model === 'gemini-2.5-flash'
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                    : 'bg-obsidian-950/60 border-obsidian-800 text-slate-400 hover:border-obsidian-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">2.5 Flash</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">Fast</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  High-speed synthesis and standard chat sampling.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChangeModel('gemini-2.5-pro')}
                className={`p-3 rounded-xl border text-left transition ${
                  model === 'gemini-2.5-pro'
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                    : 'bg-obsidian-950/60 border-obsidian-800 text-slate-400 hover:border-obsidian-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">2.5 Pro</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">2M Window</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Deep reasoning; digests massive multi-year chat histories.
                </div>
              </button>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-450" />
              Diagnostic Tone
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => onChangeTone('candid')}
                className={`flex items-start gap-3 p-2.5 rounded-xl border text-left transition ${
                  tone === 'candid'
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                    : 'bg-obsidian-950/60 border-obsidian-800 text-slate-400 hover:border-obsidian-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200">
                  Candid & Direct <span className="font-normal text-slate-400 text-[11px] block">Unfiltered psychological honesty, calls out subtle leverage and detachment.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChangeTone('constructive')}
                className={`flex items-start gap-3 p-2.5 rounded-xl border text-left transition ${
                  tone === 'constructive'
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                    : 'bg-obsidian-950/60 border-obsidian-800 text-slate-400 hover:border-obsidian-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200">
                  Constructive & Relational <span className="font-normal text-slate-400 text-[11px] block">Rooted in Gottman methods, attachment psychology, and relational repair.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChangeTone('analytical')}
                className={`flex items-start gap-3 p-2.5 rounded-xl border text-left transition ${
                  tone === 'analytical'
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                    : 'bg-obsidian-950/60 border-obsidian-800 text-slate-400 hover:border-obsidian-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200">
                  Clinical & Data-Driven <span className="font-normal text-slate-400 text-[11px] block">Objective forensic behavioral profiling with statistical metrics.</span>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-slate-400 text-xs">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-slate-300">Zero Server Storage:</strong> Your chat files are parsed in your browser memory and never uploaded to any backend database.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-obsidian-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-obsidian-950 hover:bg-amber-400 font-mono transition shadow-lg shadow-amber-500/20"
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
