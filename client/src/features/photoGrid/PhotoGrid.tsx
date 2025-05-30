import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Photo, PhotoPosition } from '../../types/photo';
import { useMasonryLayout } from '../../hooks/useMasonryLayout';
import { useVirtualization } from '../../hooks/useVirtualization';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { throttle } from '../../lib/utils';
import PhotoCard from './PhotoCard';
import PhotoSkeleton from './PhotoSkeleton';

const GridContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
`;

const GridWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const GridInner = styled.div<{ height: number }>`
  position: relative;
  width: 100%;
  height: ${props => props.height}px;
`;

const GridLoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: 16px;
  color: #666;
  flex-direction: column;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;



const GridContent = styled.div<{ $isLoading: boolean }>`
  transition: opacity 0.5s ease;
  opacity: ${props => props.$isLoading ? 0.8 : 1};
`;

const PhotosContainer = styled.div<{ $fadeIn: boolean }>`
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.$fadeIn ? 1 : 0};
`;

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  z-index: 10;
`;

const EndMessage = styled(StatusIndicator)`
  background: rgba(0, 0, 0, 0.5);
`;

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  initialScrollTop?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const PhotoGrid = React.memo<PhotoGridProps>(({ 
  photos, 
  onPhotoClick, 
  initialScrollTop = 0, 
  onLoadMore, 
  hasMore = false, 
  isLoading = false 
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scrollTop, setScrollTop] = useState(initialScrollTop);

  const columnWidth = useMemo(() => {
    const { width } = containerSize;
    if (width > 1200) return 300;
    if (width > 768) return 250;
    if (width > 480) return 200;
    return Math.max(150, width - 40);
  }, [containerSize.width]);

  const gap = 20;

  const skeletonsForInfiniteScroll = useMemo(() => {
    if (!isLoading || photos.length === 0) return [];
    
    return Array.from({ length: 6 }, (_, i) => ({
      id: `skeleton-infinite-${i}`,
      title: '',
      photographer: '',
      date: '',
      url: '',
      width: columnWidth,
      height: 200 + (i % 3) * 80,
    }));
  }, [isLoading, photos.length, columnWidth]);

  const combinedPhotos = useMemo(() => {
    return [...photos, ...skeletonsForInfiniteScroll];
  }, [photos, skeletonsForInfiniteScroll]);

  const { positions: allPositions } = useMasonryLayout({
    photos: combinedPhotos,
    containerWidth: containerSize.width,
    columnWidth,
    gap,
  });

  const photoPositions = useMemo(() => {
    return allPositions.slice(0, photos.length);
  }, [allPositions, photos.length]);

  const { visibleItems, totalHeight } = useVirtualization({
    positions: photoPositions,
    config: {
      containerHeight: containerSize.height,
      scrollTop,
      overscan: 200,
    },
  });

  const infiniteScrollSkeletons = useMemo(() => {
    if (skeletonsForInfiniteScroll.length === 0) return [];
    return allPositions.slice(-skeletonsForInfiniteScroll.length);
  }, [allPositions, skeletonsForInfiniteScroll.length]);

  const handleScroll = useCallback(
    throttle((newScrollTop: number) => {
      setScrollTop(newScrollTop);
    }, 16),
    []
  );

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handleInfiniteScroll = useCallback(() => {
    const container = mainContainerRef.current;
    if (!container || isLoading || !hasMore || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    if (scrollBottom <= 300) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, hasMore]);

  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setContainerSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    if (initialScrollTop > 0) {
      container.scrollTop = initialScrollTop;
    }

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    const combinedScrollHandler = (e: Event) => {
      const target = e.target as HTMLDivElement;
      handleScroll(target.scrollTop);
      handleInfiniteScroll();
    };

    container.addEventListener('scroll', combinedScrollHandler, { passive: true });

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', combinedScrollHandler);
    };
  }, [handleInfiniteScroll, handleScroll, initialScrollTop]);

  const renderedPhotos = useMemo(() => {
    return visibleItems.map((position) => {
      const photo = photos.find((p) => p.id === position.id);
      if (!photo) return null;

      return (
        <PhotoCard
          key={photo.id}
          photo={photo}
          position={position}
          onClick={() => onPhotoClick(photo)}
        />
      );
    }).filter(Boolean);
  }, [visibleItems, photos, onPhotoClick]);

  const initialSkeletonItems = useMemo(() => {
    if (photos.length > 0) return [];
    
    const estimatedWidth = containerSize.width || 1200;
    const estimatedColumnWidth = columnWidth || 280;
    
    const skeletonPlaceholders = Array.from({ length: 12 }, (_, i) => ({
      id: `skeleton-initial-${i}`,
      title: '',
      photographer: '',
      date: '',
      url: '',
      width: estimatedColumnWidth,
      height: 200 + (i % 4) * 100,
    }));

    const columnCount = Math.floor(estimatedWidth / (estimatedColumnWidth + gap));
    const columns = Array(columnCount).fill(0);
    const positions: PhotoPosition[] = [];
    
    skeletonPlaceholders.forEach((photo) => {
      const shortestColumnIndex = columns.indexOf(Math.min(...columns));
      const x = shortestColumnIndex * (estimatedColumnWidth + gap);
      const y = columns[shortestColumnIndex];
      const aspectRatio = photo.height / photo.width;
      const scaledHeight = estimatedColumnWidth * aspectRatio;
      
      positions.push({
        id: photo.id,
        x,
        y,
        width: estimatedColumnWidth,
        height: scaledHeight
      });
      
      columns[shortestColumnIndex] += scaledHeight + gap;
    });

    return positions;
  }, [containerSize.width, photos.length, columnWidth, gap]);

  const shouldShowInitialSkeleton = photos.length === 0 && isLoading && initialSkeletonItems.length > 0;
  const shouldShowSpinner = !containerSize.width && photos.length === 0;
  
  const totalHeightWithSkeletons = infiniteScrollSkeletons.length > 0
    ? Math.max(totalHeight, infiniteScrollSkeletons[infiniteScrollSkeletons.length - 1]?.y + infiniteScrollSkeletons[infiniteScrollSkeletons.length - 1]?.height + gap)
    : totalHeight;

  // Single return point to avoid hooks order issues
  return (
    <GridContainer ref={mainContainerRef} data-testid="photo-grid">
      <GridWrapper>
        {shouldShowInitialSkeleton ? (
          <GridInner height={initialSkeletonItems[initialSkeletonItems.length - 1]?.y + initialSkeletonItems[initialSkeletonItems.length - 1]?.height + gap || 800}>
            {initialSkeletonItems.map((position) => (
              <PhotoSkeleton
                key={position.id}
                position={position}
              />
            ))}
          </GridInner>
        ) : shouldShowSpinner ? (
          <GridLoadingIndicator>
            <LoadingSpinner />
            <div>Preparing photo grid...</div>
          </GridLoadingIndicator>
        ) : (
          <GridContent $isLoading={isLoading && photos.length === 0}>
            <PhotosContainer $fadeIn={photos.length > 0}>
              <GridInner height={totalHeightWithSkeletons}>
                {renderedPhotos}
                {infiniteScrollSkeletons.map((position) => (
                  <PhotoSkeleton
                    key={position.id}
                    position={position}
                  />
                ))}
                {!hasMore && photos.length > 0 && (
                  <EndMessage>
                    All photos loaded
                  </EndMessage>
                )}
              </GridInner>
            </PhotosContainer>
          </GridContent>
        )}
      </GridWrapper>
    </GridContainer>
  );
});

PhotoGrid.displayName = 'PhotoGrid';

export default PhotoGrid;
