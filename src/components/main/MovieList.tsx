import { Media, MediaListProps } from "../../models/Movie";
import "../../css/App.css";
import "../../utils/Utils";
import { RoutePaths } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import { MediaCard } from "./MediaCard";

export const MovieList = ({ mediaList }: MediaListProps) => {
  const navigate = useNavigate();

  const handleclick = (media: Media) => {
    navigate(
      RoutePaths.WATCH + `?id=${media.id}&m=${media.mediaType}&s=${1}&e=${1}`
    );
  };

  return (
    <div className="container py-4">
      <div className="row g-4  row-cols-5">
        {mediaList.map((media: Media) => (
          <div key={media.id || media.title} className="col">
            <MediaCard onClick={handleclick} mediaInfo={media} />
          </div>
        ))}
      </div>
    </div>
  );
};
