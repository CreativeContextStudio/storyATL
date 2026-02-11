'use client';

import { useStory } from '@/context/StoryContext';
import { exchanges } from '@/data/exchanges';
import { cn } from '@/lib/cn';

export default function Timeline() {
  const { state, jumpTo, goBack, goForward } = useStory();
  const { currentExchange, visualExchange } = state;

  const canGoBack = currentExchange > 0;
  const canGoForward = currentExchange < exchanges.length - 1;

  return (
    <div className="px-4 pt-7 pb-2 sm:px-6 sm:pt-8 sm:pb-2 md:px-8 md:pt-8 md:pb-3">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dots + Line */}
        <div className="relative flex w-full items-center justify-between">
          {/* Line behind dots */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2">
            <div className="h-full w-full bg-[var(--color-timeline-line)]" />
            <div
              className="absolute left-0 top-0 h-full bg-[var(--color-timeline-line-active)]
                         transition-all duration-[var(--duration-slow)] ease-atl"
              style={{
                width: `${(currentExchange / (exchanges.length - 1)) * 100}%`,
              }}
            />
          </div>
          {exchanges.map((exchange) => {
            const isActive = exchange.id === visualExchange;

            return (
              <button
                key={exchange.id}
                onClick={() => jumpTo(exchange.id)}
                className={cn(
                  'group relative flex flex-col items-center',
                  isActive ? 'cursor-default' : 'cursor-pointer',
                )}
                aria-label={`Go to ${exchange.title}`}
              >
                <div
                  className={cn(
                    'rounded-full transition-all duration-[var(--duration-base)] ease-atl',
                    isActive
                      ? 'h-3 w-3 sm:h-4 sm:w-4 bg-[var(--color-timeline-active)] shadow-glow'
                      : 'h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[var(--color-timeline-visited)]',
                  )}
                />
                {/* Label on hover or when active — above the dot */}
                <span
                  className={cn(
                    'absolute -top-5 whitespace-nowrap text-[10px] font-medium tracking-wide',
                    'transition-opacity duration-[var(--duration-fast)]',
                    'hidden sm:block',
                    isActive
                      ? 'text-[var(--color-timeline-active)] opacity-100'
                      : 'text-text-secondary opacity-0 group-hover:opacity-100',
                  )}
                >
                  {exchange.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inline exchange counter */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="flex h-5 w-5 items-center justify-center rounded-full
                       text-text-secondary transition-colors duration-[var(--duration-fast)] ease-atl
                       hover:text-[var(--color-timeline-active)] hover:bg-surface-alt
                       disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent
                       disabled:hover:text-text-secondary"
            aria-label="Previous exchange"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="min-w-[1.75rem] text-center text-[11px] font-semibold tabular-nums leading-none text-[var(--color-timeline-active)]">
            {currentExchange + 1}/{exchanges.length}
          </span>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="flex h-5 w-5 items-center justify-center rounded-full
                       text-text-secondary transition-colors duration-[var(--duration-fast)] ease-atl
                       hover:text-[var(--color-timeline-active)] hover:bg-surface-alt
                       disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent
                       disabled:hover:text-text-secondary"
            aria-label="Next exchange"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
