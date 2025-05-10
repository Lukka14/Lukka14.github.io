import React, { useEffect, useState } from "react";
import { Media } from "../../models/Movie";
import { fetchMedia, fetchTrendingMedia } from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import CenteredH1 from "../shared/CenteredText";
import { Background } from "./Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import Carousel from "./MovieCarousel";
import { getRecentlyWatched } from "../shared/RecentlyWatchService";
import { LoadingSpinner } from "./LoadingSpinner";
import { Footer } from "../shared/Footer";

let page = 1;

// It's responsible for loading more media when the user scrolls to the bottom of the page.
const setNewMediaLoader = (
  offset = 0,
  addMediaList: (newMedia: Media[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - offset;

      if (scrolledToBottom) {
        setIsLoading(true);
        fetchTrendingMedia(++page)
          .then((media) => {
            addMediaList(media);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoading(false);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);
};

const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleSearch = (query: string) => {
    setIsLoading(true);
    fetchMedia(query)
      .then((media) => {
        setMedias(media);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaListCarousel, setMediaListCarousel] = useState<Media[]>([]);

  const addMediaList = (newMedia: Media[]) => {
    setMediaList((prevMediaList) => [...prevMediaList, ...newMedia]);
  };

  React.useEffect(() => {
    setInitialLoading(true);
    fetchTrendingMedia()
      .then((media) => {
        setMediaList(media);
        setMediaListCarousel(media);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInitialLoading(false);
      });
  }, []);

  setNewMediaLoader(0, addMediaList, setIsLoading);

  const recentylyWatched: Media[] = getRecentlyWatched();

  return (
    <>
      <Background
        url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
      // url="https://gcdnb.pbrd.co/images/ZvEZBJu1sgOG.png?o=1"
      />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      {initialLoading && <LoadingSpinner initial={true} />}

      {!initialLoading && (
        <>
          <Carousel mediaList={mediaListCarousel} />
          {recentylyWatched.length > 0 && (
            <>
              <CenteredH1>Recently watched:</CenteredH1>
              <MovieList mediaList={recentylyWatched} />
            </>
          )}
          <CenteredH1>Watch Latest Movies Here!</CenteredH1>
          <MovieList mediaList={mediaList} />
          {isLoading && <LoadingSpinner />}
        </>
      )}
      {/* <Footer /> */}
      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;
