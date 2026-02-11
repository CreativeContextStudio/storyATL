'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const STEP_COLORS = [BRAND.gold, BRAND.canopy, BRAND.brick, BRAND.routeBlue, BRAND.magenta, BRAND.neon, BRAND.gold];

const STEP_ICONS = [
  // play
  <><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></>,
  // check (consent)
  <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></>,
  // mic
  <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></>,
  // tag
  <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.828 8.828a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828Z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></>,
  // pin
  <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  // eye
  <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  // send (submit)
  <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
] as const;

const STEP_COUNT = 7;

/** Per-icon scale (consent, tag, submit are smaller to fit their backgrounds) */
const ICON_SCALES = [1, 0.75, 1, 0.75, 1, 1, 0.75];

/** Per-icon centering nudge [dx, dy] to compensate for asymmetric visual weight */
const ICON_OFFSETS: [number, number][] = [
  [0, 0],    // play
  [0, 0],    // consent
  [0, 0],    // mic
  [0, 0],    // tag
  [0, 0],    // pin
  [0, 0],    // eye
  [-3, 3],   // send — centroid sits upper-right of viewBox center
];

/** Center of the phone rect interior */
const CENTER_X = 100;
const CENTER_Y = 170;

/** Icon base size */
const ICON_SIZE = 110;

/** Circle background radius */
const CIRCLE_RADIUS = 58;

/** Timing (ms) */
const PULSE_IN_DURATION = 500;
const HOLD_DURATION = 1200;
const PULSE_OUT_DURATION = 400;
const INITIAL_DELAY = 1400;

export default function BoothVisual() {
  const [activeStep, setActiveStep] = useState(-1);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (activeStep === -1) {
      // Initial mount delay
      timer = setTimeout(() => {
        setActiveStep(0);
        setVisible(true);
      }, INITIAL_DELAY);
    } else if (visible) {
      // Showing — hold then hide
      timer = setTimeout(() => setVisible(false), PULSE_IN_DURATION + HOLD_DURATION);
    } else {
      // Hidden — advance to next (wraps seamlessly) and show
      timer = setTimeout(() => {
        tickRef.current += 1;
        setActiveStep((prev) => (prev + 1) % STEP_COUNT);
        setVisible(true);
      }, PULSE_OUT_DURATION + 100);
    }

    return () => clearTimeout(timer);
  }, [activeStep, visible]);

  const step = Math.max(activeStep, 0);
  const iconSize = ICON_SIZE * ICON_SCALES[step];
  const [dx, dy] = ICON_OFFSETS[step];

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full" viewBox="0 0 200 340" fill="none">
        {/* Phone outline */}
        <motion.rect
          x="20"
          y="20"
          width="160"
          height="300"
          rx="20"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: EASE_ATL }}
        />

        {/* Pulsing recording dot */}
        <motion.circle
          cx="100"
          cy="42"
          r="4"
          fill="var(--color-accent)"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            delay: 0.8,
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Pulsing icon display */}
        <AnimatePresence mode="wait">
          {visible && activeStep >= 0 && (
            <motion.g
              key={`${tickRef.current}-${activeStep}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: PULSE_IN_DURATION / 1000,
                ease: EASE_ATL,
              }}
              style={{ originX: `${CENTER_X}px`, originY: `${CENTER_Y}px` }}
            >
              {/* Colored circle background */}
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={CIRCLE_RADIUS}
                fill={STEP_COLORS[activeStep]}
                opacity={0.9}
              />

              {/* Icon (scaled per step) */}
              <svg
                x={CENTER_X - iconSize / 2 + dx}
                y={CENTER_Y - iconSize / 2 + dy}
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {STEP_ICONS[activeStep]}
              </svg>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
