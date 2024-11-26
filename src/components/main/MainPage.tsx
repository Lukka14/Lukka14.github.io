import React, { useState } from "react";
import { Media } from "../../models/Movie";
import { fetchMedia } from "../../services/MediaService";
import { MovieList } from "./MovieList";
import { Search } from "./Search";
import Signature from "../../tmp/Signature";
import WIP from "../../tmp/WIP";
import { Background } from "../main/Background";
import SearchMUI from "./SearchMUI";
import SearchMUI_EXPERIMENTAL from "./SearchMUI_EXPERIMENTAL";
import PrimarySearchAppBar from "./SearchMUI_EXPERIMENTAL";

const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Background url="src/assets/movieplus-full-bg.png"></Background>
      <PrimarySearchAppBar onClick={handleSearch}/>
      <MovieList mediaList={medias} />
      <WIP></WIP>
      <Signature />
    </>
  );
};

export default MainPage;
