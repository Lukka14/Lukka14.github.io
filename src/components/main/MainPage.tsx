import React, { useState } from "react";
import { Media } from "../../models/Movie";
import {
  fetchMedia,
  fetchTrendingMedia
} from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import CenteredH1 from "../shared/CenteredText";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import MovieCarousel from "./MovieCarousel";

const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  const [mediaList, setMediaList] = useState<Media[]>([]);

  React.useEffect(() => {
    fetchTrendingMedia()
      .then(setMediaList)
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Background
        url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
        // url="https://gcdnb.pbrd.co/images/ZvEZBJu1sgOG.png?o=1"
      />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      <MovieCarousel mediaList={mediaList} />
      <CenteredH1>Watch Latest Movies Here!</CenteredH1>
      <MovieList mediaList={mediaList} />
      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;
