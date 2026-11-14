import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AppTheme } from '../types';

interface ThemeToggleProps {
  currentTheme: AppTheme;
  onToggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggleTheme }) => {
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={onToggleTheme}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-800 text-xs font-medium text-slate-300 hover:text-white transition shadow-sm"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-450 animate-fadeIn" />
          <span className="font-mono text-xs hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-500 animate-fadeIn" />
          <span className="font-mono text-xs hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};
