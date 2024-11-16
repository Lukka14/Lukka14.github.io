import { Media, MediaListProps } from "../models/Movie";
import "../css/App.css";
import "../utils/Utils";
import { normalizeString } from "../utils/Utils";
{
  /* <div class="container text-center">
  <div class="row">
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
  </div>
</div> */
}

export const MovieList = ({ mediaList }: MediaListProps) => {
  const getMediaURL = (media: Media) =>
    media.mediaType === "Movie"
      ? `https://vidsrc.cc/v2/embed/movie/${media.id}?autoPlay=true`
      : media.mediaType === "TV Series"
      ? `https://vidsrc.cc/v2/embed/tv/${media.id}/1/1?autoPlay=false`
      : "";

  return (
    <div className="container">
      <ul className="row row-cols-5">
        {mediaList.map((media: Media) => (
          <li key={media.id} className="col no-bullets">
            <div className="movie">
              <a href={getMediaURL(media)} target="_blank">
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  className="img-fluid"
                />
              </a>
              <div> {normalizeString(media.mediaType)}</div>
              <h3>{media.title}</h3>
              <p>{media.rating}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
