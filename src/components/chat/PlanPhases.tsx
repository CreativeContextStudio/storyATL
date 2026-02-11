'use client';

import { motion } from 'framer-motion';
import { phases } from '@/data/phases';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const phaseColors = [BRAND.canopy, BRAND.canopyLight, BRAND.brick, BRAND.gold, BRAND.magenta, BRAND.routeBlue];

export default function PlanPhases() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2"
    >
      {phases.map((phase, i) => (
        <motion.div
          key={phase.number}
          variants={staggerItem}
          style={{ borderLeftColor: phaseColors[i] }}
          className="rounded-brand border-l-4
                     border border-[var(--color-card-border)]
                     bg-[var(--color-card-bg)] px-3 py-2.5 sm:px-4 sm:py-3"
        >
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-text-primary">
              Phase {phase.number}: {phase.title}
            </p>
            <span className="text-xs font-medium text-text-secondary">
              {phase.weeks}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {phase.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
