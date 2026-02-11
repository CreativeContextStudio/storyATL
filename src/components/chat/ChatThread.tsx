'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useStory } from '@/context/StoryContext';
import { exchanges } from '@/data/exchanges';
import ChatMessage from './ChatMessage';
import SectionLabel from './SectionLabel';
import SuggestionButton from './SuggestionButton';
import SuggestionAutoType from './SuggestionAutoType';
import TypingIndicator from './TypingIndicator';
import LiveChatInput from './LiveChatInput';
import { useExchangeNavigation } from '@/hooks/useExchangeNavigation';
import { useScrollVisualSync } from '@/hooks/useScrollVisualSync';
import InlineVisual from '@/components/visuals/InlineVisual';

const VoiceProfiles = dynamic(() => import('./VoiceProfiles'), { ssr: false });
const BoothSteps = dynamic(() => import('./BoothSteps'), { ssr: false });
const ShieldList = dynamic(() => import('./ShieldList'), { ssr: false });
const PlanPhases = dynamic(() => import('./PlanPhases'), { ssr: false });

const WelcomeVisual = dynamic(() => import('@/components/visuals/WelcomeVisual'), { ssr: false });
const ArchiveVisual = dynamic(() => import('@/components/visuals/ArchiveVisual'), { ssr: false });
const VoicesVisual = dynamic(() => import('@/components/visuals/VoicesVisual'), { ssr: false });
const BoothVisual = dynamic(() => import('@/components/visuals/BoothVisual'), { ssr: false });
const ShieldVisual = dynamic(() => import('@/components/visuals/ShieldVisual'), { ssr: false });
const MapVisual = dynamic(() => import('@/components/visuals/MapVisual'), { ssr: false });
const NightVisual = dynamic(() => import('@/components/visuals/NightVisual'), { ssr: false });
const BuilderVisual = dynamic(() => import('@/components/visuals/BuilderVisual'), { ssr: false });
const PlanVisual = dynamic(() => import('@/components/visuals/PlanVisual'), { ssr: false });
const VoiceLiveVisual = dynamic(() => import('@/components/visuals/VoiceLiveVisual'), { ssr: false });

const inlineVisualComponents: Record<number, React.ComponentType> = {
  0: WelcomeVisual,
  1: ArchiveVisual,
  2: VoicesVisual,
  3: BoothVisual,
  4: ShieldVisual,
  5: MapVisual,
  6: NightVisual,
  7: BuilderVisual,
  8: PlanVisual,
  9: VoiceLiveVisual,
};

function ExchangeContent({ component }: { component?: string }) {
  switch (component) {
    case 'VoiceProfiles':
      return <VoiceProfiles />;
    case 'BoothSteps':
      return <BoothSteps />;
    case 'ShieldList':
      return <ShieldList />;
    case 'PlanPhases':
      return <PlanPhases />;
    default:
      return null;
  }
}

export default function ChatThread() {
  const { state, dispatch } = useStory();
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const { suppressSync } = useScrollVisualSync(scrollContainerRef);
  const { chatThreadRef, handleSuggestionClick, handleSuggestionAutoTypeComplete } =
    useExchangeNavigation(suppressSync);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // Capture the scroll container (parent with overflow-y-auto) once chatThreadRef mounts
  useEffect(() => {
    if (chatThreadRef.current) {
      scrollContainerRef.current = chatThreadRef.current.parentElement as HTMLElement;
    }
  }, [chatThreadRef]);

  // Called when Exchange 0 greeting finishes auto-typing — linger, then show suggestion
  const handleGreetingTyped = useCallback(() => {
    setTimeout(() => {
      dispatch({ type: 'SET_AUTO_TYPE_COMPLETE', payload: true });
    }, 1200);
  }, [dispatch]);

  // Group messages by exchange
  const { messages } = state;
  const messagesByExchange = useMemo(() => {
    const grouped: Record<number, typeof messages> = {};
    for (const msg of messages) {
      if (!grouped[msg.exchange]) grouped[msg.exchange] = [];
      grouped[msg.exchange].push(msg);
    }
    return grouped;
  }, [messages]);

  // Determine which exchanges have been reached
  const visibleExchanges = useMemo(() => {
    return exchanges.filter((e) => e.id <= state.currentExchange);
  }, [state.currentExchange]);

  // Auto-scroll when live chat messages change or typing state changes
  useEffect(() => {
    if (state.currentExchange === 9 && (state.liveChatMessages.length > 0 || state.isAtlantaTyping)) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [state.liveChatMessages.length, state.isAtlantaTyping, state.currentExchange]);

  return (
    <div
      ref={chatThreadRef}
      className="flex flex-col gap-5 px-4 py-6 scrollbar-hide sm:gap-6 sm:px-6 sm:py-7 md:px-8 md:py-8"
    >
      {/* Rendered exchanges */}
      {visibleExchanges.map((exchange) => {
        const exchangeMessages = messagesByExchange[exchange.id] || [];
        const isCurrentExchange = exchange.id === state.currentExchange;
        const showSuggestion =
          isCurrentExchange &&
          exchange.suggestion &&
          exchangeMessages.some((m) => m.type === 'atlanta') &&
          !state.isAtlantaTyping &&
          !state.suggestionAutoType &&
          (exchange.id !== 0 || state.autoTypeComplete);

        // Don't show exchange-loop typing indicator for exchange 8 when live messages exist
        const showExchangeTyping =
          state.isAtlantaTyping &&
          isCurrentExchange &&
          !(exchange.id === 9 && state.liveChatMessages.length > 0);

        const InlineVis = inlineVisualComponents[exchange.id];
        // Only animate inline visuals near the current scroll position
        const isNearVisual = Math.abs(exchange.id - state.visualExchange) <= 1;

        return (
          <div key={exchange.id} id={`exchange-${exchange.id}`} className="flex flex-col gap-4">
            {/* Section divider for exchanges after the first */}
            {exchange.id > 0 && (
              <SectionLabel text={exchange.title.toUpperCase()} />
            )}

            {/* Inline visual for mobile/tablet (hidden on desktop) */}
            {InlineVis && isNearVisual && (
              <InlineVisual meta={exchange.visualMeta}>
                <InlineVis />
              </InlineVisual>
            )}

            {/* Messages */}
            {exchangeMessages.map((msg) => {
                const isGreeting = exchange.id === 0 && msg.type === 'atlanta' && !state.autoTypeComplete;
                return (
                  <ChatMessage
                    key={msg.id}
                    type={msg.type}
                    text={msg.text}
                    skipEntrance={msg.type === 'visitor'}
                    autoType={isGreeting}
                    onAutoTypeComplete={isGreeting ? handleGreetingTyped : undefined}
                  >
                    {msg.type === 'atlanta' && msg.component && (
                      <ExchangeContent component={msg.component} />
                    )}
                  </ChatMessage>
                );
              })}

            {/* Typing indicator */}
            <AnimatePresence>
              {showExchangeTyping && (
                <TypingIndicator />
              )}
            </AnimatePresence>

            {/* Suggestion button */}
            <AnimatePresence>
              {showSuggestion && (
                <SuggestionButton
                  key={`suggestion-${exchange.id}`}
                  text={exchange.suggestion!}
                  highlight={exchange.id === 0}
                  onClick={() =>
                    handleSuggestionClick(exchange.suggestion!, exchange.id)
                  }
                />
              )}
            </AnimatePresence>

            {/* Suggestion auto-type animation */}
            <AnimatePresence>
              {state.suggestionAutoType?.exchangeId === exchange.id && (
                <SuggestionAutoType
                  key={`auto-type-${exchange.id}`}
                  text={state.suggestionAutoType.text}
                  onComplete={handleSuggestionAutoTypeComplete}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Live chat messages for Exchange 9 */}
      {state.currentExchange === 9 && state.liveChatMessages.length > 0 && (
        <div className="flex flex-col gap-4">
          {state.liveChatMessages.map((msg) => (
            <ChatMessage key={msg.id} type={msg.type} text={msg.text} />
          ))}

          {/* Live chat typing indicator */}
          <AnimatePresence>
            {state.isAtlantaTyping && (
              <TypingIndicator />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Persistent input for Exchange 9 live chat */}
      {state.currentExchange === 9 && (
        <LiveChatInput />
      )}

      {/* Scroll anchor for auto-scroll */}
      <div ref={scrollAnchorRef} />
    </div>
  );
}
