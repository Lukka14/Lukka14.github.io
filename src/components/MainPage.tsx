import React, { useState } from "react";
import { MovieList } from "./MovieList";
import { Search } from "./Search";
import { fetchMovies } from "../services/movieService";
import { Movie } from "../models/Movie";
import Signature from "./Signature";
import WIP from "./WIP";

const MainPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearch = (query: string) => {
    fetchMovies(query).then(setMovies).catch(err => console.error(err));
  };

  return (
    <>
      <Search onClick={handleSearch} />
      <MovieList movies={movies} />
      <WIP></WIP>
      <Signature />
    </>
  );
};

export default MainPage;
