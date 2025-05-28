import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { usePhotos } from '../../contexts/PhotoContext';
import { debounce } from '../../lib/utils';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchBarWrapper = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #999;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

const SearchResults = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`;

export default function SearchBar() {
  const { searchState, searchPhotos, clearSearch } = usePhotos();
  const [inputValue, setInputValue] = useState(searchState.query);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        searchPhotos(query);
      } else {
        clearSearch();
      }
    }, 300),
    [searchPhotos, clearSearch]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setInputValue('');
    clearSearch();
  }, [clearSearch]);

  return (
    <SearchContainer>
      <SearchBarWrapper>
        <SearchInput
          type="text"
          placeholder="Search photos by title or photographer..."
          value={inputValue}
          onChange={handleInputChange}
          aria-label="Search photos"
        />
        {inputValue && (
          <ClearButton
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </ClearButton>
        )}
      </SearchBarWrapper>
      {searchState.isSearching && (
        <SearchResults>
          Found {searchState.results.length} photo{searchState.results.length !== 1 ? 's' : ''} for "{searchState.query}"
        </SearchResults>
      )}
    </SearchContainer>
  );
}
