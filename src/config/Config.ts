const API_URL = "http://localhost:8080";
// const API_URL = "https://api.movieplus.live";

const URL_SEARCH = API_URL+"/search";

export enum Endpoints{
    MOVIES = `${URL_SEARCH}/movies`,
    SERIES = `${URL_SEARCH}/series`,
    MULTI = `${URL_SEARCH}/multi`,

    DETAILED_MOVIE = `${URL_SEARCH}/movieDetails`,
    DETAILED_SERIES = `${URL_SEARCH}/seriesDetails`,
  };


export enum RoutePaths {
    HOME = '/',
    WATCH = '/watch',
    LOGIN = '/login',
}