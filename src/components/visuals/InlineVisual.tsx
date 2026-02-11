'use client';

import { motion } from 'framer-motion';
import { fadeScale } from '@/lib/animations';

interface InlineVisualProps {
  children: React.ReactNode;
  meta?: {
    title: string;
    subtitle: string;
    stat: string;
  };
}

export default function InlineVisual({ children, meta }: InlineVisualProps) {
  return (
    <motion.div
      variants={fadeScale}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[320px] overflow-hidden rounded-brand-lg
                 border border-[var(--color-card-border)] bg-[var(--color-card-bg)]
                 shadow-brand-sm lg:hidden"
    >
      {meta && (
        <div className="px-3 pt-3">
          <h3 className="font-display text-fluid-sm font-bold text-text-primary">
            {meta.title}
          </h3>
          <p className="text-[10px] text-text-secondary">{meta.subtitle}</p>
          <p className="mt-0.5 font-mono text-[9px] font-medium uppercase tracking-widest text-text-secondary">
            {meta.stat}
          </p>
        </div>
      )}
      <div className="relative aspect-square w-full">{children}</div>
    </motion.div>
  );
}
