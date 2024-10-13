import axios from "axios";
import { Media, Movie, Person, TVSeries } from "../models/Movie";
import { ENDPOINTS } from "../config/Config";

export const fetchMovies = (query: string): Promise<Media[]> => {
    // const URL = "http://localhost:8080/search/multi";
    const URL = ENDPOINTS.multi;

  return axios
    .get(URL, {
      params: {
        query: query,
      },
    })
    .then(response => {
      const rawData = response.data.results;
      const mediaList: Media[] = rawData.map((item: Media) => createMedia(item));

      return mediaList;
    })
    .catch(error => {
      console.error("Error fetching movies:", error);
      throw error;
    });
};

export function createMedia(mediaData: Media): Media | null {
  switch (mediaData.media_type) {
    case 'movie':
      return Object.assign(new Movie(), mediaData);
    case 'tv':
      return Object.assign(new TVSeries(), mediaData);
    case 'person':
      return Object.assign(new Person(), mediaData);
    default:
      console.warn(`Unknown media type: ${mediaData.media_type}`);
      return null; // or throw an error, depending on your needs
  }
}
