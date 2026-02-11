'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface VisualMetaProps {
  title: string;
  subtitle: string;
  stat: string;
}

export default function VisualMeta({ title, subtitle, stat }: VisualMetaProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="relative z-10"
    >
      <h3 className="font-display text-fluid-lg font-bold text-text-primary">
        {title}
      </h3>
      <p className="text-xs text-text-secondary">{subtitle}</p>
      <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-widest text-text-secondary">
        {stat}
      </p>
    </motion.div>
  );
}
