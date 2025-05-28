import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { usePhotos } from '../../contexts/PhotoContext';
import { Photo } from '../../types/photo';
import { Optional } from '../../types/common';
import { useImagePreloader } from '../../hooks/useImagePreloader';
import PhotoGrid from './PhotoGrid';
import SearchBar from '../search/SearchBar';

// Layout Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  flex-shrink: 0;
`;

const Main = styled.main`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  color: #666;
  text-align: center;
  padding: 20px;
`;

export default function PhotoGridPage() {
  const navigate = useNavigate();
  const { 
    photos, 
    searchState, 
    infiniteScrollState, 
    scrollPosition, 
    setScrollPosition, 
    loadMorePhotos 
  } = usePhotos();

  const displayPhotos = photos;

  // Preload critical images for better performance
  useImagePreloader(displayPhotos, 6);

  const handlePhotoClick = useCallback((photo: Photo) => {
    // Save current scroll position before navigating
    const container = document.querySelector('.photo-grid-container');
    if (container) {
      setScrollPosition(container.scrollTop);
    }
    navigate(`/photo/${photo.id}`);
  }, [navigate, setScrollPosition]);

  return (
    <Wrapper>
      <TopBar>
        <SearchBar />
      </TopBar>
      <Main>
        {displayPhotos.length === 0 && searchState.query && !searchState.isSearching ? (
          <ErrorMessage>
            No photos found for "{searchState.query}". Try a different search term.
          </ErrorMessage>
        ) : (
          <PhotoGrid
            photos={displayPhotos}
            onPhotoClick={handlePhotoClick}
            initialScrollTop={scrollPosition}
            onLoadMore={searchState.query ? undefined : loadMorePhotos}
            hasMore={searchState.query ? false : infiniteScrollState.hasMore}
            isLoading={searchState.isSearching || infiniteScrollState.isLoading}
          />
        )}
      </Main>
    </Wrapper>
  );
}
