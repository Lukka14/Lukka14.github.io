import { Media, MediaListProps, MediaType } from "../../models/Movie";
import { Endpoints, RoutePaths } from "../../config/Config";
import { MediaCard } from "../main/MediaCard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAllPages } from "../../utils/Utils";

export const MovieList = ({ mediaList }: MediaListProps) => {
  const [fav, setFav] = useState([]);
  const [watch, setWatch] = useState([]);

  const generateHref = (media: Media): string => {
    let seriesSuffix = "";
    if (media.mediaType === MediaType.TV_SERIES) {
      let cookieValue = Cookies.get(String(media?.id));
      if (cookieValue) {
        seriesSuffix = cookieValue;
      } else {
        seriesSuffix = `&s=${1}&e=${1}`;
      }

    }

    return `#${RoutePaths.WATCH}?id=${media.id}${seriesSuffix}`;
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
    <div className="container py-4">
      <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-5 justify-content-center">
        {mediaList.map((media: Media) => {
          let isFav = fav.some((item: any) => item.tmdbId == media?.id);
          let isWatch = watch.some((item: any) => item.tmdbId == media?.id);
          return <div key={media.id || media.title} className="col">
            <MediaCard mediaInfo={media} href={generateHref(media)} isFav={isFav} isWatch={isWatch}
            />
          </div>
        })}
      </div>
    </div>
  );
};
