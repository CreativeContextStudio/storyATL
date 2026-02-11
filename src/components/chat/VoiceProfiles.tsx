'use client';

import { motion } from 'framer-motion';
import { voices } from '@/data/voices';
import { staggerContainer, staggerItem } from '@/lib/animations';

const voiceIcons: Record<string, React.ReactNode> = {
  marcus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  linh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  deja: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
    </svg>
  ),
  robert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  aisha: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
};

const voiceDescriptions: Record<string, string> = {
  marcus: 'in Vine City talks about community care.',
  linh: 'on Buford Highway shares migration stories.',
  deja: 'in Old Fourth Ward speaks on change.',
  robert: 'in Old Fourth Ward talks about what home means.',
  aisha: 'in Sweet Auburn on the music that raised her.',
};

export default function VoiceProfiles() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2.5"
    >
      {voices.map((voice) => (
        <motion.div
          key={voice.id}
          variants={staggerItem}
          className="flex items-start gap-2.5"
        >
          <span
            className="flex w-5 flex-shrink-0 items-center justify-center"
            style={{ color: voice.color, height: 'calc(var(--text-sm) * 1.625)' }}
          >
            {voiceIcons[voice.id]}
          </span>
          <p className="text-[var(--text-sm)] leading-relaxed text-text-secondary">
            <span className="font-semibold text-text-primary">
              {voice.name}
            </span>{' '}
            {voiceDescriptions[voice.id]}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
