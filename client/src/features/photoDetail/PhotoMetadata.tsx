import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLoadable, useAsyncOperation } from '../../hooks/useLoadable';
import { Loadable, Optional, RequiredFields } from '../../types/common';
import { Photo } from '../../types/photo';

type PartialPhotoMetadata = Optional<PhotoMetadata, 'fileSize' | 'camera'>;

// Use RequiredFields utility type to ensure photo has dimensions
type PhotoWithRequiredDimensions = RequiredFields<Photo, 'width' | 'height'>;

interface PhotoMetadata {
  id: string;
  fileSize: string;
  dimensions: string;
  camera: string;
  location: string;
  exifData: Record<string, any>;
}

const MetadataContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  backdrop-filter: blur(10px);
`;

const MetadataTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const MetadataItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const MetadataLabel = styled.span`
  font-weight: 500;
  color: #666;
`;

const MetadataValue = styled.span`
  color: #333;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 20px;
  text-align: center;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
`;

interface PhotoMetadataProps {
  photo: PhotoWithRequiredDimensions;
}

/**
 * Component demonstrating the use of generic utility types:
 * - Loadable<T> for managing loading states
 * - AsyncState<T> for async operations
 * - Optional<T, K> and RequiredFields<T, K> for type manipulation
 */
export default function PhotoMetadata({ photo }: PhotoMetadataProps) {
  // Using the Loadable generic type for metadata state
  const { state: metadataState, setLoading, setSuccess, setError } = useLoadable<PhotoMetadata>();
  
  // Using AsyncState for handling async operations
  const { state: asyncState, execute } = useAsyncOperation<PartialPhotoMetadata>();

  // Simulate fetching photo metadata
  const fetchMetadata = async (): Promise<PhotoMetadata> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock metadata - in a real app, this would come from an API
    const metadata: PhotoMetadata = {
      id: photo.id,
      fileSize: '2.3 MB',
      dimensions: `${photo.width} × ${photo.height}`,
      camera: 'Canon EOS R5',
      location: 'San Francisco, CA',
      exifData: {
        aperture: 'f/2.8',
        shutterSpeed: '1/200s',
        iso: 400,
        focalLength: '85mm'
      }
    };

    return metadata;
  };

  useEffect(() => {
    const loadMetadata = async () => {
      setLoading();
      try {
        const metadata = await fetchMetadata();
        setSuccess(metadata);
        
        // Also demonstrate async operation with partial data
        await execute(async () => {
          const partialData: PartialPhotoMetadata = {
            id: metadata.id,
            dimensions: metadata.dimensions,
            location: metadata.location,
            exifData: metadata.exifData
          };
          return partialData;
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load metadata');
      }
    };

    loadMetadata();
  }, [photo.id, setLoading, setSuccess, setError, execute]);

  const renderLoadableContent = (loadable: Loadable<PhotoMetadata>) => {
    if (loadable.isLoading) {
      return <LoadingSpinner>Loading metadata...</LoadingSpinner>;
    }

    if (loadable.error) {
      return <ErrorMessage>{loadable.error}</ErrorMessage>;
    }

    if (!loadable.data) {
      return <LoadingSpinner>No metadata available</LoadingSpinner>;
    }

    const { data } = loadable;
    return (
      <>
        <MetadataItem>
          <MetadataLabel>File Size:</MetadataLabel>
          <MetadataValue>{data.fileSize}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Dimensions:</MetadataLabel>
          <MetadataValue>{data.dimensions}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Camera:</MetadataLabel>
          <MetadataValue>{data.camera}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Location:</MetadataLabel>
          <MetadataValue>{data.location}</MetadataValue>
        </MetadataItem>
        {Object.entries(data.exifData).map(([key, value]) => (
          <MetadataItem key={key}>
            <MetadataLabel>{key.charAt(0).toUpperCase() + key.slice(1)}:</MetadataLabel>
            <MetadataValue>{value}</MetadataValue>
          </MetadataItem>
        ))}
      </>
    );
  };

  return (
    <MetadataContainer>
      <MetadataTitle>Photo Details</MetadataTitle>
      {renderLoadableContent(metadataState)}
      
      {/* Show async operation status for demonstration */}
      {asyncState.loading && (
        <LoadingSpinner>Processing additional data...</LoadingSpinner>
      )}
      
      {asyncState.success && asyncState.data && (
        <MetadataItem>
          <MetadataLabel>Processing Status:</MetadataLabel>
          <MetadataValue>✅ Enhanced metadata loaded</MetadataValue>
        </MetadataItem>
      )}
    </MetadataContainer>
  );
}