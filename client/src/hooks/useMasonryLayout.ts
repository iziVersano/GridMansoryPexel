import { useMemo, useCallback } from 'react';
import { Photo, PhotoPosition } from '../types/photo';

interface UseMasonryLayoutParams {
  photos: Photo[];
  containerWidth: number;
  columnWidth: number;
  gap: number;
}

export function useMasonryLayout({
  photos,
  containerWidth,
  columnWidth,
  gap,
}: UseMasonryLayoutParams) {
  const columnCount = useMemo(() => {
    return Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)));
  }, [containerWidth, columnWidth, gap]);

  const calculatePositions = useCallback((): PhotoPosition[] => {
    if (!photos.length || columnCount === 0) return [];

    const columns: number[] = Array(columnCount).fill(0);
    const positions: PhotoPosition[] = [];

    photos.forEach((photo) => {
      // Find the shortest column
      const shortestColumnIndex = columns.indexOf(Math.min(...columns));
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = columns[shortestColumnIndex];

      // Calculate scaled height based on aspect ratio
      const aspectRatio = photo.height / photo.width;
      const scaledHeight = columnWidth * aspectRatio;

      positions.push({
        id: photo.id,
        x,
        y,
        width: columnWidth,
        height: scaledHeight,
      });

      // Update column height
      columns[shortestColumnIndex] += scaledHeight + gap;
    });

    return positions;
  }, [photos, columnCount, columnWidth, gap]);

  const positions = useMemo(() => calculatePositions(), [calculatePositions]);

  return {
    positions,
    columnCount,
  };
}
