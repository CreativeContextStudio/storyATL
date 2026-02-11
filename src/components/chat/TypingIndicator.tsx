'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/animations';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.2, ease: EASE_OUT } }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-1.5 rounded-brand-lg border border-[var(--color-chat-atlanta-border)] bg-[var(--color-chat-atlanta)] px-4 py-3 shadow-brand-sm sm:px-5 sm:py-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 rounded-full bg-text-secondary"
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
