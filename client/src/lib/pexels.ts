import { Photo } from "@/types/photo";

// Pexels API Configuration
const BASE_URL = "https://api.pexels.com/v1";
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const HEADERS = {
  Authorization: API_KEY,
};

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

/**
 * Maps a Pexels photo object to our internal Photo type
 */
function mapPexelsPhotoToPhoto(photo: PexelsPhoto): Photo {
  return {
    id: String(photo.id),
    title: photo.alt || `Photo by ${photo.photographer}`,
    photographer: photo.photographer,
    date: new Date().toISOString(),
    url: photo.src.large,
    width: photo.width,
    height: photo.height,
  };
}

/**
 * Makes a request to the Pexels API with error handling
 */
async function makePexelsRequest(endpoint: string): Promise<PexelsResponse> {
  if (!API_KEY) {
    throw new Error("Pexels API key is not configured. Please check your environment variables.");
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }

    const data: PexelsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error making Pexels API request:", error);
    throw error;
  }
}

export async function fetchPhotos(query: string = "nature", perPage: number = 20): Promise<Photo[]> {
  try {
    const endpoint = `/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
    const data = await makePexelsRequest(endpoint);
    
    if (!data.photos || data.photos.length === 0) {
      return [];
    }
    
    return data.photos.map(mapPexelsPhotoToPhoto);
  } catch (error) {
    console.error("Error fetching photos from Pexels:", error);
    throw error;
  }
}

export async function fetchCuratedPhotos(perPage: number = 20): Promise<Photo[]> {
  try {
    const endpoint = `/curated?per_page=${perPage}`;
    const data = await makePexelsRequest(endpoint);
    
    if (!data.photos || data.photos.length === 0) {
      return [];
    }
    
    return data.photos.map(mapPexelsPhotoToPhoto);
  } catch (error) {
    console.error("Error fetching curated photos from Pexels:", error);
    throw error;
  }
}