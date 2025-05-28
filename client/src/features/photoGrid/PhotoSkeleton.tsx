import React from 'react';
import styled from 'styled-components';
import { PhotoPosition } from '../../types/photo';

const SkeletonCard = styled.div<{ $left: number; $top: number; $width: number; $height: number }>`
  position: absolute;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonMetadata = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  border-radius: 0 0 12px 12px;
`;

const SkeletonTitle = styled.div`
  width: 70%;
  height: 14px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 6px;
`;

const SkeletonPhotographer = styled.div`
  width: 50%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
`;

interface PhotoSkeletonProps {
  position: PhotoPosition;
}

const PhotoSkeleton: React.FC<PhotoSkeletonProps> = ({ position }) => {
  return (
    <SkeletonCard
      $left={position.x}
      $top={position.y}
      $width={position.width}
      $height={position.height}
    >
      <SkeletonMetadata>
        <SkeletonTitle />
        <SkeletonPhotographer />
      </SkeletonMetadata>
    </SkeletonCard>
  );
};

export default PhotoSkeleton;