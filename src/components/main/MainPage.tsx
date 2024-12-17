import React, { useState } from "react";
import { Media, MediaType } from "../../models/Movie";
import { fetchDiscoverMovies, fetchMedia } from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import Signature from "../../tmp/Signature";
import WIP from "../../tmp/WIP";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "./SearchMUI_EXPERIMENTAL";
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
  fetchDiscoverMovies()
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
      <WIP></WIP>
      <MovieList mediaList={mediaList} />
      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;
