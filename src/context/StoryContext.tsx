'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import type { StoryState, StoryAction, ThemeMode } from '@/types/exchange';
import { exchanges } from '@/data/exchanges';

const initialState: StoryState = {
  currentExchange: 0,
  visualExchange: 0,
  highestReached: 0,
  messages: [],
  theme: 'light',
  isAtlantaTyping: false,
  liveChatMessages: [],
  autoTypeComplete: false,
  suggestionAutoType: null,
};

function storyReducer(state: StoryState, action: StoryAction): StoryState {
  switch (action.type) {
    case 'ADVANCE_EXCHANGE': {
      const next = Math.min(state.currentExchange + 1, exchanges.length - 1);
      return {
        ...state,
        currentExchange: next,
        visualExchange: next,
        highestReached: Math.max(state.highestReached, next),
      };
    }
    case 'JUMP_TO_EXCHANGE': {
      const target = Math.max(0, Math.min(action.payload, state.highestReached));
      return {
        ...state,
        currentExchange: target,
        visualExchange: target,
      };
    }
    case 'POPULATE_AND_JUMP': {
      const target = Math.max(0, Math.min(action.payload, exchanges.length - 1));
      const existingExchangeIds = new Set(state.messages.map((m) => m.exchange));
      const newMessages = [...state.messages];
      for (let i = 0; i <= target; i++) {
        if (!existingExchangeIds.has(i)) {
          const ex = exchanges[i];
          if (ex.visitorQuestion) {
            newMessages.push({
              id: `visitor-${i}-pop`,
              type: 'visitor',
              text: ex.visitorQuestion,
              exchange: i,
            });
          }
          newMessages.push({
            id: `atlanta-${i}-pop`,
            type: 'atlanta',
            text: ex.atlantaResponse,
            exchange: i,
            component: ex.component,
          });
        }
      }
      return {
        ...state,
        currentExchange: target,
        visualExchange: target,
        highestReached: Math.max(state.highestReached, target),
        messages: newMessages,
        autoTypeComplete: true,
      };
    }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'ADD_LIVE_MESSAGE':
      return {
        ...state,
        liveChatMessages: [...state.liveChatMessages, action.payload],
      };
    case 'SET_ATLANTA_TYPING':
      return { ...state, isAtlantaTyping: action.payload };
    case 'SET_AUTO_TYPE_COMPLETE':
      return { ...state, autoTypeComplete: action.payload };
    case 'SET_SUGGESTION_AUTO_TYPE':
      return { ...state, suggestionAutoType: action.payload };
    case 'SET_VISUAL_EXCHANGE': {
      // Don't let scroll sync change visual during live chat (exchange 9)
      if (state.currentExchange === 9) return state;
      return { ...state, visualExchange: action.payload };
    }
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'RESET':
      return {
        ...initialState,
        theme: state.theme,
      };
    default:
      return state;
  }
}

interface StoryContextValue {
  state: StoryState;
  dispatch: React.Dispatch<StoryAction>;
  advance: () => void;
  jumpTo: (n: number) => void;
  goBack: () => void;
  goForward: () => void;
  toggleTheme: () => void;
  reset: () => void;
  addMessage: (type: 'visitor' | 'atlanta', text: string, exchange: number, component?: string) => void;
  addLiveMessage: (type: 'visitor' | 'atlanta', text: string) => void;
  setAtlantaTyping: (typing: boolean) => void;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storyReducer, initialState);

  // Load theme from localStorage, falling back to system preference
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('storyatl-theme');
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
    if (stored && (stored === 'light' || stored === 'dark')) {
      dispatch({ type: 'SET_THEME', payload: stored as ThemeMode });
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: 'SET_THEME', payload: prefersDark ? 'dark' : 'light' });
    }
  }, []);

  // Persist theme and apply to DOM
  useEffect(() => {
    try {
      localStorage.setItem('storyatl-theme', state.theme);
    } catch {
      // localStorage unavailable — silently ignore
    }
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Initialize Exchange 0: typing dots → greeting message
  // Only fire on the story page (/)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') return;
    if (state.currentExchange !== 0 || state.messages.length > 0 || state.autoTypeComplete) return;

    const dotsTimer = setTimeout(() => {
      dispatch({ type: 'SET_ATLANTA_TYPING', payload: true });
    }, 500);

    const greetingTimer = setTimeout(() => {
      dispatch({ type: 'SET_ATLANTA_TYPING', payload: false });
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `atlanta-0-${Date.now()}`,
          type: 'atlanta',
          text: exchanges[0].atlantaResponse,
          exchange: 0,
        },
      });
    }, 2000);

    return () => {
      clearTimeout(dotsTimer);
      clearTimeout(greetingTimer);
    };
  }, [state.currentExchange, state.messages.length, state.autoTypeComplete]);

  const advance = useCallback(() => {
    dispatch({ type: 'ADVANCE_EXCHANGE' });
  }, []);

  const jumpTo = useCallback((n: number) => {
    dispatch({ type: 'POPULATE_AND_JUMP', payload: n });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'JUMP_TO_EXCHANGE', payload: state.currentExchange - 1 });
  }, [state.currentExchange]);

  const goForward = useCallback(() => {
    if (state.currentExchange < exchanges.length - 1) {
      dispatch({ type: 'POPULATE_AND_JUMP', payload: state.currentExchange + 1 });
    }
  }, [state.currentExchange]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const addMessage = useCallback(
    (type: 'visitor' | 'atlanta', text: string, exchange: number, component?: string) => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `${type}-${exchange}-${Date.now()}`,
          type,
          text,
          exchange,
          component,
        },
      });
    },
    [],
  );

  const addLiveMessage = useCallback(
    (type: 'visitor' | 'atlanta', text: string) => {
      dispatch({
        type: 'ADD_LIVE_MESSAGE',
        payload: {
          id: `live-${type}-${Date.now()}`,
          type,
          text,
          exchange: 9,
        },
      });
    },
    [],
  );

  const setAtlantaTyping = useCallback((typing: boolean) => {
    dispatch({ type: 'SET_ATLANTA_TYPING', payload: typing });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      advance,
      jumpTo,
      goBack,
      goForward,
      toggleTheme,
      reset,
      addMessage,
      addLiveMessage,
      setAtlantaTyping,
    }),
    [state, advance, jumpTo, goBack, goForward, toggleTheme, reset, addMessage, addLiveMessage, setAtlantaTyping],
  );

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within StoryProvider');
  return ctx;
}
