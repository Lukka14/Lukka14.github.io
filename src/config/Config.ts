// const API_URL = "http://localhost:8080";
const API_URL = "https://api.movieplus.live";
// const API_URL = "https://dev.movieplus.live";

const URL_SEARCH = `${API_URL}/search`;
export const Endpoints = {
  // 🔍 Search & Discover
  MOVIES: `${URL_SEARCH}/movies`,
  SERIES: `${URL_SEARCH}/series`,
  MULTI: `${URL_SEARCH}/multi`,
  DISCOVER_MOVIES: `${URL_SEARCH}/discoverMovies`,
  DISCOVER_TV_SERIES: `${URL_SEARCH}/discoverTvSeries`,
  TRENDING_ALL: `${URL_SEARCH}/trendingAll`,
  TOP_RATED_MOVIES: `${URL_SEARCH}/topRatedMovies`,
  DETAILED_MOVIE: `${URL_SEARCH}/movieDetails`,
  DETAILED_SERIES: `${URL_SEARCH}/seriesDetails`,
  FULL_MOVIE_INFO: `${URL_SEARCH}/fullMovieInfo`,
  EPISODES: `${URL_SEARCH}/episodes`,
  
  // 🔐 Auth
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  REGISTER: `${API_URL}/auth/register`,
  ME: `${API_URL}/auth/me`,
  ACCESS_TOKEN: `${API_URL}/auth/accessToken`,
  GET_USER: `${API_URL}/auth/user`,
  VERIFY_EMAIL: `${API_URL}/auth/verify`,
  CHANGE_PASSWORD: `${API_URL}/auth/password`,

  // 👤 User Data
  WATCHED: `${API_URL}/user/watched`,
  WATCHLIST: `${API_URL}/user/watchlist`,
  FAVOURITES: `${API_URL}/user/favourites`,
  HANDLE_WATCHED: `${API_URL}/user/watched`,
  HANDLE_WATCHLIST: `${API_URL}/user/watchlist`,
  HANDLE_FAVOURITES: `${API_URL}/user/favourites`,

  // 🖼️ Image Upload/View
  IMG_UPLOAD: `${API_URL}/image/upload`,
  IMG_VIEW: `${API_URL}/image/view`,
};


export enum RoutePaths {
  HOME = '/',
  WATCH = '/watch',
  LOGIN = '/login',
}