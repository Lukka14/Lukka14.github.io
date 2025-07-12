import { ImdbMedia, Media, Movie, TvSeries } from "../models/Movie";
import { Endpoints } from "../config/Config";
import axios from "axios";

export const fetchFullMovieInfo = async (id: string): Promise<Media | null> => {
  if (!id) return null;
  
  try {
    const response = await axios.get(Endpoints.FULL_MOVIE_INFO, {
      params: { id }
    });
    return Object.assign(new Media(), response.data);
  } catch (error) {
    return null;
  }
};

export const fetchTrendingMediaWithDetails = async (page: number = 1): Promise<Media[]> => {
  try {
    const trendingMedia = await fetchTrendingMedia(page);
    
    const enrichedMedia = await Promise.allSettled(
      trendingMedia.map(async (media) => {
        const fullInfo = await fetchFullMovieInfo(media.id?.toString() || '');
        if (fullInfo && fullInfo.release_date) {
          return { ...media, release_date: fullInfo.release_date };
        }
        return media;
      })
    );
    
    return enrichedMedia
      .filter((result): result is PromiseFulfilledResult<Media> => result.status === 'fulfilled')
      .map(result => result.value);
      
  } catch (error) {
    return fetchTrendingMedia(page);
  }
};

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

export const fetchUserByUsername = (username: string) => {
  return axios.get(Endpoints.GET_USER, {
    params: {
      username
    }
  }).then((res) => {
    return res.data;
  }).catch(err => {
    console.error(err);
    return null;
  })
}

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

// export const refreshAccessToken = async (): Promise<string | null> => {
//   try {
//     const res = await axios.post(Endpoints.ACCESS_TOKEN, {}, { withCredentials: true });

//     const accessToken = res.data.token;

//     console.log("Access token refreshed:", res.data);

//     Cookies.set("accessToken", accessToken);
//     return accessToken;
//   } catch (error) {
//     return null;
//   }
// };

// export const fetchMe = async (): Promise<any> => {
//   let accessToken = Cookies.get("accessToken");

//   try {
//     const res = await axios.get(Endpoints.ME, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return res.data;
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       const newAccessToken = await refreshAccessToken();
//       if (!newAccessToken) return null;

//       try {
//         const retryRes = await axios.get(Endpoints.ME, {
//           headers: {
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         });

//         return retryRes.data;
//       } catch {
//         return null;
//       }
//     }
//     return null;
//   }
// };

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
      const tvSeries: TvSeries = Object.assign(new TvSeries(), rawData);

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