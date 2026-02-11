'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { StoryATLWordmark } from '@/components/ui/StoryATLWordmark';
import { staggerContainer, staggerItem, EASE_ATL, messageEntrance } from '@/lib/animations';

interface AboutMessage {
  id: string;
  type: 'visitor' | 'atlanta';
  text: string;
}

const CHIP_COUNT = 6;

const allSuggestions = [
  // James McKay / Creative Context
  'Who is James McKay?',
  'What is Creative Context?',
  'Where is James based?',
  'What does James do?',
  'What is Creative Context Studio?',
  'How long has James been producing?',

  // Career & experience
  'What networks has James worked with?',
  'Tell me about the IBM campaign',
  'What was the netuser film?',
  'What Fortune 500 clients has he worked with?',
  'What did James do at RF Studio53?',
  'Tell me about the Pirates of the Caribbean work',
  "What's the biggest team James has managed?",
  'What broadcast shows has he produced?',

  // AI & technology
  'How does James use AI in production?',
  'What AI tools does James work with?',
  'Tell me about the AI brand ambassador project',
  'What are MCPs and how does James use them?',
  'How does James use ElevenLabs?',
  'What is the agentic production system?',

  // Skills & philosophy
  "What's James's production philosophy?",
  'What technical skills does James have?',
  'How does James approach AI adoption?',
  'What programming languages does James know?',

  // storyATL & Brief
  'What is storyATL?',
  'How does the recording booth work?',
  'What is the PAFL Brief?',
  'How does the projection mapping work?',
  'Who are the five voices?',
  'What is the storyATL map?',
  'How does storyATL protect privacy?',
  "What's the storyATL implementation plan?",

  // Scale & capabilities
  'How many continents has James produced on?',
  'What is the performance video testing framework?',
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function AboutIntro() {
  return (
    <>
      <h1 className="mb-4 font-display text-fluid-2xl font-bold text-text-primary sm:mb-5">
        About
      </h1>
      <div className="flex flex-col gap-4 text-fluid-base leading-relaxed text-text-secondary sm:gap-5">
        <section>
          <h2 className="mb-1.5 font-display text-fluid-lg font-bold text-text-primary">
            <StoryATLWordmark />
          </h2>
          <p className="text-fluid-base">
            <StoryATLWordmark /> is a living archive where Atlanta tells its own stories. Every story is recorded by a
            real person in a real neighborhood. Every voice is tagged, mapped, and made visible — on screens, on
            walls, in the air.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-fluid-lg font-bold text-text-primary">
            Creative Context
          </h2>
          <p className="text-fluid-base">
            Creative Context is a studio at the intersection of design, technology, and storytelling. Founded by James McKay and based in Atlanta, Creative Context builds tools that make stories visible and engaging, not just heard.
          </p>
        </section>
      </div>

      <p className="mt-5 text-fluid-sm text-text-secondary sm:mt-6">
        Have questions about James McKay, Creative Context, or <StoryATLWordmark />? Ask <span aria-hidden="true">→</span>
      </p>
    </>
  );
}

export default function AboutPage() {
  const [messages, setMessages] = useState<AboutMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>([]);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

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

    const visitorMsg: AboutMessage = {
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
      const res = await fetch('/api/about-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const assistantMsg: AboutMessage = {
        id: `a-${Date.now()}`,
        type: 'atlanta',
        text: data.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: AboutMessage = {
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
      <main className="relative mx-auto flex w-full max-w-container flex-1 min-h-0">
        {/* Left column — desktop only, always visible */}
        <div className="hidden w-[45%] lg:block">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="px-6 py-8 lg:px-8 lg:py-10">
              <motion.div
                variants={messageEntrance}
                initial="hidden"
                animate="visible"
              >
                <AboutIntro />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right column — chatbot */}
        <div className="flex w-full flex-col lg:w-[55%] h-full overflow-hidden">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6">
            <div className="mx-auto max-w-narrow lg:max-w-none py-6 sm:py-10">
              {/* Mobile-only intro text */}
              <div className="lg:hidden">
                {!hasMessages && !isTyping && (
                  <motion.div
                    variants={messageEntrance}
                    initial="hidden"
                    animate="visible"
                  >
                    <AboutIntro />
                  </motion.div>
                )}
              </div>

              {/* Messages */}
              <div className={hasMessages ? 'flex flex-col gap-4 sm:gap-5' : 'flex flex-col gap-4 sm:gap-5 mt-4'}>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} type={msg.type} text={msg.text} skipEntrance={false} />
                ))}

                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>
              </div>

              {/* Suggestion chips — inside scroll area, below messages */}
              {!isTyping && visibleSuggestions.length > 0 && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 flex flex-wrap gap-2"
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

              <div ref={scrollAnchorRef} />
            </div>
          </div>

          {/* Fixed input area */}
          <div className="border-t border-divider bg-surface px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
            <div className="mx-auto max-w-narrow lg:max-w-none">
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
                    placeholder={isTyping ? 'Thinking...' : hasMessages ? 'Keep asking...' : 'Ask about James McKay, Creative Context, storyATL...'}
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
