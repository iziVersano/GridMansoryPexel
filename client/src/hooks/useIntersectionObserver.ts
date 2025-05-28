import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}


export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { threshold = 0.1, rootMargin = '50px', triggerOnce = false } = options;

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    cleanup();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
          
          // If triggerOnce is true, disconnect after first intersection
          if (triggerOnce) {
            cleanup();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(element);

    return cleanup;
  }, [threshold, rootMargin, triggerOnce, hasIntersected, cleanup]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  };
}

/**
 * Hook for detecting when user is near the bottom of scrollable content
 * Optimized for infinite scroll performance
 */
export function useInfiniteScrollTrigger(
  onLoadMore: () => void,
  hasMore: boolean,
  isLoading: boolean,
  threshold: number = 0.8
) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin: '100px',
      }
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoading, threshold]);

  return triggerRef;
}