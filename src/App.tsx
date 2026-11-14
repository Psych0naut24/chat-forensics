import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { AnalyzingState } from './components/AnalyzingState';
import { ReportView } from './components/ReportView';
import { SettingsModal } from './components/SettingsModal';
import {
  ChatMessage,
  ChatMetrics,
  DiagnosticReport,
  ToneMode,
  AiModelChoice,
  AppTheme,
} from './types';
import { parseChatLog } from './utils/parser';
import { calculateMetrics } from './utils/metrics';
import { analyzeChatWithGemini } from './services/gemini';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [tone, setTone] = useState<ToneMode>('candid');
  const [model, setModel] = useState<AiModelChoice>('gemini-2.5-flash');
  const [theme, setTheme] = useState<AppTheme>('noir-amber');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [metrics, setMetrics] = useState<ChatMetrics | null>(null);
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  // Load preferences from localStorage and environment
  useEffect(() => {
    const envKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();
    const localKey = (localStorage.getItem('gemini_api_key') || '').trim();
    const activeKey = localKey || envKey;
    if (activeKey) setApiKey(activeKey);

    const savedTone = localStorage.getItem('chat_tone') as ToneMode;
    if (savedTone) setTone(savedTone);

    const savedModel = localStorage.getItem('gemini_model') as AiModelChoice;
    if (savedModel) setModel(savedModel);

    const savedTheme = localStorage.getItem('chat_theme') as AppTheme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleChangeTone = (newTone: ToneMode) => {
    setTone(newTone);
    localStorage.setItem('chat_tone', newTone);
  };

  const handleChangeModel = (newModel: AiModelChoice) => {
    setModel(newModel);
    localStorage.setItem('gemini_model', newModel);
  };

  const handleChangeTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('chat_theme', newTheme);
  };

  const handleAnalyze = async (rawText: string, scrubPII: boolean) => {
    setIsLoading(true);

    try {
      const { messages: parsedMsgs, participants } = parseChatLog(rawText, scrubPII);

      if (parsedMsgs.length < 3 || participants.length < 2) {
        alert(
          'Could not detect at least 2 distinct participants with enough messages. Please ensure format looks like "Name: Message" or a WhatsApp export.'
        );
        setIsLoading(false);
        return;
      }

      setMessages(parsedMsgs);

      const computedMetrics = calculateMetrics(parsedMsgs, [participants[0], participants[1]]);
      setMetrics(computedMetrics);

      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));
      const reportPromise = analyzeChatWithGemini(parsedMsgs, computedMetrics, apiKey, tone, model);

      const [, generatedReport] = await Promise.all([delayPromise, reportPromise]);

      setReport(generatedReport);
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('An error occurred while analyzing the chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setMetrics(null);
    setReport(null);
    setIsLoading(false);
  };

  // Synchronize data-theme on document element whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const getThemeClasses = (t: AppTheme) => {
    switch (t) {
      case 'clean-light':
        return 'bg-[#F8FAFC] text-slate-900 bg-grid-pattern selection:bg-indigo-500/20 selection:text-indigo-600';
      case 'cyber-neon':
        return 'bg-[#040714] text-slate-100 bg-grid-pattern selection:bg-cyan-500/20 selection:text-cyan-300';
      case 'linear-luxury':
        return 'bg-[#09090B] text-slate-100 bg-grid-pattern selection:bg-emerald-500/20 selection:text-emerald-300';
      case 'classified-dossier':
        return 'bg-[#0D0F14] text-slate-100 bg-grid-pattern selection:bg-red-500/20 selection:text-red-300 font-mono';
      case 'noir-amber':
      default:
        return 'bg-[#070A10] text-slate-100 bg-grid-pattern selection:bg-amber-500/20 selection:text-amber-300';
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen text-slate-100 flex flex-col transition-colors duration-300 ${getThemeClasses(
        theme
      )}`}
    >
      {/* Top Navigation */}
      <Header
        hasReport={!!report}
        onReset={handleReset}
        onOpenSettings={() => setShowSettings(true)}
        apiKeyConfigured={!!apiKey && apiKey.trim().length > 0}
        currentTheme={theme}
        onSelectTheme={handleChangeTheme}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-4 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <AnalyzingState />
        ) : report && metrics ? (
          <ReportView
            report={report}
            metrics={metrics}
            messages={messages}
            apiKey={apiKey}
            model={model}
            onReset={handleReset}
          />
        ) : (
          <ChatInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            apiKeyConfigured={!!apiKey && apiKey.trim().length > 0}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-obsidian-850 bg-obsidian-950/80 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Privacy: Chats are parsed directly in your browser.</span>
          </div>
          <div>Chat Forensics • Behavioral & Relational Intelligence</div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        tone={tone}
        onChangeTone={handleChangeTone}
        model={model}
        onChangeModel={handleChangeModel}
      />
    </div>
  );
};

export default App;
