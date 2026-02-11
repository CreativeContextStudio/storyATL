'use client';

import { motion } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const projectedLines = [
  "We don't just live here — we hold each other up.",
  'Auburn Avenue raised every sound this city ever made.',
  'My parents came here with two suitcases and a recipe.',
  'Nobody asked us what we wanted to keep.',
  "Home isn't the building — it's the corner, the tree.",
];

const BUILDING_COLORS = [BRAND.gold, BRAND.canopy, BRAND.brick, BRAND.magenta];

function getBuildingColor(col: number): string {
  if (col <= 55) return BUILDING_COLORS[0];
  if (col <= 95) return BUILDING_COLORS[1];
  if (col <= 155) return BUILDING_COLORS[2];
  return BUILDING_COLORS[3];
}

const BUILDINGS = [
  { centerX: 60,  xStart: 40,  xEnd: 80,  topY: 60, width: 40, delay: 0.0, duration: 20 },
  { centerX: 110, xStart: 80,  xEnd: 140, topY: 30, width: 60, delay: 0.15, duration: 28 },
  { centerX: 170, xStart: 140, xEnd: 200, topY: 40, width: 60, delay: 0.1, duration: 24 },
  { centerX: 230, xStart: 200, xEnd: 260, topY: 50, width: 60, delay: 0.2, duration: 32 },
];

const WINDOW_ROWS = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280];
const WINDOW_COLS = [55, 95, 155, 215];

const FLICKER_KEYFRAMES = [
  [0, 1, 0.3, 1, 0],           // blink twice
  [0, 1, 1, 0.2, 0],           // on-then-off
  [0, 0.2, 0.5, 0.8, 1],       // slow rise
  [0, 1, 0.1, 1, 1],           // on-off-on-stay
  [0, 0.6, 1, 1, 0.8],         // stays-on-long
];

interface WindowConfig {
  row: number;
  col: number;
  color: string;
  peakOpacity: number;
  dimOpacity: number;
  duration: number;
  delay: number;
  keyframes: number[];
}

function generateWindowConfig(row: number, col: number, index: number): WindowConfig {
  const peakOpacity = 0.3 + Math.random() * 0.25;
  const dimOpacity = Math.random() * 0.05;
  const duration = 2 + Math.random() * 4;
  const delay = 0.8 + Math.random() * 3;
  const pattern = FLICKER_KEYFRAMES[index % FLICKER_KEYFRAMES.length];
  const keyframes = pattern.map((k) => k * peakOpacity + (1 - k) * dimOpacity);

  return {
    row,
    col,
    color: getBuildingColor(col),
    peakOpacity,
    dimOpacity,
    duration,
    delay,
    keyframes,
  };
}

const WINDOWS: WindowConfig[] = WINDOW_ROWS.flatMap((row, ri) =>
  WINDOW_COLS.map((col, ci) => generateWindowConfig(row, col, ri * WINDOW_COLS.length + ci)),
);

export default function NightVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 lg:p-8">
      {/* Building silhouette */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_ATL }}
        className="relative h-full w-full"
      >
        <svg className="h-full w-full" viewBox="0 0 300 350" fill="none" overflow="hidden">
          {/* Clip paths for building footprints */}
          <defs>
            {BUILDINGS.map((b, i) => (
              <clipPath key={`clip-${i}`} id={`clip-building-${i}`}>
                <rect x={b.xStart} y={b.topY + (350 - b.topY) * 0.15} width={b.width} height={(350 - b.topY) * 0.70} />
              </clipPath>
            ))}
          </defs>

          {/* Building shape */}
          <motion.path
            d="M40 350 L40 80 L80 60 L80 350 M80 350 L80 50 L140 30 L140 350 M140 350 L140 60 L200 40 L200 350 M200 350 L200 70 L260 50 L260 350"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: EASE_ATL }}
          />

          {/* Windows */}
          {WINDOWS.map((w) => (
            <motion.rect
              key={`${w.row}-${w.col}`}
              x={w.col}
              y={w.row}
              width="8"
              height="6"
              fill={w.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: w.keyframes }}
              transition={{
                delay: w.delay,
                duration: w.duration,
                repeat: Infinity,
                repeatType: 'reverse' as const,
                ease: 'easeInOut' as const,
              }}
            />
          ))}
          {/* Vertical scrolling text per building */}
          {BUILDINGS.map((b, i) => (
            <g key={i} clipPath={`url(#clip-building-${i})`}>
              <motion.g
                initial={{ y: 350 }}
                animate={{ y: -150 }}
                transition={{
                  duration: b.duration,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <text
                  x={b.centerX}
                  y={0}
                  fill={BUILDING_COLORS[i]}
                  opacity="0.35"
                  fontSize="7"
                  fontFamily="var(--font-mono)"
                  fontWeight="500"
                  textAnchor="start"
                  transform={`rotate(-90, ${b.centerX}, 0)`}
                >
                  {projectedLines[i]}
                </text>
              </motion.g>
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
