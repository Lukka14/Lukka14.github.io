import React, { useState } from "react";
import { Media } from "../../models/Movie";
import { fetchMedia, fetchTrendingMedia } from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import CenteredH1 from "../shared/CenteredText";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";

const MultiSearchPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  if (medias.length === 0) {
    fetchTrendingMedia()
      .then(setMedias)
      .catch((err) => console.error(err));
  }

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={true} />
      <CenteredH1>Search Anything!</CenteredH1>
      <MovieList mediaList={medias} />
    </>
  );
};

export default MultiSearchPage;
