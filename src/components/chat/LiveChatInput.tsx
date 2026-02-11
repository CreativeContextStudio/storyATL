'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStory } from '@/context/StoryContext';
import { staggerContainer, staggerItem, EASE_ATL } from '@/lib/animations';
import { renderStoryATLWordmarkInText } from '@/components/ui/StoryATLWordmark';

const suggestions = [
  'Tell me about storyATL',
  'Who are the five voices?',
  'How does the booth work?',
  'Tell me about Creative Context',
  'What is the PAFL application?',
  'Tell me about Atlanta',
];

export default function LiveChatInput() {
  const { state, addLiveMessage, setAtlantaTyping } = useStory();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasMessages = state.liveChatMessages.length > 0;

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const trimmed = text.trim();
    addLiveMessage('visitor', trimmed);
    setInput('');

    // Build conversation history from existing live messages + current message
    const history = [
      ...state.liveChatMessages.map((msg) => ({
        role: msg.type === 'visitor' ? ('user' as const) : ('assistant' as const),
        content: msg.text,
      })),
      { role: 'user' as const, content: trimmed },
    ];

    setIsLoading(true);
    setAtlantaTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      addLiveMessage('atlanta', data.message);
    } catch {
      addLiveMessage(
        'atlanta',
        "I'm having trouble connecting right now. Try again in a moment.",
      );
    } finally {
      setIsLoading(false);
      setAtlantaTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Suggestion chips — hidden while Atlanta is responding */}
      {!isLoading && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2"
        >
          {suggestions.map((s) => (
            <motion.button
              key={s}
              variants={staggerItem}
              onClick={() => handleSubmit(s)}
              disabled={isLoading}
              className="rounded-full border border-[var(--color-card-border)]
                         bg-[var(--color-card-bg)] px-3 py-1.5 sm:px-4 sm:py-2
                         text-xs font-medium text-text-primary
                         transition-all duration-[var(--duration-fast)] ease-atl
                         hover:border-accent hover:text-accent
                         disabled:pointer-events-none disabled:opacity-40"
            >
              {renderStoryATLWordmarkInText(s)}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Free-form input */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: EASE_ATL }}
        className="flex items-center gap-2 sm:gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(input);
          }}
          disabled={isLoading}
          placeholder={isLoading ? 'Atlanta is thinking...' : hasMessages ? 'Keep asking...' : 'Ask Atlanta anything...'}
          className="flex-1 rounded-full border border-[var(--color-card-border)]
                     bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-text-primary sm:px-5 sm:py-3
                     placeholder:text-text-secondary
                     outline-none transition-all duration-[var(--duration-fast)]
                     focus:border-accent focus:shadow-brand-md
                     disabled:opacity-50"
        />
        <button
          onClick={() => handleSubmit(input)}
          disabled={isLoading}
          className="h-11 rounded-full bg-accent px-5 text-sm font-bold sm:px-6
                     text-[var(--color-text-inverse)]
                     transition-all duration-[var(--duration-fast)] ease-atl
                     hover:bg-accent-hover
                     disabled:opacity-50"
        >
          Ask
        </button>
      </motion.div>
    </div>
  );
}
