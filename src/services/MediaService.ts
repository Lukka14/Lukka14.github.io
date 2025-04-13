import { ImdbMedia, Media, Movie, TvSeries } from "../models/Movie";
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


export const fetchOnlyMovies = (query: string): Promise<Media[]> => {
  const URL = Endpoints.MOVIES;

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

export const fetchOnlyTvSeries = (query: string): Promise<Media[]> => {
  const URL = Endpoints.SERIES;

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




export const fetchMovie = async (id: string): Promise<Movie> => {
    // const URL = "http://localhost:8080/search/multi";
    const URL = Endpoints.DETAILED_MOVIE;

  if (id.length === 0) {
    return Promise.resolve({} as Movie);
  }

  try {
    const response = await axios
      .get(URL, {
        params: {
          id: id,
        },
      });
    const rawData = response.data;
    const movie: Movie = Object.assign(new Movie(), rawData);
    return movie;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
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

export const fetchTrendingMedia = (page: number = 1): Promise<Media[]> => {
  const URL = `${Endpoints.TRENDING_ALL}?page=${page}`;
  return fetchMediaFromUrl(URL);
};

export const fetchTopRatedMovies = (): Promise<Media[]> => {
  const URL = Endpoints.TOP_RATED_MOVIES;
  return fetchMediaFromUrl(URL);
};

const fetchMediaFromUrl = (url: string): Promise<Media[]> => {
  return axios
  .get(url, {
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
}