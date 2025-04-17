import React, { useEffect, useState } from "react";
import { Media } from "../../models/Movie";
import { fetchMedia, fetchTrendingMedia } from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import CenteredH1 from "../shared/CenteredText";
import { Background } from "./Background";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import Carousel from "./MovieCarousel";
import { getRecentlyWatched } from "../shared/RecentlyWatchService";

let page = 1;

// It's responsible for loading more media when the user scrolls to the bottom of the page.
const setNewMediaLoader = (offset = 0, addMediaList: (newMedia: Media[]) => void) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - offset;

      if (scrolledToBottom) {
          fetchTrendingMedia(++page)
            .then(addMediaList)
            .catch((err) => console.error(err));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

};

const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaListCarousel, setMediaListCarousel] = useState<Media[]>([]);

  const addMediaList = (newMedia: Media[]) => {
    setMediaList((prevMediaList) => [...prevMediaList, ...newMedia]);
  };

  React.useEffect(() => {
    fetchTrendingMedia()
      .then((media) => {
        setMediaList(media);
        setMediaListCarousel(media);
      })
      .catch((err) => console.error(err));
  }, []);

  setNewMediaLoader(0, addMediaList);

  const recentylyWatched: Media[] = getRecentlyWatched();

  return (
    <>
      <Background
        url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
      // url="https://gcdnb.pbrd.co/images/ZvEZBJu1sgOG.png?o=1"
      />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      <Carousel mediaList={mediaListCarousel} />
      {recentylyWatched.length > 0 && (
        <>
          <CenteredH1>Recently watched:</CenteredH1>
          <MovieList mediaList={recentylyWatched} />
        </>
      )}
      <CenteredH1>Watch Latest Movies Right Here!</CenteredH1>
      <MovieList mediaList={mediaList} />
      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;
