'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { phases } from '@/data/phases';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const phaseColors = [BRAND.canopy, BRAND.canopyLight, BRAND.brick, BRAND.gold, BRAND.magenta, BRAND.routeBlue];

/* ── Phase icons (Lucide-style, 24×24 viewBox) ────────────── */

const PHASE_ICONS: { paths: string[]; circles?: { cx: number; cy: number; r: number }[] }[] = [
  { // 0 — Layers (Foundation)
    paths: [
      'M12 2L2 7l10 5 10-5-10-5Z',
      'M2 17l10 5 10-5',
      'M2 12l10 5 10-5',
    ],
  },
  { // 1 — Users (Community Layer)
    paths: [
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
      'M22 21v-2a4 4 0 0 0-3-3.87',
      'M16 3.13a4 4 0 0 1 0 7.75',
    ],
    circles: [{ cx: 9, cy: 7, r: 4 }],
  },
  { // 2 — Compass (Discovery)
    paths: [
      'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
    ],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  { // 3 — Monitor (Projection)
    paths: [
      'M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
      'M8 21h8',
      'M12 17v4',
    ],
  },
  { // 4 — Rocket (Public Launch)
    paths: [
      'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
      'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
      'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
      'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
    ],
  },
  { // 5 — RefreshCw (Sustain)
    paths: [
      'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
      'M21 3v5h-5',
      'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
      'M3 21v-5h5',
    ],
  },
];

function PhaseIcon({ index }: { index: number }) {
  const icon = PHASE_ICONS[index];
  if (!icon) return null;

  return (
    <g
      transform="translate(-12,-12)"
      stroke="white"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {icon.circles?.map((c, i) => (
        <circle key={`c-${i}`} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
    </g>
  );
}

/* ── Timing ────────────────────────────────────────────────── */

const PHASE_COUNT = 6;
const INITIAL_DELAY = 1.0;       // seconds before first phase pops
const PER_PHASE_DELAY = 0.55;    // seconds between each phase pop
const SPRING_SETTLE = 1.2;       // approximate spring settle time
const HOLD_AFTER_ALL = 1200;     // ms to hold the full display before restarting

// Total time from mount to last phase settled
const TOTAL_ANIM_MS = (INITIAL_DELAY + (PHASE_COUNT - 1) * PER_PHASE_DELAY + SPRING_SETTLE) * 1000;

/* ── Component ─────────────────────────────────────────────── */

export default function PlanVisual() {
  const [cycle, setCycle] = useState(0);

  const centerX = 200;
  const centerY = 280;
  const radius = 200;

  // Position dots along a semicircular arc
  const dots = phases.map((phase, i) => {
    const angle = Math.PI + (i / (phases.length - 1)) * Math.PI;
    return {
      ...phase,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      color: phaseColors[i],
    };
  });

  // Create arc path
  const arcPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

  // Loop: after all phases revealed + hold, restart
  useEffect(() => {
    const timer = setTimeout(() => setCycle((c) => c + 1), TOTAL_ANIM_MS + HOLD_AFTER_ALL);
    return () => clearTimeout(timer);
  }, [cycle]);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full overflow-visible" viewBox="0 0 400 320" fill="none">
        {/* Arc line */}
        <motion.path
          key={`arc-${cycle}`}
          d={arcPath}
          stroke="var(--color-divider)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: EASE_ATL }}
        />

        {/* Phase icons */}
        {dots.map((dot, i) => (
          <g key={`${cycle}-${dot.number}`} transform={`translate(${dot.x}, ${dot.y})`}>
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring' as const,
                stiffness: 280,
                damping: 12,
                delay: INITIAL_DELAY + i * PER_PHASE_DELAY,
              }}
            >
              <circle r={16} fill={dot.color} />
              <PhaseIcon index={i} />
            </motion.g>
            <motion.text
              y={-28}
              fill="var(--color-text-secondary)"
              fontSize="10"
              fontFamily="var(--font-body)"
              fontWeight="500"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: INITIAL_DELAY + i * PER_PHASE_DELAY + 0.3, duration: 0.4 }}
            >
              {dot.number}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}
