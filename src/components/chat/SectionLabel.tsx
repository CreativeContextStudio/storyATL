'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 py-5 sm:gap-4 sm:py-6 md:py-8"
    >
      <div className="h-px flex-1 bg-[var(--color-divider)]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-section-label)]">
        {text}
      </span>
      <div className="h-px flex-1 bg-[var(--color-divider)]" />
    </motion.div>
  );
}
