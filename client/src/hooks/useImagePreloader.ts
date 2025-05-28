import { useEffect } from 'react';
import { Photo } from '../types/photo';

// Preload critical images for better LCP (Largest Contentful Paint)
export function useImagePreloader(photos: Photo[], count: number = 6) {
  useEffect(() => {
    if (photos.length === 0) return;

    const criticalPhotos = photos.slice(0, count);
    
    criticalPhotos.forEach((photo) => {
      const img = new Image();
      img.src = photo.url;
      const highResImg = new Image();
      highResImg.src = photo.url.replace('w=400', 'w=1200');
    });
  }, [photos, count]);
}
export function useIdleImagePreloader(photos: Photo[], currentIndex: number, batchSize: number = 5) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const preloadNextBatch = () => {
        const nextBatch = photos.slice(currentIndex, currentIndex + batchSize);
        nextBatch.forEach((photo) => {
          const img = new Image();
          img.src = photo.url;
        });
      };

      const idleCallback = window.requestIdleCallback(preloadNextBatch, {
        timeout: 2000,
      });

      return () => {
        window.cancelIdleCallback(idleCallback);
      };
    }
  }, [photos, currentIndex, batchSize]);
}