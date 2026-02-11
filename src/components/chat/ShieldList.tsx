'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const GATE_COLORS = [BRAND.neon, BRAND.routeBlue, BRAND.gold, BRAND.canopy, BRAND.brick];

const protectionTopics = [
  {
    title: 'Visibility',
    description: 'Public, community, or private',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Location precision',
    description: 'Exact, approximate, neighborhood, or hidden',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Attribution',
    description: 'Name, pseudonym, or anonymous',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Content guardrails',
    description: 'Harmful content filtered before posting',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    title: 'Edit & removal',
    description: 'Edit or remove your story anytime',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
  },
];

export default function ShieldList() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2"
    >
      {protectionTopics.map((topic, i) => (
        <motion.div
          key={topic.title}
          variants={staggerItem}
          className="flex items-center gap-3 rounded-brand border border-[var(--color-card-border)]
                     bg-[var(--color-card-bg)] px-3 py-2.5 sm:px-4 sm:py-3"
        >
          <span className="shrink-0" style={{ color: GATE_COLORS[i] }}>{topic.icon}</span>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {topic.title}
            </p>
            <p className="text-xs text-text-secondary">{topic.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
