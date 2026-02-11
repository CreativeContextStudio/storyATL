export interface Voice {
  id: string;
  name: string;
  initial: string;
  neighborhood: string;
  theme: string;
  excerpt: string;
  color: string;
}

export interface BoothStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface PlanPhase {
  number: number;
  title: string;
  weeks: string;
  description: string;
}

export interface Message {
  id: string;
  type: 'visitor' | 'atlanta';
  text: string;
  exchange: number;
  component?: string;
}

export interface Exchange {
  id: number;
  slug: string;
  title: string;
  label: string;
  visitorQuestion: string;
  atlantaResponse: string;
  suggestion?: string;
  component?: string;
  visualMeta?: {
    title: string;
    subtitle: string;
    stat: string;
  };
}

export type ThemeMode = 'light' | 'dark';

export interface StoryState {
  currentExchange: number;
  visualExchange: number;
  highestReached: number;
  messages: Message[];
  theme: ThemeMode;
  isAtlantaTyping: boolean;
  liveChatMessages: Message[];
  autoTypeComplete: boolean;
  suggestionAutoType: { text: string; exchangeId: number } | null;
}

export type StoryAction =
  | { type: 'ADVANCE_EXCHANGE' }
  | { type: 'JUMP_TO_EXCHANGE'; payload: number }
  | { type: 'POPULATE_AND_JUMP'; payload: number }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'ADD_LIVE_MESSAGE'; payload: Message }
  | { type: 'SET_ATLANTA_TYPING'; payload: boolean }
  | { type: 'SET_AUTO_TYPE_COMPLETE'; payload: boolean }
  | { type: 'SET_SUGGESTION_AUTO_TYPE'; payload: { text: string; exchangeId: number } | null }
  | { type: 'SET_VISUAL_EXCHANGE'; payload: number }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'RESET' };
