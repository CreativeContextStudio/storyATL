'use client';

import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAutoType } from '@/hooks/useAutoType';
import { messageEntrance, EASE_OUT } from '@/lib/animations';
import { cn } from '@/lib/cn';

interface SuggestionAutoTypeProps {
  text: string;
  onComplete: () => void;
}

export default function SuggestionAutoType({ text, onComplete }: SuggestionAutoTypeProps) {
  const firedRef = useRef(false);

  const handleTypingComplete = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  const { displayText, isTyping } = useAutoType({
    text,
    delay: 0,
    speed: 60,
    onComplete: handleTypingComplete,
  });

  return (
    <motion.div
      variants={messageEntrance}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE_OUT } }}
      className="flex w-full justify-end"
    >
      <div
        className={cn(
          'max-w-[92%] rounded-brand-lg px-4 py-3 sm:max-w-[85%] sm:px-5 sm:py-3.5',
          'text-[var(--text-sm)] leading-relaxed',
          'bg-[var(--color-chat-visitor)] text-[var(--color-chat-visitor-text)] font-medium',
        )}
      >
        <p>
          {displayText}
          {isTyping && (
            <span className="ml-0.5 inline-block animate-pulse text-[var(--color-chat-visitor-text)]">
              |
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
