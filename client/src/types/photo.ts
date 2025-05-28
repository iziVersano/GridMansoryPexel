export interface Photo {
  id: string;
  title: string;
  photographer: string;
  date: string;
  url: string;
  width: number;
  height: number;
}

export interface PhotoPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VirtualizationConfig {
  containerHeight: number;
  scrollTop: number;
  overscan: number;
}

export interface SearchState {
  query: string;
  results: Photo[];
  isSearching: boolean;
}

export interface InfiniteScrollState {
  hasMore: boolean;
  isLoading: boolean;
  page: number;
  totalPhotos: number;
}
