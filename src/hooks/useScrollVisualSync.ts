'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStory } from '@/context/StoryContext';

/**
 * Watches which exchange section is visible in the scroll container
 * and dispatches SET_VISUAL_EXCHANGE to keep the visual panel in sync.
 */
export function useScrollVisualSync(scrollContainerRef: React.RefObject<HTMLElement | null>) {
  const { state, dispatch } = useStory();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleExchangesRef = useRef<Map<number, number>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const suppressedRef = useRef(false);
  const suppressTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Suppress sync temporarily (called before programmatic scrolls)
  const suppressSync = useCallback(() => {
    suppressedRef.current = true;
    if (suppressTimeoutRef.current) clearTimeout(suppressTimeoutRef.current);
    suppressTimeoutRef.current = setTimeout(() => {
      suppressedRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (suppressedRef.current) return;

        for (const entry of entries) {
          const match = entry.target.id.match(/^exchange-(\d+)$/);
          if (!match) continue;
          const id = parseInt(match[1], 10);

          if (entry.isIntersecting) {
            visibleExchangesRef.current.set(id, entry.intersectionRatio);
          } else {
            visibleExchangesRef.current.delete(id);
          }
        }

        if (visibleExchangesRef.current.size === 0) return;

        // Pick the visible exchange with the highest intersection ratio
        let bestId = 0;
        let bestRatio = 0;
        visibleExchangesRef.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        // Debounce to avoid rapid visual switches during fast scrolling
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          dispatch({ type: 'SET_VISUAL_EXCHANGE', payload: bestId });
        }, 100);
      },
      {
        root: container,
        rootMargin: '-10% 0px -60% 0px', // detection zone: upper 30% of scroll area
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all exchange sections currently in the DOM
    const sections = container.querySelectorAll('[id^="exchange-"]');
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => {
      observerRef.current?.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (suppressTimeoutRef.current) clearTimeout(suppressTimeoutRef.current);
    };
  }, [scrollContainerRef, dispatch, state.currentExchange]);
  // Re-run when currentExchange changes because new exchange sections may appear in the DOM

  return { suppressSync };
}
