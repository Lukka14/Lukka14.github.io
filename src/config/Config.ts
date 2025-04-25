// const API_URL = "http://localhost:8080";
// const API_URL = "https://bf7f-2a0b-6204-12b2-c00-4905-ee90-a272-a53e.ngrok-free.app";
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
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/signup`,
  DETAILED_MOVIE: `${URL_SEARCH}/movieDetails`,
  DETAILED_SERIES: `${URL_SEARCH}/seriesDetails`,
  IMG_UPLOAD: `${API_URL}/image/upload`,
  ME: `${API_URL}/auth/me`,
  ACCESS_TOKEN: `${API_URL}/auth/accessToken`
};

export enum RoutePaths {
  HOME = '/',
  WATCH = '/watch',
  LOGIN = '/login',
}