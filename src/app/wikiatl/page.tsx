'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { staggerContainer, staggerItem, EASE_ATL, messageEntrance } from '@/lib/animations';

interface WikiMessage {
  id: string;
  type: 'visitor' | 'atlanta';
  text: string;
}

const CHIP_COUNT = 6;

const allSuggestions = [
  // Neighborhoods & places
  'Tell me about Sweet Auburn',
  'What is Buttermilk Bottom?',
  'How did Buckhead become part of Atlanta?',
  'What happened to Summerhill?',
  'Tell me about Piedmont Park',
  'What is the Atlanta University Center?',
  'What is Centennial Olympic Park?',
  'Why is Decatur important to Atlanta?',

  // People
  'Who was Maynard Jackson?',
  'Who was Alonzo Herndon?',
  'Who was Henry Grady?',
  'Who was John Wesley Dobbs?',
  'What did Martin Luther King Jr. do in Atlanta?',
  'Who is Ryan Gravel?',
  'Who was Shirley Franklin?',

  // Events & eras
  'What happened in 1906?',
  'Tell me about the Great Fire of 1917',
  'What were the 1996 Olympics like?',
  'What was the Atlanta Campaign?',
  'What was the washerwomen\'s strike?',
  'What was "An Appeal for Human Rights"?',
  'What was the Cotton States Exposition?',
  'What happened during Reconstruction?',

  // Transportation & infrastructure
  "Tell me about Atlanta's railroads",
  'How did the BeltLine start?',
  'Why is the airport so important?',
  'What was Terminus?',
  'How did MARTA shape the city?',

  // Themes & big questions
  'Why is Atlanta called the Black Mecca?',
  'What does "too busy to hate" mean?',
  'How has gentrification affected Atlanta?',
  'What was the Trail of Tears connection?',
  'How did Jim Crow shape Atlanta?',
  'Why does Atlanta keep reinventing itself?',
  'What role did Black colleges play?',
  'How did white flight change the city?',
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function WikiATLPage() {
  const [messages, setMessages] = useState<WikiMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>([]);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  // Shuffle suggestions client-side only to avoid hydration mismatch
  const refreshSuggestions = useCallback(() => {
    const asked = new Set(messages.filter((m) => m.type === 'visitor').map((m) => m.text));
    const available = allSuggestions.filter((s) => !asked.has(s));
    setVisibleSuggestions(pickRandom(available.length > 0 ? available : allSuggestions, CHIP_COUNT));
  }, [messages]);

  useEffect(() => {
    refreshSuggestions();
  }, [refreshSuggestions]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const trimmed = text.trim();

    const visitorMsg: WikiMessage = {
      id: `v-${Date.now()}`,
      type: 'visitor',
      text: trimmed,
    };
    setMessages((prev) => [...prev, visitorMsg]);
    setInput('');

    const history = [
      ...messages.map((msg) => ({
        role: msg.type === 'visitor' ? ('user' as const) : ('assistant' as const),
        content: msg.text,
      })),
      { role: 'user' as const, content: trimmed },
    ];

    setIsTyping(true);

    try {
      const res = await fetch('/api/wiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const atlantaMsg: WikiMessage = {
        id: `a-${Date.now()}`,
        type: 'atlanta',
        text: data.message,
      };
      setMessages((prev) => [...prev, atlantaMsg]);
    } catch {
      const errorMsg: WikiMessage = {
        id: `a-${Date.now()}`,
        type: 'atlanta',
        text: "I'm having trouble connecting right now. Try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6">
          <div className="mx-auto max-w-narrow py-6 sm:py-10">
            {/* Welcome header */}
            {!hasMessages && !isTyping && (
              <motion.div
                variants={messageEntrance}
                initial="hidden"
                animate="visible"
                className="mb-8 sm:mb-12"
              >
                <h1 className="mb-3 font-display text-fluid-3xl font-bold text-text-primary">
                  wiki<span className="text-accent">ATL</span>
                </h1>
                <p className="text-fluid-base leading-relaxed text-text-secondary">
                  Ask me anything about Atlanta&apos;s history — neighborhoods, people, events, and the layers that built this city.
                </p>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} type={msg.type} text={msg.text} skipEntrance={false} />
              ))}

              <AnimatePresence>
                {isTyping && <TypingIndicator />}
              </AnimatePresence>
            </div>

            <div ref={scrollAnchorRef} />
          </div>
        </div>

        {/* Fixed input area */}
        <div className="border-t border-divider bg-surface px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
          <div className="mx-auto max-w-narrow">
            <div className="flex flex-col gap-4">
              {/* Suggestion chips */}
              {!isTyping && visibleSuggestions.length > 0 && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2"
                >
                  {visibleSuggestions.map((s) => (
                    <motion.button
                      key={s}
                      variants={staggerItem}
                      onClick={() => handleSubmit(s)}
                      disabled={isTyping}
                      className="rounded-full border border-[var(--color-card-border)]
                                 bg-[var(--color-card-bg)] px-3 py-1.5 sm:px-4 sm:py-2
                                 text-xs font-medium text-text-primary
                                 transition-all duration-[var(--duration-fast)] ease-atl
                                 hover:border-accent hover:text-accent
                                 disabled:pointer-events-none disabled:opacity-40"
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Input + Ask button */}
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
                  disabled={isTyping}
                  placeholder={isTyping ? 'Atlanta is thinking...' : hasMessages ? 'Keep asking...' : 'Ask about Atlanta history...'}
                  className="flex-1 rounded-full border border-[var(--color-card-border)]
                             bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-text-primary sm:px-5 sm:py-3
                             placeholder:text-text-secondary
                             outline-none transition-all duration-[var(--duration-fast)]
                             focus:border-accent focus:shadow-brand-md
                             disabled:opacity-50"
                />
                <button
                  onClick={() => handleSubmit(input)}
                  disabled={isTyping}
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
          </div>
        </div>
      </main>
    </>
  );
}
