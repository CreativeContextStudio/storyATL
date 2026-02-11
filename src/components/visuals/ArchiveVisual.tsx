'use client';

import { motion } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

/* ── Brand colors for each highway ─────────────────────── */
const HWY_COLORS = {
  285: BRAND.gold,       // Gold — the perimeter
  75: BRAND.canopy,      // Canopy
  85: BRAND.brick,       // Brick
  20: BRAND.routeBlue,   // Route Blue
};

/* ── Highway path data (abstract Atlanta layout) ───────── */

// I-285 perimeter — clean ellipse via SVG arc commands (rx=145, ry=130)
const PATH_285 = 'M 0 -130 A 145 130 0 1 1 0 130 A 145 130 0 1 1 0 -130 Z';

// I-75: NW → downtown → S — clean straight lines
const PATH_75 = 'M -90 -185 L 0 0 L 8 185';

// I-85: NE → downtown → SW — clean straight lines
const PATH_85 = 'M 95 -185 L 0 0 L -60 185';

// I-20: E ↔ W — clean straight horizontal
const PATH_20 = 'M -185 0 L 185 0';


/* ── Animated highway path (draws on) ──────────────────── */
function HighwayPath({ d, color, width, delay, duration }: {
  d: string; color: string; width: number; delay: number; duration: number;
}) {
  return (
    <>
      {/* Glow layer */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.12}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: EASE_ATL }}
      />
      {/* Main stroke */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: EASE_ATL }}
      />
    </>
  );
}

/* ── Neighborhood label with randomized pulse ──────────── */
function NeighborhoodLabel({ x, y, text, delay, duration }: {
  x: number; y: number; text: string; delay: number; duration: number;
}) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="var(--color-text-secondary)"
      fontSize="7"
      fontWeight="500"
      fontFamily="var(--font-mono)"
      letterSpacing="1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      {text}
    </motion.text>
  );
}

/* ── Main component ────────────────────────────────────── */

export default function ArchiveVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <motion.svg
        className="h-full w-full overflow-visible"
        viewBox="-200 -210 400 420"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_ATL }}
      >
        {/* Subtle background grid */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE_ATL }}
        >
          {[-160, -120, -80, -40, 0, 40, 80, 120, 160].map((x) => (
            <line key={`v${x}`} x1={x} y1={-200} x2={x} y2={200} stroke="var(--color-text-secondary)" strokeWidth="0.4" opacity="0.07" />
          ))}
          {[-180, -140, -100, -60, -20, 20, 60, 100, 140, 180].map((y) => (
            <line key={`h${y}`} x1={-190} y1={y} x2={190} y2={y} stroke="var(--color-text-secondary)" strokeWidth="0.4" opacity="0.07" />
          ))}
        </motion.g>

        {/* I-285 Perimeter */}
        <HighwayPath d={PATH_285} color={HWY_COLORS[285]} width={2.5} delay={0.5} duration={3.5} />

        {/* I-20 East-West */}
        <HighwayPath d={PATH_20} color={HWY_COLORS[20]} width={2} delay={1.5} duration={2.5} />

        {/* I-75 NW to S */}
        <HighwayPath d={PATH_75} color={HWY_COLORS[75]} width={2} delay={0.8} duration={2.8} />

        {/* I-85 NE to SW */}
        <HighwayPath d={PATH_85} color={HWY_COLORS[85]} width={2} delay={1.0} duration={2.8} />

        {/* Neighborhood labels — start immediately, staggered durations for organic feel */}
        <NeighborhoodLabel x={0} y={-35} text="DOWNTOWN" delay={0.2} duration={5.2} />
        <NeighborhoodLabel x={-80} y={-50} text="BANKHEAD" delay={1.4} duration={6.8} />
        <NeighborhoodLabel x={80} y={-45} text="OLD FOURTH WARD" delay={0.7} duration={7.3} />
        <NeighborhoodLabel x={-65} y={55} text="WEST END" delay={2.1} duration={5.9} />
        <NeighborhoodLabel x={75} y={60} text="EAST ATLANTA" delay={1.0} duration={6.1} />
        <NeighborhoodLabel x={-95} y={95} text="COLLEGE PARK" delay={2.8} duration={7.7} />
        <NeighborhoodLabel x={100} y={95} text="DECATUR" delay={1.7} duration={5.5} />
        <NeighborhoodLabel x={55} y={-75} text="LITTLE FIVE POINTS" delay={0.5} duration={6.4} />
        <NeighborhoodLabel x={-120} y={-80} text="VININGS" delay={1.2} duration={7.1} />
        <NeighborhoodLabel x={10} y={145} text="HARTSFIELD-JACKSON" delay={3.2} duration={8.2} />
        <NeighborhoodLabel x={-40} y={-85} text="MIDTOWN" delay={0.9} duration={5.7} />
        <NeighborhoodLabel x={30} y={30} text="SUMMERHILL" delay={2.5} duration={6.6} />
        <NeighborhoodLabel x={-30} y={15} text="VINE CITY" delay={1.9} duration={7.4} />

        {/* "Atlanta" top label */}
        <motion.text
          x={0}
          y={-185}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="600"
          fontFamily="var(--font-display)"
          letterSpacing="5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 1.6, ease: EASE_ATL }}
        >
          ATLANTA
        </motion.text>
      </motion.svg>
    </div>
  );
}
