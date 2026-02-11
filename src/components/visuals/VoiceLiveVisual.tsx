'use client';

import { motion } from 'framer-motion';
import { BRAND } from '@/lib/colors';

const RING_COLORS = [BRAND.canopy, BRAND.brick, BRAND.gold, BRAND.routeBlue, BRAND.magenta];
const PARTICLE_COLORS = [BRAND.gold, BRAND.canopy, BRAND.brick, BRAND.routeBlue, BRAND.magenta, BRAND.neon];

export default function VoiceLiveVisual() {
  const rings = [40, 70, 100, 130, 160];

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full" viewBox="-180 -180 360 360" fill="none">
        {/* Pulsing concentric rings */}
        {rings.map((r, i) => (
          <motion.circle
            key={r}
            cx="0"
            cy="0"
            r={r}
            stroke={RING_COLORS[i]}
            strokeWidth="1"
            fill="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.05, 0.2, 0.05],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Center breathing dot */}
        <motion.circle
          cx="0"
          cy="0"
          r="12"
          fill="var(--color-accent)"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const dist = 80 + (i % 3) * 30;
          return (
            <motion.circle
              key={`p-${i}`}
              cx={Math.cos(angle) * dist}
              cy={Math.sin(angle) * dist}
              r="2"
              fill={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
              animate={{
                x: [0, Math.cos(angle + 1) * 10, 0],
                y: [0, Math.sin(angle + 1) * 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
