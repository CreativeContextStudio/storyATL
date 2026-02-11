'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

/* ── Flow paths (invisible curves for traveling data dots) ── */

const FLOW_PATHS = [
  'M -120 -150 C -50 -80, 20 20, 110 160',   // NW diagonal
  'M 0 -180 C 12 -100, -12 40, -5 210',       // Spine
  'M 110 -160 C 50 -70, -20 30, -100 180',    // NE diagonal
];

const DOTS = [
  // NW diagonal (3)
  { flow: 0, delay: 2000, speed: 10000, size: 3 },
  { flow: 0, delay: 5500, speed: 9500,  size: 3 },
  { flow: 0, delay: 8000, speed: 10500, size: 2 },
  // Spine (5)
  { flow: 1, delay: 1200, speed: 8000,  size: 4 },
  { flow: 1, delay: 3800, speed: 7500,  size: 3 },
  { flow: 1, delay: 6400, speed: 8500,  size: 3 },
  { flow: 1, delay: 4600, speed: 9000,  size: 2 },
  { flow: 1, delay: 7800, speed: 7000,  size: 3 },
  // NE diagonal (4)
  { flow: 2, delay: 2800, speed: 9000,  size: 3 },
  { flow: 2, delay: 6000, speed: 9500,  size: 3 },
  { flow: 2, delay: 4200, speed: 8500,  size: 2 },
  { flow: 2, delay: 7500, speed: 10000, size: 3 },
];

/* ── Nested rectangles for gate icon paths ──────────────── */

const RECTS = [
  { hw: 125, hh: 175, speed: 28000, reverse: false, offset: 0 },
  { hw: 100, hh: 140, speed: 24000, reverse: true,  offset: 0.25 },
  { hw: 75,  hh: 105, speed: 20000, reverse: false, offset: 0.5 },
  { hw: 50,  hh: 70,  speed: 16000, reverse: true,  offset: 0.75 },
  { hw: 25,  hh: 35,  speed: 12000, reverse: false, offset: 0.125 },
];

const RECT_CY = 15; // vertical center of all rectangles

/** Returns a point along a rectangle perimeter at parameter t ∈ [0, 1) */
function getRectPoint(hw: number, hh: number, t: number): { x: number; y: number } {
  const w = hw * 2;
  const h = hh * 2;
  const perimeter = 2 * (w + h);
  const d = (((t % 1) + 1) % 1) * perimeter;

  const x1 = -hw, y1 = RECT_CY - hh;
  const x2 = hw, y2 = RECT_CY + hh;

  if (d <= w)           return { x: x1 + d,             y: y1 };            // top edge →
  if (d <= w + h)       return { x: x2,                 y: y1 + (d - w) };  // right edge ↓
  if (d <= 2 * w + h)   return { x: x2 - (d - w - h),  y: y2 };            // bottom edge ←
  return                       { x: x1,                 y: y2 - (d - 2 * w - h) }; // left edge ↑
}

/* ── Brand colors ───────────────────────────────────────── */

const GATE_COLORS = [BRAND.neon, BRAND.routeBlue, BRAND.gold, BRAND.canopy, BRAND.brick];
const DOT_COLORS = [
  BRAND.gold, BRAND.canopy, BRAND.brick,                                        // NW (3)
  BRAND.neon, BRAND.magenta, BRAND.routeBlue, BRAND.gold, BRAND.canopy,         // Spine (5)
  BRAND.brick, BRAND.neon, BRAND.magenta, BRAND.routeBlue,                      // NE (4)
];

/* ── Gate icons (Lucide-style) ──────────────────────────── */

const ICON_PATHS: { paths: string[]; circles?: { cx: number; cy: number; r: number }[] }[] = [
  { // eye
    paths: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'],
    circles: [{ cx: 12, cy: 12, r: 3 }],
  },
  { // pin
    paths: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'],
    circles: [{ cx: 12, cy: 10, r: 3 }],
  },
  { // person
    paths: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
    circles: [{ cx: 12, cy: 7, r: 4 }],
  },
  { // shield
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10'],
  },
  { // pencil
    paths: ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'],
  },
];

function GateIcon({ index, color }: { index: number; color: string }) {
  const icon = ICON_PATHS[index];
  if (!icon) return null;

  return (
    <g
      transform="translate(-12,-12) scale(1.2)"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle r={14} cx={12} cy={12} fill={color} stroke="none" />
      <g stroke="white">
        {icon.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {icon.circles?.map((c, i) => (
          <circle key={`c-${i}`} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
      </g>
    </g>
  );
}

/* ── Traveling dot (follows invisible flow curves) ──────── */

function TravelingDot({
  pathRef,
  delay,
  speed,
  size,
  color,
}: {
  pathRef: React.RefObject<SVGPathElement>;
  delay: number;
  speed: number;
  size: number;
  color: string;
}) {
  const gRef = useRef<SVGGElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  const tick = useCallback((now: number) => {
    const path = pathRef.current;
    const g = gRef.current;
    if (!path || !g) { rafRef.current = requestAnimationFrame(tick); return; }
    if (!startRef.current) startRef.current = now;

    const len = path.getTotalLength();
    const t = ((now - startRef.current) / speed) % 1;
    const pt = path.getPointAtLength(t * len);
    const fade = Math.min(t / 0.1, (1 - t) / 0.1, 1);

    g.setAttribute('transform', `translate(${pt.x},${pt.y})`);
    g.setAttribute('opacity', String(fade));
    rafRef.current = requestAnimationFrame(tick);
  }, [pathRef, speed]);

  useEffect(() => {
    if (!active) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, tick]);

  if (!active) return null;

  return (
    <g ref={gRef}>
      <circle r={size * 2.5} fill={color} opacity={0.15} />
      <circle r={size} fill={color} opacity={0.85} />
    </g>
  );
}

/* ── Rect traveler (gate icon follows a rectangular path) ─ */

function RectTraveler({
  hw,
  hh,
  speed,
  reverse,
  offset,
  fadeDelay,
  index,
  color,
}: {
  hw: number;
  hh: number;
  speed: number;
  reverse: boolean;
  offset: number;
  fadeDelay: number;
  index: number;
  color: string;
}) {
  const gRef = useRef<SVGGElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  const tick = useCallback((now: number) => {
    const g = gRef.current;
    if (!g) { rafRef.current = requestAnimationFrame(tick); return; }
    if (!startRef.current) startRef.current = now;

    let t = (((now - startRef.current) / speed) + offset) % 1;
    if (reverse) t = 1 - t;
    const pt = getRectPoint(hw, hh, t);

    g.setAttribute('transform', `translate(${pt.x},${pt.y})`);
    rafRef.current = requestAnimationFrame(tick);
  }, [hw, hh, speed, reverse, offset]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return (
    <motion.g
      ref={gRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.85 }}
      transition={{ duration: 0.6, delay: fadeDelay, ease: EASE_ATL }}
    >
      <GateIcon index={index} color={color} />
    </motion.g>
  );
}

/* ── Rotating wrapper (slow rotation for flow dot groups) ─ */

function RotatingGroup({
  cx,
  cy,
  duration,
  direction,
  children,
}: {
  cx: number;
  cy: number;
  duration: number;
  direction: 1 | -1;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <motion.g
        animate={{ rotate: 360 * direction }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        <g transform={`translate(${-cx},${-cy})`}>{children}</g>
      </motion.g>
    </g>
  );
}

/* ── Main component ───────────────────────────────────────── */

export default function ShieldVisual() {
  const ref0 = useRef<SVGPathElement>(null);
  const ref1 = useRef<SVGPathElement>(null);
  const ref2 = useRef<SVGPathElement>(null);

  const nwDots = DOTS.filter((d) => d.flow === 0);
  const spineDots = DOTS.filter((d) => d.flow === 1);
  const neDots = DOTS.filter((d) => d.flow === 2);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full overflow-visible" viewBox="-150 -200 300 440">
        {/* City grid background */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE_ATL }}
        >
          {/* Vertical streets */}
          {[-120, -80, -40, 0, 40, 80, 120].map((x) => (
            <line key={`v${x}`} x1={x} y1={-195} x2={x} y2={235} stroke="var(--color-text-secondary)" strokeWidth="0.5" opacity="0.1" />
          ))}
          {/* Horizontal streets */}
          {[-175, -125, -75, -25, 25, 75, 125, 175, 225].map((y) => (
            <line key={`h${y}`} x1={-145} y1={y} x2={145} y2={y} stroke="var(--color-text-secondary)" strokeWidth="0.5" opacity="0.1" />
          ))}
          {/* Diagonal avenues */}
          <line x1={-140} y1={-185} x2={130} y2={210} stroke="var(--color-text-secondary)" strokeWidth="0.7" opacity="0.07" />
          <line x1={130} y1={-175} x2={-120} y2={225} stroke="var(--color-text-secondary)" strokeWidth="0.7" opacity="0.07" />
          <line x1={-60} y1={-195} x2={140} y2={120} stroke="var(--color-text-secondary)" strokeWidth="0.5" opacity="0.06" />
        </motion.g>

        {/* NW flow — slow CW rotation, invisible path + visible dots */}
        <RotatingGroup cx={-5} cy={5} duration={55} direction={1}>
          <path ref={ref0} d={FLOW_PATHS[0]} fill="none" stroke="none" />
          {nwDots.map((dot, i) => (
            <TravelingDot key={`nw-${i}`} pathRef={ref0} delay={dot.delay} speed={dot.speed} size={dot.size} color={DOT_COLORS[i]} />
          ))}
        </RotatingGroup>

        {/* Spine flow — static invisible path + visible dots */}
        <path ref={ref1} d={FLOW_PATHS[1]} fill="none" stroke="none" />
        {spineDots.map((dot, i) => (
          <TravelingDot key={`spine-${i}`} pathRef={ref1} delay={dot.delay} speed={dot.speed} size={dot.size} color={DOT_COLORS[3 + i]} />
        ))}

        {/* NE flow — slow CCW rotation, invisible path + visible dots */}
        <RotatingGroup cx={5} cy={10} duration={50} direction={-1}>
          <path ref={ref2} d={FLOW_PATHS[2]} fill="none" stroke="none" />
          {neDots.map((dot, i) => (
            <TravelingDot key={`ne-${i}`} pathRef={ref2} delay={dot.delay} speed={dot.speed} size={dot.size} color={DOT_COLORS[8 + i]} />
          ))}
        </RotatingGroup>

        {/* 5 Gate icons — each travels along its nested rectangle */}
        {RECTS.map((r, i) => (
          <RectTraveler
            key={`gate-${i}`}
            hw={r.hw}
            hh={r.hh}
            speed={r.speed}
            reverse={r.reverse}
            offset={r.offset}
            fadeDelay={0.4 + i * 0.2}
            index={i}
            color={GATE_COLORS[i]}
          />
        ))}
      </svg>
    </div>
  );
}
