import { useCallback, useRef } from 'react';
import { throttle } from '../lib/utils';

interface UseInfiniteScrollParams {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
}: UseInfiniteScrollParams) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    throttle(() => {
      const container = containerRef.current;
      if (!container || isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      if (scrollBottom <= threshold) {
        onLoadMore();
      }
    }, 100),
    [onLoadMore, isLoading, hasMore, threshold]
  );

  return {
    containerRef,
    handleScroll,
  };
}