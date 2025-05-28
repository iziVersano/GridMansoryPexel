import { fetchPhotos, fetchCuratedPhotos } from './pexels';
import { Photo } from '@/types/photo';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Pexels API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock environment variable
    process.env.VITE_PEXELS_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockPexelsPhoto = {
    id: 123456,
    width: 800,
    height: 600,
    url: 'https://example.com/photo.jpg',
    photographer: 'John Doe',
    photographer_url: 'https://example.com/photographer',
    photographer_id: 789,
    avg_color: '#4A4A4A',
    src: {
      original: 'https://example.com/original.jpg',
      large2x: 'https://example.com/large2x.jpg',
      large: 'https://example.com/large.jpg',
      medium: 'https://example.com/medium.jpg',
      small: 'https://example.com/small.jpg',
      portrait: 'https://example.com/portrait.jpg',
      landscape: 'https://example.com/landscape.jpg',
      tiny: 'https://example.com/tiny.jpg',
    },
    liked: false,
    alt: 'Beautiful landscape photo',
  };

  const mockPexelsResponse = {
    total_results: 1,
    page: 1,
    per_page: 20,
    photos: [mockPexelsPhoto],
    next_page: undefined,
  };

  const expectedPhoto: Photo = {
    id: '123456',
    title: 'Beautiful landscape photo',
    photographer: 'John Doe',
    date: expect.any(String),
    url: 'https://example.com/large.jpg',
    width: 800,
    height: 600,
  };

  describe('fetchPhotos', () => {
    it('should fetch photos successfully with default parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPexelsResponse,
      } as Response);

      const result = await fetchPhotos();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/search?query=nature&per_page=20',
        {
          headers: {
            Authorization: 'test-api-key',
          },
        }
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(expectedPhoto);
    });

    it('should fetch photos with custom query and perPage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPexelsResponse,
      } as Response);

      await fetchPhotos('landscape', 10);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/search?query=landscape&per_page=10',
        {
          headers: {
            Authorization: 'test-api-key',
          },
        }
      );
    });

    it('should handle empty response', async () => {
      const emptyResponse = {
        ...mockPexelsResponse,
        photos: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response);

      const result = await fetchPhotos();

      expect(result).toEqual([]);
    });

    it('should handle missing alt text', async () => {
      const photoWithoutAlt = {
        ...mockPexelsPhoto,
        alt: '',
      };

      const responseWithoutAlt = {
        ...mockPexelsResponse,
        photos: [photoWithoutAlt],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithoutAlt,
      } as Response);

      const result = await fetchPhotos();

      expect(result[0].title).toBe('Photo by John Doe');
    });

    it('should throw error when API key is missing', async () => {
      delete process.env.VITE_PEXELS_API_KEY;

      await expect(fetchPhotos()).rejects.toThrow(
        'Pexels API key is not configured. Please check your environment variables.'
      );
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      } as Response);

      await expect(fetchPhotos()).rejects.toThrow('Pexels API error: 401 Unauthorized');
    });

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchPhotos()).rejects.toThrow('Network error');
    });

    it('should encode query parameters correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPexelsResponse,
      } as Response);

      await fetchPhotos('city & architecture', 15);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/search?query=city%20%26%20architecture&per_page=15',
        expect.any(Object)
      );
    });
  });

  describe('fetchCuratedPhotos', () => {
    it('should fetch curated photos successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPexelsResponse,
      } as Response);

      const result = await fetchCuratedPhotos();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/curated?per_page=20',
        {
          headers: {
            Authorization: 'test-api-key',
          },
        }
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(expectedPhoto);
    });

    it('should fetch curated photos with custom perPage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPexelsResponse,
      } as Response);

      await fetchCuratedPhotos(30);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/curated?per_page=30',
        expect.any(Object)
      );
    });

    it('should handle empty curated response', async () => {
      const emptyResponse = {
        ...mockPexelsResponse,
        photos: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response);

      const result = await fetchCuratedPhotos();

      expect(result).toEqual([]);
    });

    it('should throw error when API key is missing', async () => {
      delete process.env.VITE_PEXELS_API_KEY;

      await expect(fetchCuratedPhotos()).rejects.toThrow(
        'Pexels API key is not configured. Please check your environment variables.'
      );
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      } as Response);

      await expect(fetchCuratedPhotos()).rejects.toThrow('Pexels API error: 429 Too Many Requests');
    });
  });

  describe('Photo mapping', () => {
    it('should map Pexels photo to internal Photo type correctly', async () => {
      const complexPexelsPhoto = {
        ...mockPexelsPhoto,
        id: 987654321,
        width: 1920,
        height: 1080,
        photographer: 'Jane Smith',
        alt: 'Complex photo with special characters: "quotes" & symbols',
      };

      const responseWithComplexPhoto = {
        ...mockPexelsResponse,
        photos: [complexPexelsPhoto],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithComplexPhoto,
      } as Response);

      const result = await fetchPhotos();

      expect(result[0]).toEqual({
        id: '987654321',
        title: 'Complex photo with special characters: "quotes" & symbols',
        photographer: 'Jane Smith',
        date: expect.any(String),
        url: 'https://example.com/large.jpg',
        width: 1920,
        height: 1080,
      });

      // Verify date is a valid ISO string
      expect(new Date(result[0].date).toISOString()).toBe(result[0].date);
    });

    it('should handle multiple photos in response', async () => {
      const multiplePhotosResponse = {
        ...mockPexelsResponse,
        photos: [
          { ...mockPexelsPhoto, id: 1, photographer: 'Photographer 1' },
          { ...mockPexelsPhoto, id: 2, photographer: 'Photographer 2' },
          { ...mockPexelsPhoto, id: 3, photographer: 'Photographer 3' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => multiplePhotosResponse,
      } as Response);

      const result = await fetchPhotos();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('3');
      expect(result[0].photographer).toBe('Photographer 1');
      expect(result[1].photographer).toBe('Photographer 2');
      expect(result[2].photographer).toBe('Photographer 3');
    });
  });
});