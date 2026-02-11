'use client';

import { motion } from 'framer-motion';
import { messageEntrance, bounceEntrance } from '@/lib/animations';
import { useAutoType } from '@/hooks/useAutoType';
import { cn } from '@/lib/cn';
import { renderStoryATLWordmarkInText } from '@/components/ui/StoryATLWordmark';

interface ChatMessageProps {
  type: 'visitor' | 'atlanta';
  text: string;
  children?: React.ReactNode;
  skipEntrance?: boolean;
  autoType?: boolean;
  onAutoTypeComplete?: () => void;
}

export default function ChatMessage({
  type,
  text,
  children,
  skipEntrance,
  autoType,
  onAutoTypeComplete,
}: ChatMessageProps) {
  const isVisitor = type === 'visitor';
  const { displayText, isComplete } = useAutoType({
    text,
    delay: 300,
    speed: 80,
    enabled: !!autoType,
    onComplete: onAutoTypeComplete,
  });

  const shownText = autoType ? displayText : text;
  const isList = !(autoType && !isComplete) && text.includes('\n');
  const lines = isList ? text.split('\n').filter(Boolean) : [];

  return (
    <motion.div
      variants={autoType ? bounceEntrance : messageEntrance}
      initial={skipEntrance ? 'visible' : 'hidden'}
      animate="visible"
      className={cn('flex w-full', isVisitor ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[92%] rounded-brand-lg px-4 py-3 sm:max-w-[85%] sm:px-5 sm:py-3.5',
          'text-[var(--text-sm)] leading-relaxed',
          isVisitor
            ? 'bg-[var(--color-chat-visitor)] text-[var(--color-chat-visitor-text)] font-medium'
            : 'bg-[var(--color-chat-atlanta)] border border-[var(--color-chat-atlanta-border)] text-text-primary shadow-brand-sm',
          autoType && 'min-w-[220px] sm:min-w-[260px]',
        )}
      >
        {autoType && !isComplete ? (
          <p>
            {shownText}
            <span className="ml-0.5 inline-block animate-pulse text-accent">|</span>
          </p>
        ) : isList ? (
          <ul className="list-disc pl-5 space-y-1.5">
            {lines.map((line, i) => (
              <li key={i}>{renderStoryATLWordmarkInText(line.trim())}</li>
            ))}
          </ul>
        ) : (
          <p>{renderStoryATLWordmarkInText(shownText)}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
}
