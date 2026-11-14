import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { AppTheme } from '../types';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

interface ThemeOption {
  id: AppTheme;
  name: string;
  badge: string;
  dotColor: string;
  borderAccent: string;
  desc: string;
}

const THEMES: ThemeOption[] = [
  {
    id: 'noir-amber',
    name: 'Noir Amber',
    badge: 'Detective',
    dotColor: 'bg-amber-450',
    borderAccent: 'border-amber-500/40',
    desc: 'Deep onyx obsidian with warm incandescent gold accents',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    badge: 'Futuristic',
    dotColor: 'bg-cyan-400',
    borderAccent: 'border-cyan-500/40',
    desc: 'Midnight space navy with glowing electric cyan & violet',
  },
  {
    id: 'linear-luxury',
    name: 'Linear Luxury',
    badge: 'Minimalist',
    dotColor: 'bg-emerald-400',
    borderAccent: 'border-emerald-500/40',
    desc: 'Graphite carbon with crisp typography & emerald status signals',
  },
  {
    id: 'classified-dossier',
    name: 'Classified Dossier',
    badge: 'Agency File',
    dotColor: 'bg-red-500',
    borderAccent: 'border-red-500/40',
    desc: 'Deep archival gray with red ink stamps & monospace courier',
  },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 text-xs font-medium text-slate-300 hover:text-white transition"
        title="Switch Visual Aesthetic & Color Theme"
      >
        <div className={`w-2.5 h-2.5 rounded-full ${active.dotColor} shrink-0`} />
        <span className="hidden md:inline font-mono">{active.name}</span>
        <Palette className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-obsidian-900 border border-obsidian-700/80 shadow-2xl p-2.5 z-50 space-y-1 animate-fadeIn backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-obsidian-800 flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Theme Aesthetic
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start justify-between transition ${
                    isSelected
                      ? 'bg-obsidian-950 border border-obsidian-750 text-white'
                      : 'hover:bg-obsidian-850/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${theme.dotColor} mt-0.5 shrink-0`} />
                    <div>
                      <div className="text-xs font-bold font-serif flex items-center gap-1.5">
                        <span className={isSelected ? 'text-white' : 'text-slate-300'}>
                          {theme.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-obsidian-800 text-slate-400">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {theme.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
