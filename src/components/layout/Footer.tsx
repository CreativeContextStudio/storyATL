'use client';

import { useStory } from '@/context/StoryContext';
import { StoryATLWordmark } from '@/components/ui/StoryATLWordmark';

export default function Footer() {
  const { state, reset } = useStory();
  const isAtEnd = state.currentExchange === 9;

  if (!isAtEnd) return null;

  return (
    <footer className="border-t border-divider px-4 py-8 text-center sm:px-6 sm:py-10">
      {/* Stats */}
      <div className="mb-6 flex items-center justify-center gap-4 text-xs font-medium tracking-wide text-text-secondary">
        <span>10 exchanges</span>
        <span className="text-divider">|</span>
        <span>5 voices</span>
        <span className="text-divider">|</span>
        <span>25+ neighborhoods</span>
      </div>

      {/* Tagline */}
      <p className="mx-auto mb-6 max-w-sm text-fluid-base leading-relaxed text-text-primary sm:max-w-lg">
        Atlanta has always been a city of stories. <StoryATLWordmark /> just gives them a place to live — on the map,
        on the wall, in the air. Every voice. Every neighborhood. Every night.
      </p>

      <hr className="mx-auto mb-6 w-16 border-divider" />

      {/* Attribution */}
      <p className="mb-8 text-xs text-text-secondary">
        James McKay | Creative Context | Atlanta, GA | 2026 PAFL Application
      </p>

      {/* Actions */}
      <div className="flex items-center justify-center">
        <button
          onClick={reset}
          className="rounded-brand border-2 border-[var(--color-card-border)] px-4 py-2
                     text-sm font-semibold text-text-primary
                     transition-all duration-[var(--duration-fast)] ease-atl
                     hover:border-accent hover:text-accent sm:px-5 sm:py-2.5"
        >
          Start from the beginning
        </button>
      </div>
    </footer>
  );
}
