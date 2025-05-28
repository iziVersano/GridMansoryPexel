import React, { useState } from 'react';
import styled from 'styled-components';
import { Photo } from '../../types/photo';
import { RequiredFields } from '../../types/common';
import { formatDate } from '../../lib/utils';

const DetailContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const DetailHeader = styled.div`
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const DetailContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  gap: 40px;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 60px;
    padding: 60px 20px;
  }
`;

const PhotoContainer = styled.div`
  max-height: 80vh;
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  
  @media (min-width: 1024px) {
    flex: 1;
    max-width: 600px;
  }
`;

const DetailImage = styled.img<{ $loaded: boolean }>`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$loaded ? 1 : 0.7};
  transition: opacity 0.3s ease;
`;

const MetadataCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;

  @media (min-width: 1024px) {
    flex-shrink: 0;
    width: 350px;
  }
`;

const PhotoTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 24px 0;
  line-height: 1.4;
`;

const MetadataGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const MetadataRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f4;

  &:last-child {
    border-bottom: none;
  }
`;

const MetadataLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetadataValue = styled.span`
  font-size: 16px;
  color: #212529;
  word-break: break-word;
`;

const ErrorMessage = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  color: #dc3545;
  font-size: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

interface PhotoDetailProps {
  photo: Photo;
  onBack: () => void;
}

// Use RequiredFields utility type to ensure photo has dimensions
type PhotoWithDimensions = RequiredFields<Photo, 'width' | 'height'>;

export default function PhotoDetail({ photo, onBack }: PhotoDetailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <DetailContainer>
      <DetailHeader>
        <BackButton
          onClick={onBack}
          aria-label="Go back to photo grid"
        >
          ← Back to Gallery
        </BackButton>
      </DetailHeader>
      
      <DetailContent>
        {!imageError ? (
          <PhotoContainer>
            <DetailImage
              src={photo.url}
              alt={photo.title}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              $loaded={imageLoaded}
            />
          </PhotoContainer>
        ) : (
          <ErrorMessage>
            Failed to load image. Please try again later.
          </ErrorMessage>
        )}
        
        <MetadataCard>
          <PhotoTitle>{photo.title}</PhotoTitle>
          <MetadataGrid>
            <MetadataRow>
              <MetadataLabel>Photo by</MetadataLabel>
              <MetadataValue>{photo.photographer}</MetadataValue>
            </MetadataRow>
            <MetadataRow>
              <MetadataLabel>Date</MetadataLabel>
              <MetadataValue>{formatDate(photo.date)}</MetadataValue>
            </MetadataRow>
            <MetadataRow>
              <MetadataLabel>Dimensions</MetadataLabel>
              <MetadataValue>{photo.width} × {photo.height}</MetadataValue>
            </MetadataRow>
            <MetadataRow>
              <MetadataLabel>Photo ID</MetadataLabel>
              <MetadataValue>{photo.id}</MetadataValue>
            </MetadataRow>
          </MetadataGrid>
        </MetadataCard>
      </DetailContent>
    </DetailContainer>
  );
}
