import React, { useEffect, useState } from "react";
import { ImdbMedia, TvSeries, MediaType, Movie } from "../../../models/Movie";
import { convertMinutes, fetchAllPages, formatMoney } from "../../../utils/Utils";
import { BookmarkIcon, Clapperboard, Clock3, Globe, HeartIcon, Star, Tv } from "lucide-react";
import { Endpoints } from "../../../config/Config";
import Cookies from "js-cookie";
import { toggleFavorite, toggleWatchlist } from "../../../services/MediaCardService";
import { CustomToast } from "../../shared/Toast";
import { getCurrentUser } from "../../../services/UserService";

interface MediaInfoProps {
  media: ImdbMedia | TvSeries | null;
}

const MediaInfo: React.FC<MediaInfoProps> = ({ media }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    async function userFetch() {
      setIsLoggedIn(!!(await getCurrentUser())?.username);
    }
    userFetch();
  }, []);

  const username = Cookies.get("username");

  useEffect(() => {
    async function getT() {
      if (!media || !username) return;

      try {
        const favEndpoint = `${Endpoints.FAVOURITES}?username=${username}`;
        const watchEndpoint = `${Endpoints.WATCHLIST}?username=${username}`;

        const [favouritesData, watchlistData] = await Promise.all([
          fetchAllPages(favEndpoint),
          fetchAllPages(watchEndpoint),
        ]);

        const isF = favouritesData.some(
          (item: any) => item.tmdbId?.toString() == media.id?.toString()
        );
        const isW = watchlistData.some(
          (item: any) => item.tmdbId?.toString() == media.id?.toString()
        );

        setIsFavorite(isF);
        setIsInWatchList(isW);
      } catch (err) {
        console.error(err);
      }
    }

    if (username && media) getT();
  }, [media]);

  const handleFavoriteClick = async () => {
    try {
      if (isLoggedIn) setIsFavorite(!isFavorite);
      const newStatus = await toggleFavorite(media?.id, media?.mediaType, setIsFavorite);
      setIsFavorite(newStatus);
    } catch (e) {
      setIsFavorite(!isFavorite);
      setToastOpen(true);
    }
  };

  const handleWatchlistClick = async () => {
    try {
      if (isLoggedIn) setIsInWatchList(!isInWatchList);
      const newStatus = await toggleWatchlist(media?.id, media?.mediaType, setIsInWatchList);
      setIsInWatchList(newStatus);
    } catch (e) {
      setIsInWatchList(!isInWatchList);
      setToastOpen(true);
    }
  };

  if (!media) {
    return (
      <div className="watch-panel">
        <div className="watch-empty-note">
          Unable to display media information. Please try again later.
        </div>
      </div>
    );
  }

  const isTvSeries = media.mediaType === MediaType.TV_SERIES;

  const runtime = (media as Movie).runtime;
  const budget = (media as Movie).budget;
  const releaseYear = media.releaseYear ? new Date(media.releaseYear).getFullYear() : null;

  let hours = 0, minutes = 0;
  if (!isTvSeries && runtime) {
    ({ hours, minutes } = convertMinutes(runtime));
  }

  const runtimeLabel = runtime
    ? [hours > 0 ? `${hours}h` : null, minutes > 0 ? `${minutes}m` : null]
      .filter(Boolean)
      .join(" ")
    : null;

  return (
    <>
      <CustomToast open={toastOpen} setOpen={setToastOpen} />

      <div className="watch-panel">
        <div className="watch-info-grid">
          <div>
            {media.posterUrl && (
              <img
                src={media.posterUrl}
                alt={media.title}
                className="watch-poster"
                loading="lazy"
              />
            )}
          </div>

          <div>
            <h1 className="watch-title">{media.title}</h1>

            <div className="watch-meta-row">
              <span className="watch-chip">
                {isTvSeries ? <Tv size={14} /> : <Clapperboard size={14} />}
                {isTvSeries ? "Series" : "Movie"}
              </span>
              {releaseYear && <span className="watch-chip">{releaseYear}</span>}
              {runtimeLabel && (
                <span className="watch-chip">
                  <Clock3 size={14} />
                  {runtimeLabel}
                </span>
              )}
              {isTvSeries && (media as TvSeries).numberOfSeasons != null && (
                <span className="watch-chip">
                  {(media as TvSeries).numberOfSeasons} season
                  {(media as TvSeries).numberOfSeasons === 1 ? "" : "s"}
                </span>
              )}
              {media.originalLanguage && (
                <span className="watch-chip">
                  <Globe size={14} />
                  {media.originalLanguage.toUpperCase()}
                </span>
              )}
              {media.imdbId && (
                <a
                  href={`https://www.imdb.com/title/${media.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-chip watch-chip--rating"
                  title="View on IMDb"
                >
                  <Star size={14} fill="currentColor" />
                  {/* imdbRating can come back null when the IMDb provider is
                      unavailable; TMDB data still renders fine. */}
                  {media.imdbRating ?? "N/A"}
                </a>
              )}
            </div>

            {media.genreList && media.genreList.length > 0 && (
              <div className="watch-genres">
                {media.genreList.map((genre) => (
                  <span key={genre} className="watch-genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {media.overview && <p className="watch-overview">{media.overview}</p>}

            <div className="watch-actions mb-4">
              <button
                type="button"
                className={`watch-action-btn ${isFavorite ? "is-active-fav" : ""}`}
                onClick={handleFavoriteClick}
              >
                <HeartIcon size={17} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "In favourites" : "Favourite"}
              </button>
              <button
                type="button"
                className={`watch-action-btn ${isInWatchList ? "is-active-list" : ""}`}
                onClick={handleWatchlistClick}
              >
                <BookmarkIcon size={17} fill={isInWatchList ? "currentColor" : "none"} />
                {isInWatchList ? "In watchlist" : "Watchlist"}
              </button>
            </div>

            <div className="watch-stats">
              {media.imdbVotes && (
                <div className="watch-stat">
                  <span className="watch-stat-label">IMDb votes</span>
                  <span className="watch-stat-value">{media.imdbVotes}</span>
                </div>
              )}
              {isTvSeries && (media as TvSeries).numberOfEpisodes != null && (
                <div className="watch-stat">
                  <span className="watch-stat-label">Episodes</span>
                  <span className="watch-stat-value">
                    {(media as TvSeries).numberOfEpisodes}
                  </span>
                </div>
              )}
              {!isTvSeries && budget != null && budget > 0 && (
                <div className="watch-stat">
                  <span className="watch-stat-label">Budget</span>
                  <span className="watch-stat-value">${formatMoney(budget)}</span>
                </div>
              )}
              {media.release_date && (
                <div className="watch-stat">
                  <span className="watch-stat-label">Released</span>
                  <span className="watch-stat-value">
                    {new Date(media.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default MediaInfo;
