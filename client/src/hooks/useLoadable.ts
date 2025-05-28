import { useState, useCallback } from 'react';
import { Loadable, AsyncState, ApiResponse } from '../types/common';


export function useLoadable<T>(initialData: T | null = null): {
  state: Loadable<T>;
  setLoading: () => void;
  setSuccess: (data: T) => void;
  setError: (error: string) => void;
  reset: () => void;
} {
  const [state, setState] = useState<Loadable<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    hasLoaded: initialData !== null,
  });

  const setLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
  }, []);

  const setSuccess = useCallback((data: T) => {
    setState({
      data,
      isLoading: false,
      error: null,
      hasLoaded: true,
    });
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      hasLoaded: initialData !== null,
    });
  }, [initialData]);

  return {
    state,
    setLoading,
    setSuccess,
    setError,
    reset,
  };
}


export function useAsyncOperation<T, E = string>(): {
  state: AsyncState<T, E>;
  execute: (operation: () => Promise<T>) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<T, E>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState({
      data: null,
      loading: true,
      error: null,
      success: false,
    });

    try {
      const result = await operation();
      setState({
        data: result,
        loading: false,
        error: null,
        success: true,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as E,
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    state,
    execute,
    reset,
  };
}

/**
 * Custom hook for handling API responses with consistent structure
 */
export function useApiRequest<T>(): {
  state: Loadable<T>;
  request: (url: string, options?: RequestInit) => Promise<void>;
} {
  const { state, setLoading, setSuccess, setError } = useLoadable<T>();

  const request = useCallback(async (url: string, options?: RequestInit) => {
    setLoading();

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<T> = await response.json();
      
      if (apiResponse.success) {
        setSuccess(apiResponse.data);
      } else {
        setError(apiResponse.error || 'API request failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setSuccess, setError]);

  return {
    state,
    request,
  };
}