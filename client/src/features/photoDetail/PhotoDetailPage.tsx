import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePhotos } from '../../contexts/PhotoContext';
import PhotoDetail from './PhotoDetail';

export default function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPhotoById } = usePhotos();

  const photo = id ? getPhotoById(id) : undefined;

  const handleBack = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  if (!photo) {
    return (
      <div className="error">
        Photo not found. 
        <button 
          onClick={handleBack}
          style={{ 
            marginLeft: '10px', 
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return <PhotoDetail photo={photo} onBack={handleBack} />;
}
