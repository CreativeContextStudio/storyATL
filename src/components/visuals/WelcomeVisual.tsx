'use client';

import { motion } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const RING_COLORS = [BRAND.canopy, BRAND.brick, BRAND.gold];

export default function WelcomeVisual() {
  const rings = [80, 140, 200];

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full overflow-visible" viewBox="-240 -240 480 480">
        {/* Ripple rings — infinite outward pulse */}
        {rings.map((r, i) => (
          <motion.circle
            key={r}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke={RING_COLORS[i]}
            strokeWidth="1"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [0.85, 1, 1.08],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: EASE_ATL,
            }}
            style={{ transformOrigin: '0px 0px' }}
          />
        ))}

        {/* Center breathing dot */}
        <motion.circle
          cx="0"
          cy="0"
          r="18"
          fill="var(--color-accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            opacity: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />

        {/* Wordmark */}
        <motion.text
          x="0"
          y="60"
          fill="var(--color-text-secondary)"
          fontSize="14"
          fontFamily="var(--font-mono)"
          fontWeight="500"
          textAnchor="middle"
          letterSpacing="0.15em"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1, ease: EASE_ATL }}
        >
          <tspan>story</tspan>
          <tspan fill="var(--color-accent)">ATL</tspan>
        </motion.text>
      </svg>
    </div>
  );
}
