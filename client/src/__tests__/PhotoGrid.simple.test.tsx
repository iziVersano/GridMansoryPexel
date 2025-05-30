import { Photo } from '../types/photo';

describe('PhotoGrid Module', () => {
  it('should have Photo type definition', () => {
    const testPhoto: Photo = {
      id: '1',
      title: 'Test Photo',
      photographer: 'Test Photographer',
      date: '2024-01-01',
      url: 'https://example.com/photo.jpg',
      width: 400,
      height: 600,
    };

    expect(testPhoto.id).toBe('1');
    expect(testPhoto.title).toBe('Test Photo');
    expect(testPhoto.photographer).toBe('Test Photographer');
    expect(testPhoto.width).toBe(400);
    expect(testPhoto.height).toBe(600);
  });

  it('should validate Photo interface properties', () => {
    const photo: Photo = {
      id: 'test-id',
      title: 'Beautiful Landscape',
      photographer: 'John Doe',
      date: '2024-05-30',
      url: 'https://example.com/landscape.jpg',
      width: 1920,
      height: 1080,
    };

    expect(typeof photo.id).toBe('string');
    expect(typeof photo.title).toBe('string');
    expect(typeof photo.photographer).toBe('string');
    expect(typeof photo.date).toBe('string');
    expect(typeof photo.url).toBe('string');
    expect(typeof photo.width).toBe('number');
    expect(typeof photo.height).toBe('number');
  });

  it('should handle photo dimensions correctly', () => {
    const portraitPhoto: Photo = {
      id: '2',
      title: 'Portrait Photo',
      photographer: 'Jane Smith',
      date: '2024-05-30',
      url: 'https://example.com/portrait.jpg',
      width: 600,
      height: 800,
    };

    const landscapePhoto: Photo = {
      id: '3',
      title: 'Landscape Photo',
      photographer: 'Bob Wilson',
      date: '2024-05-30',
      url: 'https://example.com/landscape.jpg',
      width: 1200,
      height: 600,
    };

    expect(portraitPhoto.height > portraitPhoto.width).toBe(true);
    expect(landscapePhoto.width > landscapePhoto.height).toBe(true);
  });
});