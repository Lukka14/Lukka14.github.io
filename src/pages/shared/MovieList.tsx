import { Media, MediaListProps, MediaType } from "../../models/Movie";
import { Endpoints, RoutePaths } from "../../config/Config";
import { MediaCard } from "../main/MediaCard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAllPages } from "../../utils/Utils";
import { getResumeQuery } from "./RecentlyWatchService";
import { getCurrentUser } from "../../services/UserService";

export const MovieList = ({ mediaList }: MediaListProps) => {
  const [fav, setFav] = useState([]);
  const [watch, setWatch] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    async function userFetch() {
      setIsLoggedIn(!!(await getCurrentUser())?.username);
    }
    userFetch();
  }, [isLoggedIn])
  const generateHref = (media: Media): string => {
    const seriesSuffix =
      media.mediaType === MediaType.TV_SERIES ? getResumeQuery(media.id) : "";

    return `${RoutePaths.WATCH}?id=${media.id}${seriesSuffix}`;
  };

  const username = Cookies.get("username");
  useEffect(() => {
    async function getT() {
      const favEndpoint = `${Endpoints.FAVOURITES}?username=${username}`;
      const watchEndpoint = `${Endpoints.WATCHLIST}?username=${username}`;

      const [favouritesData, watchlistData] = await Promise.all([
        fetchAllPages(favEndpoint),
        fetchAllPages(watchEndpoint),
      ]);

      setFav(favouritesData as any);
      setWatch(watchlistData as any);
    }

    if (mediaList && username) getT();
  }, [mediaList]);

  return (
    <div className="media-grid-wrapper">
      <div className="media-grid">
        {mediaList.map((media: Media) => {
          let isFav = fav.some((item: any) => item.tmdbId == media?.id);
          let isWatch = watch.some((item: any) => item.tmdbId == media?.id);
          return <div key={media.id || media.title}>
            <MediaCard mediaInfo={media} href={generateHref(media)} isFav={isFav} isWatch={isWatch} isLoggedIn={isLoggedIn}
            />
          </div>
        })}
      </div>
    </div>
  );
};
