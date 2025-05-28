import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Photo, PhotoPosition } from '../../types/photo';

const CardContainer = styled.div<{ $left: number; $top: number; $width: number }>`
  position: absolute;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  width: ${props => props.$width}px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PhotoImage = styled.img<{ $height: number; $isLoading: boolean }>`
  width: 100%;
  height: ${props => props.$height}px;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isLoading ? 0.5 : 1};
  display: block;
`;

const ErrorPlaceholder = styled.div<{ $height: number }>`
  width: 100%;
  height: ${props => props.$height}px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
`;

const PhotoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem 0.75rem 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;

  ${CardContainer}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.5rem;
  }
`;

const OverlayTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const OverlayPhotographer = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

interface PhotoCardProps {
  photo: Photo;
  position: PhotoPosition;
  onClick: () => void;
}

const PhotoCard = React.memo<PhotoCardProps>(({ photo, position, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  }, [onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  const imageHeight = position.height; // Use full height without metadata section

  return (
    <CardContainer
      $left={position.x}
      $top={position.y}
      $width={position.width}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View photo: ${photo.title}`}
    >
      <ImageContainer>
        {!imageError ? (
          <PhotoImage
            src={photo.url}
            alt={photo.title}
            width={position.width}
            height={imageHeight}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            $height={imageHeight}
            $isLoading={!imageLoaded}
          />
        ) : (
          <ErrorPlaceholder $height={imageHeight}>
            Image unavailable
          </ErrorPlaceholder>
        )}
        
        <PhotoOverlay>
          <OverlayTitle>{photo.title}</OverlayTitle>
          <OverlayPhotographer>by {photo.photographer}</OverlayPhotographer>
        </PhotoOverlay>
      </ImageContainer>
    </CardContainer>
  );
});

PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;
