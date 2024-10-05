import axios from "axios";
import { Movie } from "../models/Movie";

export const fetchMovies = (query: string): Promise<Movie[]> => {
    // const URL = "http://www.omdbapi.com/";

    const API_KEY = "";

    const URL = "https://api.themoviedb.org/3/search/movie?api_key="+API_KEY;

  return axios
    .get(URL, {
      params: {
        query: query,
      },
    })
    .then(response => {console.log(response.data.results); return response.data.results})
    .catch(error => {
      console.error("Error fetching movies:", error);
      throw error;
    });
};
