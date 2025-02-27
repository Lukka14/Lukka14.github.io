// const API_URL = "http://localhost:8080";
const API_URL = "https://api.movieplus.live";

const URL_SEARCH = `${API_URL}/search`;

export const Endpoints = {
  MOVIES: `${URL_SEARCH}/movies`,
  SERIES: `${URL_SEARCH}/series`,
  MULTI: `${URL_SEARCH}/multi`,
  DISCOVER_MOVIES: `${URL_SEARCH}/discoverMovies`,
  DISCOVER_TV_SERIES: `${URL_SEARCH}/discoverTvSeries`,
  TRENDING_ALL: `${URL_SEARCH}/trendingAll`,
  TOP_RATED_MOVIES: `${URL_SEARCH}/topRatedMovies`,

  DETAILED_MOVIE: `${URL_SEARCH}/movieDetails`,
  DETAILED_SERIES: `${URL_SEARCH}/seriesDetails`,
};

export enum RoutePaths {
  HOME = '/',
  WATCH = '/watch',
  LOGIN = '/login',
}