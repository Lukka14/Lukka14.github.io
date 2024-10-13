import React, { useState } from "react";
import { MovieList } from "./MovieList";
import { Search } from "./Search";
import { fetchMovies } from "../services/movieService";
import { Media, Movie } from "../models/Movie";
import Signature from "./Signature";
import WIP from "./WIP";

const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMovies(query).then(setMedias).catch(err => console.error(err));
  };

  return (
    <>
      <Search onClick={handleSearch} />
      <MovieList mediaList={medias} />
      <WIP></WIP>
      <Signature />
    </>
  );
};

export default MainPage;
