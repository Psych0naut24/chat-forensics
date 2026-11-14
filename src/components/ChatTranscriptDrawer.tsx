import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { X, Search, MessageSquare } from 'lucide-react';

interface ChatTranscriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  participants: [string, string];
}

export const ChatTranscriptDrawer: React.FC<ChatTranscriptDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  participants,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSender, setSelectedSender] = useState<string>('all');
  const [p1, p2] = participants;

  if (!isOpen) return null;

  const filteredMessages = messages.filter((m) => {
    const matchesSender = selectedSender === 'all' || m.sender === selectedSender;
    const matchesSearch =
      searchTerm.trim() === '' || m.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSender && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-obsidian-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl h-full bg-obsidian-900 border-l border-obsidian-800 flex flex-col shadow-2xl">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-obsidian-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-serif">Transcript Inspector</h3>
              <p className="text-xs text-slate-400">
                {filteredMessages.length} of {messages.length} messages displayed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-obsidian-800/80 bg-obsidian-950/60 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword, date, or phrase..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-obsidian-900 border border-obsidian-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 font-mono transition"
            />
          </div>

          {/* Sender Filter Chips */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Filter:</span>
            <button
              onClick={() => setSelectedSender('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                selectedSender === 'all'
                  ? 'bg-amber-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-900 text-slate-400 border border-obsidian-800'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setSelectedSender(p1)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                selectedSender === p1
                  ? 'bg-amber-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-900 text-slate-400 border border-obsidian-800'
              }`}
            >
              {p1}
            </button>
            <button
              onClick={() => setSelectedSender(p2)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                selectedSender === p2
                  ? 'bg-amber-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-900 text-slate-400 border border-obsidian-800'
              }`}
            >
              {p2}
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 font-mono text-xs">
          {filteredMessages.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No messages match your search criteria.</div>
          ) : (
            filteredMessages.map((m) => {
              const isP1 = m.sender === p1;
              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border flex flex-col space-y-1 transition ${
                    isP1
                      ? 'bg-obsidian-950 border-obsidian-800 text-slate-200'
                      : 'bg-obsidian-850/80 border-obsidian-750 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className={`font-bold ${isP1 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {m.sender}
                    </span>
                    <span>
                      {m.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} •{' '}
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs whitespace-pre-wrap font-sans text-slate-200 leading-relaxed">
                    {m.text}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
