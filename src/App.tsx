import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { AnalyzingState } from './components/AnalyzingState';
import { ReportView } from './components/ReportView';
import { SettingsModal } from './components/SettingsModal';
import { ChatMessage, ChatMetrics, DiagnosticReport, ToneMode, AiModelChoice } from './types';
import { parseChatLog } from './utils/parser';
import { calculateMetrics } from './utils/metrics';
import { analyzeChatWithGemini } from './services/gemini';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [tone, setTone] = useState<ToneMode>('candid');
  const [model, setModel] = useState<AiModelChoice>('gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [metrics, setMetrics] = useState<ChatMetrics | null>(null);
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedTone = localStorage.getItem('chat_tone') as ToneMode;
    if (savedTone) setTone(savedTone);

    const savedModel = localStorage.getItem('gemini_model') as AiModelChoice;
    if (savedModel) setModel(savedModel);
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

  const handleAnalyze = async (rawText: string, scrubPII: boolean) => {
    setIsLoading(true);

    try {
      // 1. Client-side parse
      const { messages: parsedMsgs, participants } = parseChatLog(rawText, scrubPII);

      if (parsedMsgs.length < 3 || participants.length < 2) {
        alert(
          'Could not detect at least 2 distinct participants with enough messages. Please ensure format looks like "Name: Message" or a WhatsApp export.'
        );
        setIsLoading(false);
        return;
      }

      setMessages(parsedMsgs);

      // 2. Compute deterministic metrics
      const computedMetrics = calculateMetrics(parsedMsgs, [participants[0], participants[1]]);
      setMetrics(computedMetrics);

      // 3. Minimum delay for forensic analysis animation
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

      // 4. Generate diagnosis (Gemini API or local heuristics)
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

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navigation */}
      <Header
        hasReport={!!report}
        onReset={handleReset}
        onOpenSettings={() => setShowSettings(true)}
        apiKeyConfigured={!!apiKey && apiKey.trim().length > 0}
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
          <ChatInput onAnalyze={handleAnalyze} isLoading={isLoading} />
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
