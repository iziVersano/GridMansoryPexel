// Generic utility types for the photo gallery application

/**
 * Represents a loadable resource with loading, error, and success states
 */
export type Loadable<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
};

/**
 * API response wrapper for consistent response handling
 */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

/**
 * Paginated response type for infinite scroll functionality
 */
export type PaginatedResponse<T> = {
  items: T[];
  hasMore: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
};

/**
 * Search result wrapper with metadata
 */
export type SearchResult<T> = {
  results: T[];
  query: string;
  totalResults: number;
  isSearching: boolean;
};

/**
 * Generic async state for any operation
 */
export type AsyncState<T = any, E = string> = {
  data: T | null;
  loading: boolean;
  error: E | null;
  success: boolean;
};

/**
 * Position type for virtualized components
 */
export type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Generic item with position for virtualized rendering
 */
export type PositionedItem<T> = T & {
  id: string;
  position: Position;
};

/**
 * Utility type for creating optional properties
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type for making specific properties required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Event handler type for common UI interactions
 */
export type EventHandler<T = void> = (event?: Event) => T;

/**
 * Callback function type with optional parameters
 */
export type Callback<T = void, P = any> = (params?: P) => T;