import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type StoryATLWordmarkProps = {
  className?: string;
  storyClassName?: string;
  atlClassName?: string;
};

export function StoryATLWordmark({ className, storyClassName, atlClassName }: StoryATLWordmarkProps) {
  return (
    <span className={cn('whitespace-nowrap', className)}>
      <span className={storyClassName}>story</span>
      <span className={cn('text-accent', atlClassName)}>ATL</span>
    </span>
  );
}

/**
 * Replaces every literal "storyATL" occurrence with the styled wordmark.
 * Useful anywhere we only have a string (chat bubbles, scripted copy, etc.).
 */
export function renderStoryATLWordmarkInText(
  text: string,
  wordmarkProps?: StoryATLWordmarkProps,
): ReactNode {
  const parts = text.split('storyATL');
  if (parts.length === 1) return text;

  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? <StoryATLWordmark {...wordmarkProps} /> : null}
    </Fragment>
  ));
}

