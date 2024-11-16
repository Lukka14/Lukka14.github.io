import axios from "axios";
import { Media } from "../models/Movie";
import { ENDPOINTS } from "../config/Config";

export const fetchMovies = (query: string): Promise<Media[]> => {
    // const URL = "http://localhost:8080/search/multi";
    const URL = ENDPOINTS.multi;

  if (query.length === 0) {
    return Promise.resolve([]);
  }

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
  return Object.assign(new Media(), mediaData);
}
