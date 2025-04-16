import { Media, MediaListProps, MediaType } from "../../models/Movie";
import { RoutePaths } from "../../config/Config";
import { MediaCard } from "../main/MediaCard";
import Cookies from "js-cookie";

export const MovieList = ({ mediaList }: MediaListProps) => {
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

    // For hash routing, ensure the correct URL structure
    return `#${RoutePaths.WATCH}?id=${media.id}${seriesSuffix}`;
  };

  return (
    <div className="container py-4">
      <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-5">
        {mediaList.map((media: Media) => (
          <div key={media.id || media.title} className="col">
            <MediaCard mediaInfo={media} href={generateHref(media)} />
          </div>
        ))}
      </div>
    </div>
  );
};
