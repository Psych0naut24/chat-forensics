import React from 'react';
import { ShieldCheck, Settings, RotateCcw } from 'lucide-react';
import { AppTheme } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  hasReport: boolean;
  onReset: () => void;
  onOpenSettings: () => void;
  apiKeyConfigured: boolean;
  currentTheme: AppTheme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasReport,
  onReset,
  onOpenSettings,
  apiKeyConfigured,
  currentTheme,
  onToggleTheme,
}) => {
  return (
    <header className="border-b border-obsidian-800 bg-obsidian-950/85 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/5">
            <ShieldCheck className="w-5 h-5 text-amber-450" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-slate-100 uppercase text-base font-serif">
                Chat Forensics
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold tracking-wide">
                Diagnostics
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Conversational forensics, power dynamics & behavioral diagnostics
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

          {hasReport && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 transition"
              title="Analyze another conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              apiKeyConfigured
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-450 hover:bg-amber-500/20'
                : 'bg-obsidian-850 border-obsidian-700 text-slate-300 hover:bg-obsidian-800'
            }`}
            title="Configure AI API Key & Diagnostic Tone"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {apiKeyConfigured ? 'Gemini AI Active' : 'API Settings'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
