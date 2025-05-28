import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Photo, SearchState, InfiniteScrollState } from '../types/photo';
import { fetchPhotos, fetchCuratedPhotos } from '../lib/pexels';

interface PhotoContextType {
  photos: Photo[];
  searchState: SearchState;
  infiniteScrollState: InfiniteScrollState;
  searchPhotos: (query: string) => void;
  clearSearch: () => void;
  getPhotoById: (id: string) => Photo | undefined;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  loadMorePhotos: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: React.ReactNode }) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isSearching: false,
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]);
  const [infiniteScrollState, setInfiniteScrollState] = useState<InfiniteScrollState>({
    hasMore: true,
    isLoading: true,
    page: 0,
    totalPhotos: 0,
  });

  const PHOTOS_PER_PAGE = 20;

  React.useEffect(() => {
    if (loadedPhotos.length === 0) {
      setInfiniteScrollState(prev => ({ ...prev, isLoading: true }));
      
      // Add delay to showcase skeleton placeholders
      setTimeout(() => {
        fetchCuratedPhotos(PHOTOS_PER_PAGE)
          .then((photos) => {
            setLoadedPhotos(photos);
            setInfiniteScrollState({
              hasMore: true,
              isLoading: false,
              page: 1,
              totalPhotos: photos.length,
            });
          })
          .catch((error) => {
            console.error('Failed to load initial photos:', error);
            setInfiniteScrollState(prev => ({ ...prev, isLoading: false }));
          });
      }, 700);
    }
  }, [loadedPhotos.length]);

  const photos = loadedPhotos;

  const loadMorePhotos = useCallback(() => {
    if (infiniteScrollState.isLoading || !infiniteScrollState.hasMore) {
      return;
    }

    setInfiniteScrollState(prev => ({ ...prev, isLoading: true }));

    const searchTerms = ['landscape', 'nature', 'city', 'architecture', 'people', 'food', 'travel', 'abstract'];
    const randomTerm = searchTerms[infiniteScrollState.page % searchTerms.length];

    fetchPhotos(randomTerm, PHOTOS_PER_PAGE)
      .then((newPhotos) => {
        if (newPhotos.length > 0) {
          setLoadedPhotos(prev => [...prev, ...newPhotos]);
          setInfiniteScrollState(prev => ({
            hasMore: true,
            isLoading: false,
            page: prev.page + 1,
            totalPhotos: prev.totalPhotos + newPhotos.length,
          }));
        } else {
          setInfiniteScrollState(prev => ({
            ...prev,
            hasMore: false,
            isLoading: false,
          }));
        }
      })
      .catch((error) => {
        console.error('Failed to load more photos:', error);
        setInfiniteScrollState(prev => ({
          ...prev,
          hasMore: false,
          isLoading: false,
        }));
      });
  }, [infiniteScrollState]);

  const searchPhotos = useCallback((query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    setSearchState({
      query,
      results: [],
      isSearching: true,
    });

    // Pause infinite scroll during search
    setInfiniteScrollState(prev => ({
      ...prev,
      hasMore: false,
      isLoading: false,
    }));

    fetchPhotos(query, 30)
      .then((results) => {
        setLoadedPhotos(results);
        setSearchState({
          query,
          results,
          isSearching: false,
        });
        // Reset scroll position for new search results
        setScrollPosition(0);
      })
      .catch((error) => {
        console.error('Search failed:', error);
        setSearchState({
          query,
          results: [],
          isSearching: false,
        });
      });
  }, [setScrollPosition]);

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isSearching: false,
    });

    // Reset scroll position
    setScrollPosition(0);

    // Re-fetch curated photos and reset infinite scroll
    setInfiniteScrollState(prev => ({ ...prev, isLoading: true }));

    fetchCuratedPhotos(PHOTOS_PER_PAGE)
      .then((photos) => {
        setLoadedPhotos(photos);
        setInfiniteScrollState({
          hasMore: true,
          isLoading: false,
          page: 1,
          totalPhotos: photos.length,
        });
      })
      .catch((error) => {
        console.error('Failed to reload curated photos:', error);
        setInfiniteScrollState(prev => ({ ...prev, isLoading: false }));
      });
  }, [setScrollPosition]);

  const getPhotoById = useCallback((id: string) => {
    // Search in loaded photos and search results
    const foundInLoaded = loadedPhotos.find((photo) => photo.id === id);
    if (foundInLoaded) return foundInLoaded;
    
    const foundInSearch = searchState.results.find((photo) => photo.id === id);
    return foundInSearch;
  }, [loadedPhotos, searchState.results]);

  const value = useMemo(
    () => ({
      photos,
      searchState,
      infiniteScrollState,
      searchPhotos,
      clearSearch,
      getPhotoById,
      scrollPosition,
      setScrollPosition,
      loadMorePhotos,
    }),
    [photos, searchState, infiniteScrollState, searchPhotos, clearSearch, getPhotoById, scrollPosition, loadMorePhotos]
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
}

export function usePhotos() {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
}