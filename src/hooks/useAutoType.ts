'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoTypeOptions {
  text: string;
  delay?: number;
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

export function useAutoType({
  text,
  delay = 3000,
  speed = 50,
  enabled = true,
  onComplete,
}: UseAutoTypeOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const hasStartedRef = useRef(false);

  const startTyping = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setIsTyping(true);
    indexRef.current = 0;
  }, []);

  useEffect(() => {
    if (!enabled || hasStartedRef.current) return;

    const timer = setTimeout(() => {
      startTyping();
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, delay, startTyping]);

  useEffect(() => {
    if (!isTyping || isComplete) return;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        setDisplayText(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isTyping, isComplete, text, speed, onComplete]);

  return { displayText, isTyping, isComplete };
}
