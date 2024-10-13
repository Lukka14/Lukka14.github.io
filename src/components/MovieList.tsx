import { Media, MediaListProps, Movie, Person, TVSeries } from "../models/Movie";
import "../css/App.css";
import "../utils/Utils";
import { normalizeString } from "../utils/Utils";
{  /* <div class="container text-center">
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
  return (
    <div className="container">
      <ul className="row row-cols-5">
        {mediaList.map((media: Media) => (
          <li key={media.id} className="col no-bullets">
            <div className="movie">
              <a
                href={"https://vidsrc.icu/embed/movie/" + media.id}
                target="_blank"
              >
                <img
                  src={"https://image.tmdb.org/t/p/original" + media.getImgPath()}
                  alt={media.getName()}
                  className="img-fluid"
                />
              </a>
              {/* <?php if(){ ?> <div> </div> <?php } ?> */}
              {/* {media.media_type === "tv" ? (} */}
              {/* {media.media_type === "tv" ? <div>TV Series</div> : <div>Movie</div>} */}
              <div> {normalizeString(media.getMediaType())}</div>
              <h3>
                {media.getName()}
              </h3>
              {/* <p>{media.release_date}</p> */}
              <p>{media.popularity}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


