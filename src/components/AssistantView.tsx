import React, { useState } from 'react';
import { Plant, ChatMessage } from '../types';
import { Send, Sparkles, Sprout, ArrowUp, Camera } from 'lucide-react';

interface AssistantViewProps {
  plants: Plant[];
  onOpenScan: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ plants, onOpenScan }) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string>('plant-monstera');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initial messages matching the showcase exactly
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'user',
      content: 'Why are the leaves on my monstera turning yellow?',
      timestamp: '10:14 AM',
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content:
        'Yellowing leaves on a monstera can be caused by a few things, most commonly watering, light, or humidity issues. Based on your photo and plant history, this looks like a possible watering check.',
      actionableSteps: [
        'Check the soil moisture 2 inches deep before watering.',
        'Make sure it’s getting bright, indirect light.',
        'Keep ambient humidity between 40–60%.',
      ],
      timestamp: '10:14 AM',
    },
  ]);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          plantContext: selectedPlant
            ? {
                name: selectedPlant.name,
                species: selectedPlant.scientificName,
                location: selectedPlant.locationLabel,
                light: selectedPlant.lightLevel,
              }
            : undefined,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'Check soil moisture before watering. Ensure bright indirect sunlight.';

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content:
            'Aroids like Monstera and Pothos thrive when the top 2-3 inches of soil dry out between waterings. Ensure good drainage and bright indirect light.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] pb-32 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <header className="px-5 pt-7 pb-3 border-b border-[#E2E6D5] dark:border-[#34483B]">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
            Ask Plantly
          </h1>
          <span className="w-2 h-2 rounded-full bg-[#D9F36A]" />
        </div>
        <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5">
          Always here for your plant questions.
        </p>

        {/* Plant Context Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          <span className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE] mr-1 shrink-0">
            About:
          </span>
          {plants.map((plant) => (
            <button
              key={plant.id}
              type="button"
              onClick={() => setSelectedPlantId(plant.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                selectedPlantId === plant.id
                  ? 'bg-[#0F2A1D] text-[#D9F36A] dark:bg-[#D9F36A] dark:text-[#0F2A1D] font-bold'
                  : 'bg-[#EEF0E4] dark:bg-[#1C3226] text-[#5D6E61] dark:text-[#C1CEBE]'
              }`}
            >
              {plant.name}
            </button>
          ))}
        </div>
      </header>

      {/* Messages Stream */}
      <main className="px-5 py-4 space-y-4 flex-1 overflow-y-auto">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] rounded-br-xs'
                    : 'bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-[#0F2A1D] dark:text-[#F5F2E9] rounded-bl-xs shadow-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-serif font-bold text-[#0F2A1D] dark:text-[#D9F36A]">
                    <span className="w-4 h-4 rounded-full bg-[#D9F36A] text-[#0F2A1D] flex items-center justify-center text-[9px] font-sans">
                      P
                    </span>
                    Plantly Assistant
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Structured actionable steps list matching showcase */}
                {msg.actionableSteps && (
                  <div className="mt-3 pt-3 border-t border-[#E2E6D5] dark:border-[#34483B] space-y-1.5">
                    <p className="font-semibold text-[11px] text-[#0F2A1D] dark:text-[#D9F36A]">
                      Here&apos;s what you can do:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                      {msg.actionableSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#5D6E61] dark:text-[#C1CEBE] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5D6E61] dark:text-[#C1CEBE] p-2">
            <span className="w-2 h-2 rounded-full bg-[#D9F36A] animate-ping" />
            <span>Consulting botanical reference...</span>
          </div>
        )}
      </main>

      {/* Bottom Input Area */}
      <footer className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-5 py-2 bg-gradient-to-t from-[#FBFBF7] dark:from-[#10231A] via-[#FBFBF7]/95 to-transparent">
        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar text-[11px]">
          <button
            type="button"
            onClick={() => handleSendMessage('Why are the leaves on my monstera turning yellow?')}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] shrink-0"
          >
            Why are leaves yellowing?
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('How often should I water my indoor plants?')}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] shrink-0"
          >
            How often to water?
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Is Monstera deliciosa toxic to pets?')}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] shrink-0"
          >
            Pet safety check
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask a question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full pl-4 pr-22 py-3.5 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-xs text-[#0F2A1D] dark:text-[#F5F2E9] placeholder-[#5D6E61]/60 focus:outline-none focus:ring-2 focus:ring-[#D9F36A] shadow-sm"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Scan plant image"
              onClick={onOpenScan}
              title="Attach photo"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] dark:hover:text-[#F5F2E9]"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send message"
              className="w-8 h-8 rounded-full bg-[#D9F36A] text-[#0F2A1D] flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs font-bold"
            >
              <ArrowUp className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};
