'use client';

import { motion } from 'framer-motion';
import { boothSteps } from '@/data/boothSteps';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

function StepIcon({ icon, color }: { icon: string; color: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    play: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    check: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
    mic: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
    tag: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.828 8.828a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828Z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
    ),
    pin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    eye: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    send: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
      </svg>
    ),
  };

  return (
    <span style={{ color }}>
      {iconMap[icon] || null}
    </span>
  );
}

const STEP_COLORS = [BRAND.gold, BRAND.canopy, BRAND.brick, BRAND.routeBlue, BRAND.magenta, BRAND.neon, BRAND.gold];

export default function BoothSteps() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2"
    >
      {boothSteps.map((step, i) => (
        <motion.div
          key={step.number}
          variants={staggerItem}
          className="flex items-center gap-3 rounded-brand border border-[var(--color-card-border)]
                     bg-[var(--color-card-bg)] px-3 py-2.5 sm:px-4 sm:py-3"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center
                       rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: STEP_COLORS[i] }}
          >
            {step.number}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {step.title}
            </p>
            <p className="text-xs text-text-secondary">{step.description}</p>
          </div>
          <StepIcon icon={step.icon} color={STEP_COLORS[i]} />
        </motion.div>
      ))}
    </motion.div>
  );
}
