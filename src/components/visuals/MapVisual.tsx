'use client';

import { motion } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const VOICE_COLORS = [BRAND.gold, BRAND.canopy, BRAND.brick, BRAND.neon, BRAND.magenta];

// Radar sweep: 55° wedge at absolute coords, radius 140, centered at (180, 180)
const RADAR_CX = 180;
const RADAR_CY = 180;
const RADAR_R = 140;
const WEDGE_HALF_ANGLE = 27.5; // degrees — total wedge = 55°
const startRad = ((-90 - WEDGE_HALF_ANGLE) * Math.PI) / 180;
const endRad = ((-90 + WEDGE_HALF_ANGLE) * Math.PI) / 180;
// Absolute coordinates — matches the pattern used by the rotating MARTA lines
const RADAR_WEDGE_PATH = [
  `M ${RADAR_CX} ${RADAR_CY}`,
  `L ${RADAR_CX + RADAR_R * Math.cos(startRad)} ${RADAR_CY + RADAR_R * Math.sin(startRad)}`,
  `A ${RADAR_R} ${RADAR_R} 0 0 1 ${RADAR_CX + RADAR_R * Math.cos(endRad)} ${RADAR_CY + RADAR_R * Math.sin(endRad)}`,
  'Z',
].join(' ');
const LEAD_EDGE_X = RADAR_CX + RADAR_R * Math.cos(endRad);
const LEAD_EDGE_Y = RADAR_CY + RADAR_R * Math.sin(endRad);

const pins = [
  { x: 120, y: 80,  delay: 0.5,  angle: 15,  travel: 18, trackDuration: 3.6 },
  { x: 200, y: 120, delay: 0.7,  angle: 140, travel: 22, trackDuration: 4.2 },
  { x: 160, y: 180, delay: 0.6,  angle: 55,  travel: 16, trackDuration: 3.4 },
  { x: 80,  y: 160, delay: 0.8,  angle: 200, travel: 20, trackDuration: 4.6 },
  { x: 240, y: 200, delay: 0.9,  angle: 320, travel: 24, trackDuration: 3.8 },
  { x: 180, y: 260, delay: 1.0,  angle: 90,  travel: 17, trackDuration: 4.0 },
  { x: 100, y: 240, delay: 0.85, angle: 265, travel: 21, trackDuration: 4.8 },
  { x: 260, y: 100, delay: 1.1,  angle: 170, travel: 15, trackDuration: 3.2 },
  { x: 140, y: 140, delay: 0.75, angle: 45,  travel: 19, trackDuration: 4.4 },
  { x: 220, y: 280, delay: 1.15, angle: 310, travel: 25, trackDuration: 3.5 },
  { x: 60,  y: 120, delay: 0.95, angle: 120, travel: 16, trackDuration: 4.1 },
  { x: 280, y: 160, delay: 1.05, angle: 230, travel: 23, trackDuration: 3.9 },
];

export default function MapVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <motion.svg
        className="h-full w-full"
        viewBox="0 0 360 360"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_ATL }}
      >
        {/* Stylized road grid */}
        {[60, 120, 180, 240, 300].map((pos) => (
          <g key={pos}>
            <line
              x1={pos}
              y1="20"
              x2={pos}
              y2="340"
              stroke="var(--color-divider)"
              strokeWidth="1"
              opacity="0.4"
            />
            <line
              x1="20"
              y1={pos}
              x2="340"
              y2={pos}
              stroke="var(--color-divider)"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
        ))}

        {/* Diagonal roads (Atlanta-style) */}
        <line x1="40" y1="320" x2="320" y2="40" stroke="var(--color-divider)" strokeWidth="1.5" opacity="0.3" />
        <line x1="40" y1="40" x2="320" y2="320" stroke="var(--color-divider)" strokeWidth="1.5" opacity="0.3" />

        {/* MARTA line suggestion — clockwise sweep */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' as const }}
          style={{ transformOrigin: '180px 180px' }}
        >
          <motion.line
            x1="80"
            y1="20"
            x2="280"
            y2="340"
            stroke="var(--color-interactive)"
            strokeWidth="2"
            opacity="0.45"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: EASE_ATL, delay: 0.3 }}
          />
        </motion.g>

        {/* Second line — counter-clockwise sweep */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' as const }}
          style={{ transformOrigin: '180px 180px' }}
        >
          <motion.line
            x1="80"
            y1="20"
            x2="280"
            y2="340"
            stroke="var(--color-accent)"
            strokeWidth="2"
            opacity="0.45"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: EASE_ATL, delay: 0.3 }}
          />
        </motion.g>

        {/* Radar range rings — breathing concentric circles */}
        <motion.circle
          cx={RADAR_CX}
          cy={RADAR_CY}
          r={80}
          fill="none"
          stroke="var(--color-interactive)"
          strokeWidth="0.75"
          strokeDasharray="4 6"
          animate={{ opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.circle
          cx={RADAR_CX}
          cy={RADAR_CY}
          r={RADAR_R}
          fill="none"
          stroke="var(--color-interactive)"
          strokeWidth="0.75"
          strokeDasharray="4 6"
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' as const }}
        />

        {/* Center dot ping — periodic outward pulse */}
        <motion.circle
          cx={RADAR_CX}
          cy={RADAR_CY}
          r={2}
          fill="var(--color-interactive)"
          animate={{ opacity: [0.25, 0.12, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.circle
          cx={RADAR_CX}
          cy={RADAR_CY}
          fill="none"
          stroke="var(--color-interactive)"
          strokeWidth="0.75"
          animate={{ r: [3, 28, 3], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeOut' as const }}
        />

        {/* Radar sweep wedge — rotates clockwise around center */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' as const }}
          style={{ transformOrigin: '180px 180px' }}
        >
          <path
            d={RADAR_WEDGE_PATH}
            fill="var(--color-interactive)"
            opacity="0.15"
          />
          {/* Leading edge highlight */}
          <motion.line
            x1={RADAR_CX}
            y1={RADAR_CY}
            x2={LEAD_EDGE_X}
            y2={LEAD_EDGE_Y}
            stroke="var(--color-interactive)"
            strokeWidth="1"
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const }}
          />
        </motion.g>

        {/* Story pins */}
        {pins.map((pin, i) => {
          const color = VOICE_COLORS[i % VOICE_COLORS.length];
          const floatDelay = (i * 0.3) % 2;
          const pulseDuration = 2 + (i % 4) * 0.5;
          const pulseDelay = pin.delay + 0.5 + ((i * 0.2) % 1.5);

          const rad = (pin.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * pin.travel;
          const dy = Math.sin(rad) * pin.travel;

          return (
            <motion.g
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: pin.delay,
                duration: 0.4,
                ease: EASE_ATL,
              }}
              style={{ transformOrigin: `${pin.x}px ${pin.y}px` }}
            >
              {/* Track line */}
              <line
                x1={pin.x - dx}
                y1={pin.y - dy}
                x2={pin.x + dx}
                y2={pin.y + dy}
                stroke={color}
                strokeWidth="1"
                opacity="0.15"
              />
              {/* Pulse ring — anchored at home */}
              <motion.circle
                cx={pin.x}
                cy={pin.y}
                r="5"
                fill={color}
                initial={{ r: 5, opacity: 0.4 }}
                animate={{ r: [5, 12, 5], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: pulseDuration,
                  delay: pulseDelay,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
              {/* Outer dot — slides along track */}
              <motion.circle
                cx={pin.x}
                cy={pin.y}
                r="5"
                fill={color}
                opacity="0.7"
                animate={{
                  cx: [pin.x, pin.x + dx, pin.x, pin.x - dx, pin.x],
                  cy: [pin.y, pin.y + dy, pin.y, pin.y - dy, pin.y],
                }}
                transition={{
                  duration: pin.trackDuration,
                  delay: floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
              {/* Inner dot — slides in sync */}
              <motion.circle
                cx={pin.x}
                cy={pin.y}
                r="2"
                fill={color}
                animate={{
                  cx: [pin.x, pin.x + dx, pin.x, pin.x - dx, pin.x],
                  cy: [pin.y, pin.y + dy, pin.y, pin.y - dy, pin.y],
                }}
                transition={{
                  duration: pin.trackDuration,
                  delay: floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
            </motion.g>
          );
        })}
      </motion.svg>
    </div>
  );
}
