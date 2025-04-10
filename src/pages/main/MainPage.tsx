import React, { useEffect, useState } from "react";
import { Media } from "../../models/Movie";
import { fetchMedia, fetchTrendingMedia } from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import CenteredH1 from "../shared/CenteredText";
import { Background } from "./Background";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import Carousel from "./MovieCarousel";
import { getRecentlyWatched } from "../shared/RecentlyWatchService";
import { LoadingSpinner } from "./LoadingSpinner";

let page = 1;

// It's responsible for loading more media when the user scrolls to the bottom of the page.
const setNewMediaLoader = (offset = 0, addMediaList: (newMedia: Media[]) => void, setIsLoadingMore?: (isLoading: boolean) => void) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - offset;

      if (scrolledToBottom) {
        setIsLoadingMore?.(true);

        fetchTrendingMedia(++page)
          .then((newMedia) => {
            addMediaList(newMedia);
            setIsLoadingMore?.(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoadingMore?.(false);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);
};

const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);

    fetchMedia(query)
      .then((results) => {
        setMedias(results);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error(err);
        setIsSearching(false);
      });
  };

  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaListCarousel, setMediaListCarousel] = useState<Media[]>([]);

  const addMediaList = (newMedia: Media[]) => {
    setMediaList((prevMediaList) => [...prevMediaList, ...newMedia]);
  };

  React.useEffect(() => {
    setIsInitialLoading(true);

    fetchTrendingMedia()
      .then((media) => {
        setMediaList(media);
        setMediaListCarousel(media);
        setIsInitialLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsInitialLoading(false);
      });
  }, []);

  setNewMediaLoader(0, addMediaList, setIsLoadingMore);

  const recentylyWatched: Media[] = getRecentlyWatched();

  return (
    <>
      <Background
        url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
      // url="https://gcdnb.pbrd.co/images/ZvEZBJu1sgOG.png?o=1"
      />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

      {isInitialLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Carousel mediaList={mediaListCarousel} />
          {recentylyWatched.length > 0 && (
            <>
              <CenteredH1>Recently watched:</CenteredH1>
              <MovieList mediaList={recentylyWatched} />
            </>
          )}
          <CenteredH1>Watch Latest Movies Here!</CenteredH1>

          {isSearching ? (
            <LoadingSpinner />
          ) : (
            <MovieList mediaList={mediaList} />
          )}

          {isLoadingMore && <LoadingSpinner />}
        </>
      )}

      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;