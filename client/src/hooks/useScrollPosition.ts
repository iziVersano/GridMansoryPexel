import { useEffect, useRef } from 'react';

interface UseScrollPositionParams {
  onScroll: (scrollTop: number) => void;
  initialScrollTop?: number;
}

export function useScrollPosition({ onScroll, initialScrollTop = 0 }: UseScrollPositionParams) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Restore initial scroll position
    if (initialScrollTop > 0) {
      container.scrollTop = initialScrollTop;
    }

    const handleScroll = () => {
      onScroll(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll, initialScrollTop]);

  return containerRef;
}
