import { Media, MediaListProps } from "../../models/Movie";
import "../../css/App.css";
import "../../utils/Utils";
import { normalizeString } from "../../utils/Utils";
import { RoutePaths } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";

export const MovieList = ({ mediaList }: MediaListProps) => {

  const navigate = useNavigate();

  return (
    <div className="container">
      <ul className="row row-cols-5">
        {mediaList.map((media: Media) => (
          
          <li key={media.id == undefined ? "asd" : media.id} className="col no-bullets">
            <div
              className="movie"
              onClick={() =>
                navigate(
                  RoutePaths.WATCH + `?id=${media.id}&m=${media.mediaType}&s=${1}&e=${1}`
                )
              }
            >
              {/* <a href={getMediaURL(media)} target="_blank"> */}
              <img
                src={media.posterUrl}
                alt={media.title}
                className="img-fluid"
              />
              {/* </a> */}
              <div className="white-text"> {media.mediaType ? normalizeString(media.mediaType) : ''}</div>
              <h3 className="white-text">{media.title}</h3>
              {/* <Rating name="read-only" value={media.rating} readOnly /> */}
              <Rating name="half-rating" defaultValue={media.rating == undefined ? 0 : media.rating / 2.0} precision={0.25} readOnly />
              <span className="white-text">{media.rating}</span>
              <div className="white-text">{media.releaseDate?.split("-")[0]}</div>
                <br></br>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
