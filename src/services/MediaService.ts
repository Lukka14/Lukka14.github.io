import { ImdbMedia, Media, TvSeries } from "../models/Movie";
import { Endpoints } from "../config/Config";
import axios from "axios";


export const fetchMedia = (query: string): Promise<Media[]> => {
    // const URL = "http://localhost:8080/search/multi";
    const URL = Endpoints.MULTI;

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
      const mediaList: Media[] = rawData.map((item: Media) => Object.assign(new Media(), item));

      return mediaList;
    })
    .catch(error => {
      console.error("Error fetching movies:", error);
      throw error;
    });
};


export const fetchImdbMedia = (id: string): Promise<ImdbMedia> => {
    // const URL = "http://localhost:8080/search/multi";
    const URL = Endpoints.DETAILED_MOVIE;

  if (id.length === 0) {
    return Promise.resolve({} as ImdbMedia);
  }

  return axios
    .get(URL, {
      params: {
        id: id,
      },
    })
    .then(response => {
      const rawData = response.data;
      const imdbMedia: ImdbMedia = Object.assign(new ImdbMedia(), rawData);


      return imdbMedia;
    })
    .catch(error => {
      console.error("Error fetching movies:", error);
      throw error;
    });
};


export const fetchTvSeries = (id: string): Promise<TvSeries> => {
    // const URL = "http://localhost:8080/search/multi";
    const URL = Endpoints.DETAILED_SERIES;

  if (id.length === 0) {
    return Promise.resolve({} as TvSeries);
  }

  return axios
    .get(URL, {
      params: {
        id: id,
      },
    })
    .then(response => {
      const rawData = response.data;
      const tvSeries: TvSeries =  Object.assign(new TvSeries(), rawData);

      return tvSeries;
    })
    .catch(error => {
      console.error("Error fetching movies:", error);
      throw error;
    });
};

// todo resolve duplication

export const fetchDiscoverMovies = (): Promise<Media[]> => {
  const URL = Endpoints.DISCOVER_MOVIES;

  return axios
  .get(URL, {
  })
  .then(response => {
    const rawData = response.data.results;
    const mediaList: Media[] = rawData.map((item: Media) => Object.assign(new Media(), item));

    return mediaList;
  })
  .catch(error => {
    console.error("Error fetching movies:", error);
    throw error;
  });
};


export const fetchDiscoverTvSeries = (): Promise<Media[]> => {
  const URL = Endpoints.DISCOVER_TV_SERIES;

return axios
  .get(URL, {
  })
  .then(response => {
    const rawData = response.data.results;
    const mediaList: Media[] = rawData.map((item: Media) => Object.assign(new Media(), item));

    return mediaList;
  })
  .catch(error => {
    console.error("Error fetching movies:", error);
    throw error;
  });
};