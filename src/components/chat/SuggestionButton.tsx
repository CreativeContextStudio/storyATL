'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
  highlight?: boolean;
}

/* Shared arrow SVG props */
const ARROW_STROKE = 'var(--color-suggestion-border)';
const ARROW_STROKE_WIDTH = 2.5;

/* Timing for sequential animation */
const FADE_IN_DURATION = 0.35;
const BOUNCE_DURATION = 0.9;
const FADE_OUT_DURATION = 0.3;
const STEP_INTERVAL = 1600; // ms per arrow in the sequence

/* Arrow sequence: top (0) -> right (1) -> bottom (2) -> left (3) */
type ArrowId = 0 | 1 | 2 | 3;

function useArrowSequence(active: boolean): ArrowId {
  const [current, setCurrent] = useState<ArrowId>(0);

  const advance = useCallback(() => {
    setCurrent((prev) => ((prev + 1) % 4) as ArrowId);
  }, []);

  useEffect(() => {
    if (!active) {
      setCurrent(0);
      return;
    }
    const id = setInterval(advance, STEP_INTERVAL);
    return () => clearInterval(id);
  }, [active, advance]);

  return current;
}

/* Shared enter/exit transition for each arrow */
const arrowFadeTransition = {
  duration: FADE_IN_DURATION,
  ease: EASE_ATL,
} as const;

export default function SuggestionButton({ text, onClick, highlight }: SuggestionButtonProps) {
  const activeArrow = useArrowSequence(!!highlight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_ATL, delay: 0.3 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE_ATL } }}
      className="flex flex-col items-center gap-0 py-5 sm:py-6"
    >
      {/* Top arrow slot */}
      {highlight ? (
        <div className="relative mb-1 h-[40px] w-[20px]">
          <AnimatePresence>
            {activeArrow === 0 && (
              <motion.svg
                key="arrow-top"
                width="20"
                height="40"
                viewBox="0 0 20 40"
                fill="none"
                stroke={ARROW_STROKE}
                strokeWidth={ARROW_STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0, y: -4 }}
                animate={{
                  opacity: 1,
                  y: [0, 8, 0],
                  transition: {
                    opacity: arrowFadeTransition,
                    y: {
                      duration: BOUNCE_DURATION,
                      repeat: Infinity,
                      ease: EASE_ATL,
                    },
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: FADE_OUT_DURATION, ease: EASE_ATL },
                }}
                className="absolute inset-0"
              >
                <path d="M10 2 L10 30 M4 24 L10 30 L16 24" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Static stem line when not highlighted */
        <div className="h-6 w-px bg-[var(--color-timeline-active)]" />
      )}

      {/* Button wrapper -- group so children can react to hover */}
      <div className="group relative">
        {/* Side + bottom arrows -- only when highlighted */}
        {highlight && (
          <>
            {/* Left arrow -- points right toward button */}
            <div
              className="pointer-events-none absolute right-full top-1/2 mr-2 h-[18px] w-[36px]"
              style={{ marginTop: -9 }}
            >
              <AnimatePresence>
                {activeArrow === 3 && (
                  <motion.svg
                    key="arrow-left"
                    width="36"
                    height="18"
                    viewBox="0 0 36 18"
                    fill="none"
                    stroke={ARROW_STROKE}
                    strokeWidth={ARROW_STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{
                      opacity: 0.7,
                      x: [0, 6, 0],
                      transition: {
                        opacity: arrowFadeTransition,
                        x: {
                          duration: BOUNCE_DURATION,
                          repeat: Infinity,
                          ease: EASE_ATL,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: FADE_OUT_DURATION, ease: EASE_ATL },
                    }}
                    className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                  >
                    <path d="M2 9 L28 9 M22 3 L28 9 L22 15" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>

            {/* Right arrow -- points left toward button */}
            <div
              className="pointer-events-none absolute left-full top-1/2 ml-2 h-[18px] w-[36px]"
              style={{ marginTop: -9 }}
            >
              <AnimatePresence>
                {activeArrow === 1 && (
                  <motion.svg
                    key="arrow-right"
                    width="36"
                    height="18"
                    viewBox="0 0 36 18"
                    fill="none"
                    stroke={ARROW_STROKE}
                    strokeWidth={ARROW_STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, x: 4 }}
                    animate={{
                      opacity: 0.7,
                      x: [0, -6, 0],
                      transition: {
                        opacity: arrowFadeTransition,
                        x: {
                          duration: BOUNCE_DURATION,
                          repeat: Infinity,
                          ease: EASE_ATL,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: FADE_OUT_DURATION, ease: EASE_ATL },
                    }}
                    className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                  >
                    <path d="M34 9 L8 9 M14 3 L8 9 L14 15" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom arrow -- points up toward button */}
            <div
              className="pointer-events-none absolute left-1/2 top-full mt-2 h-[36px] w-[18px]"
              style={{ marginLeft: -9 }}
            >
              <AnimatePresence>
                {activeArrow === 2 && (
                  <motion.svg
                    key="arrow-bottom"
                    width="18"
                    height="36"
                    viewBox="0 0 18 36"
                    fill="none"
                    stroke={ARROW_STROKE}
                    strokeWidth={ARROW_STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{
                      opacity: 0.7,
                      y: [0, -6, 0],
                      transition: {
                        opacity: arrowFadeTransition,
                        y: {
                          duration: BOUNCE_DURATION,
                          repeat: Infinity,
                          ease: EASE_ATL,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: FADE_OUT_DURATION, ease: EASE_ATL },
                    }}
                    className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                  >
                    <path d="M9 34 L9 8 M3 14 L9 8 L15 14" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Button */}
        <button
          onClick={onClick}
          style={highlight ? { animation: 'suggestion-pulse 2s ease-in-out infinite' } : undefined}
          className="flex items-center gap-2 rounded-full border-2
                     border-[var(--color-suggestion-border)]
                     bg-[var(--color-suggestion-bg)] px-4 py-2 sm:px-5 sm:py-2.5
                     text-sm font-semibold text-[var(--color-suggestion-text)]
                     transition-all duration-[var(--duration-base)] ease-atl
                     hover:bg-[var(--color-suggestion-border)]
                     hover:text-[var(--color-text-inverse)]
                     hover:[animation:none]"
        >
          {text}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-[var(--duration-fast)] group-hover:translate-y-0.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
