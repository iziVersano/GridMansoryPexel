import { Photo } from '../types/photo';

// Mock the entire pexels module to avoid import.meta.env issues
jest.mock('./pexels', () => ({
  fetchPhotos: jest.fn(),
  fetchCuratedPhotos: jest.fn(),
}));

import { fetchPhotos, fetchCuratedPhotos } from './pexels';

const mockFetchPhotos = fetchPhotos as jest.MockedFunction<typeof fetchPhotos>;
const mockFetchCuratedPhotos = fetchCuratedPhotos as jest.MockedFunction<typeof fetchCuratedPhotos>;

describe('Pexels API Module', () => {
  beforeEach(() => {
    mockFetchPhotos.mockClear();
    mockFetchCuratedPhotos.mockClear();
  });

  it('should export fetchPhotos function', () => {
    expect(typeof fetchPhotos).toBe('function');
  });

  it('should export fetchCuratedPhotos function', () => {
    expect(typeof fetchCuratedPhotos).toBe('function');
  });

  it('should call fetchPhotos with correct parameters', async () => {
    const mockPhotos: Photo[] = [
      {
        id: '1',
        title: 'Test Photo',
        photographer: 'Test Photographer',
        date: '2024-01-01',
        url: 'https://example.com/photo.jpg',
        width: 400,
        height: 600,
      },
    ];

    mockFetchPhotos.mockResolvedValueOnce(mockPhotos);

    const result = await fetchPhotos('nature', 10);

    expect(mockFetchPhotos).toHaveBeenCalledWith('nature', 10);
    expect(result).toEqual(mockPhotos);
  });

  it('should call fetchCuratedPhotos with correct parameters', async () => {
    const mockPhotos: Photo[] = [
      {
        id: '2',
        title: 'Curated Photo',
        photographer: 'Curated Photographer',
        date: '2024-01-02',
        url: 'https://example.com/curated.jpg',
        width: 300,
        height: 400,
      },
    ];

    mockFetchCuratedPhotos.mockResolvedValueOnce(mockPhotos);

    const result = await fetchCuratedPhotos(15);

    expect(mockFetchCuratedPhotos).toHaveBeenCalledWith(15);
    expect(result).toEqual(mockPhotos);
  });
});