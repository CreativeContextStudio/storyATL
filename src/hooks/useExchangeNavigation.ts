'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useStory } from '@/context/StoryContext';
import { exchanges } from '@/data/exchanges';

export function useExchangeNavigation(suppressSync?: () => void) {
  const { state, dispatch, advance, addMessage } = useStory();
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutRefs.current.push(id);
    return id;
  }, []);

  // Clear all tracked timeouts on unmount
  useEffect(() => {
    return () => {
      for (const id of timeoutRefs.current) {
        clearTimeout(id);
      }
      timeoutRefs.current = [];
    };
  }, []);

  const scrollToExchange = useCallback((exchangeId: number) => {
    const el = document.getElementById(`exchange-${exchangeId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: string, currentExchangeId: number) => {
      // Start auto-type animation instead of instantly adding the message
      dispatch({
        type: 'SET_SUGGESTION_AUTO_TYPE',
        payload: { text: suggestion, exchangeId: currentExchangeId },
      });
    },
    [dispatch],
  );

  const handleSuggestionAutoTypeComplete = useCallback(() => {
    const autoType = state.suggestionAutoType;
    if (!autoType) return;

    // Clear auto-type state (exit animation starts)
    dispatch({ type: 'SET_SUGGESTION_AUTO_TYPE', payload: null });

    // Stagger: wait for exit animation before adding new content
    safeTimeout(() => {
      // Add visitor message
      addMessage('visitor', autoType.text, autoType.exchangeId + 1);

      // Show typing indicator
      dispatch({ type: 'SET_ATLANTA_TYPING', payload: true });

      // After delay, add Atlanta response and advance
      safeTimeout(() => {
        dispatch({ type: 'SET_ATLANTA_TYPING', payload: false });
        const nextExchange = exchanges[autoType.exchangeId + 1];
        if (nextExchange) {
          addMessage(
            'atlanta',
            nextExchange.atlantaResponse,
            autoType.exchangeId + 1,
            nextExchange.component,
          );
        }
        advance();
      }, 1200);
    }, 300);
  }, [state.suggestionAutoType, addMessage, advance, dispatch, safeTimeout]);

  // Auto-scroll to current exchange section when it changes
  useEffect(() => {
    if (state.currentExchange > 0) {
      suppressSync?.();
      safeTimeout(() => {
        scrollToExchange(state.currentExchange);
      }, 350);
    }
  }, [state.currentExchange, scrollToExchange, suppressSync, safeTimeout]);

  return {
    chatThreadRef,
    scrollToExchange,
    handleSuggestionClick,
    handleSuggestionAutoTypeComplete,
  };
}
