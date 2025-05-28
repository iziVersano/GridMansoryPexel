import { useMemo } from 'react';
import { PhotoPosition, VirtualizationConfig } from '../types/photo';

interface UseVirtualizationParams {
  positions: PhotoPosition[];
  config: VirtualizationConfig;
}

export function useVirtualization({ positions, config }: UseVirtualizationParams) {
  const { containerHeight, scrollTop, overscan } = config;

  const visibleItems = useMemo(() => {
    if (!positions.length) return [];

    const startY = scrollTop - overscan;
    const endY = scrollTop + containerHeight + overscan;

    return positions.filter((position) => {
      const itemTop = position.y;
      const itemBottom = position.y + position.height;
      
      // Item is visible if it intersects with the visible area
      return itemBottom >= startY && itemTop <= endY;
    });
  }, [positions, scrollTop, containerHeight, overscan]);

  const totalHeight = useMemo(() => {
    if (!positions.length) return 0;
    return Math.max(...positions.map(pos => pos.y + pos.height));
  }, [positions]);

  return {
    visibleItems,
    totalHeight,
  };
}
