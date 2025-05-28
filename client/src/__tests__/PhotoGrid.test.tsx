import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PhotoGrid from '../features/photoGrid/PhotoGrid';
import { Photo } from '../types/photo';

// Mock data for testing
const mockPhotos: Photo[] = [
  {
    id: '1',
    title: 'Test Photo 1',
    photographer: 'Test Photographer 1',
    date: '2024-01-01',
    url: 'https://example.com/photo1.jpg',
    width: 400,
    height: 600,
  },
  {
    id: '2',
    title: 'Test Photo 2',
    photographer: 'Test Photographer 2',
    date: '2024-01-02',
    url: 'https://example.com/photo2.jpg',
    width: 400,
    height: 300,
  },
];

// Mock the hooks
jest.mock('../hooks/useMasonryLayout', () => ({
  useMasonryLayout: () => ({
    positions: [
      { id: '1', x: 0, y: 0, width: 300, height: 450 },
      { id: '2', x: 320, y: 0, width: 300, height: 225 },
    ],
    columnCount: 2,
  }),
}));

jest.mock('../hooks/useVirtualization', () => ({
  useVirtualization: () => ({
    visibleItems: [
      { id: '1', x: 0, y: 0, width: 300, height: 450 },
      { id: '2', x: 320, y: 0, width: 300, height: 225 },
    ],
    totalHeight: 450,
  }),
}));

jest.mock('../hooks/useScrollPosition', () => ({
  useScrollPosition: () => ({ current: null }),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

describe('PhotoGrid', () => {
  const mockOnPhotoClick = jest.fn();

  beforeEach(() => {
    mockOnPhotoClick.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <PhotoGrid photos={mockPhotos} onPhotoClick={mockOnPhotoClick} />
      </BrowserRouter>
    );
  });

  it('displays photo cards with correct information', async () => {
    render(
      <BrowserRouter>
        <PhotoGrid photos={mockPhotos} onPhotoClick={mockOnPhotoClick} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
      expect(screen.getByText('by Test Photographer 1')).toBeInTheDocument();
      expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
      expect(screen.getByText('by Test Photographer 2')).toBeInTheDocument();
    });
  });

  it('calls onPhotoClick when a photo card is clicked', async () => {
    render(
      <BrowserRouter>
        <PhotoGrid photos={mockPhotos} onPhotoClick={mockOnPhotoClick} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const photoCard = screen.getByText('Test Photo 1').closest('.photo-card');
      expect(photoCard).toBeInTheDocument();
    });

    const photoCard = screen.getByText('Test Photo 1').closest('.photo-card');
    fireEvent.click(photoCard!);

    expect(mockOnPhotoClick).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it('handles keyboard navigation', async () => {
    render(
      <BrowserRouter>
        <PhotoGrid photos={mockPhotos} onPhotoClick={mockOnPhotoClick} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const photoCard = screen.getByText('Test Photo 1').closest('.photo-card');
      expect(photoCard).toBeInTheDocument();
    });

    const photoCard = screen.getByText('Test Photo 1').closest('.photo-card');
    fireEvent.keyDown(photoCard!, { key: 'Enter' });

    expect(mockOnPhotoClick).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it('displays loading state when container size is not available', () => {
    // Mock getBoundingClientRect to return zero dimensions
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    render(
      <BrowserRouter>
        <PhotoGrid photos={mockPhotos} onPhotoClick={mockOnPhotoClick} />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading photos...')).toBeInTheDocument();
  });

  it('handles empty photos array', () => {
    render(
      <BrowserRouter>
        <PhotoGrid photos={[]} onPhotoClick={mockOnPhotoClick} />
      </BrowserRouter>
    );

    // Should not crash and should render container
    expect(screen.queryByText('Test Photo 1')).not.toBeInTheDocument();
  });
});
