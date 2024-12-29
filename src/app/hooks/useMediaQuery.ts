'use client';
import { useState, useEffect } from 'react';
import { useIsClient } from './useIsClient';

export function useMediaQuery(query: string): boolean {
  const isClient = useIsClient();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!isClient) return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query, isClient]);

  return isClient ? matches : false;
}
