import React, { useState } from "react";
import { Media } from "../../models/Movie";
import { fetchMedia } from "../../services/MediaService";
import { MovieList } from "./MovieList";
import Signature from "../../tmp/Signature";
import WIP from "../../tmp/WIP";
import { Background } from "../main/Background";
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
      <Background
        url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
        // url="https://gcdnb.pbrd.co/images/ZvEZBJu1sgOG.png?o=1"
      />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={true} />
      <MovieList mediaList={medias} />
      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;
