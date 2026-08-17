import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Media } from "../../models/Movie";
import { HeartIcon, BookmarkIcon, Play, Star } from "lucide-react";
import { toggleFavorite, toggleWatchlist } from "../../services/MediaCardService";
import "./MediaCard.css";
import { Tooltip } from "@mui/material";
import { CustomToast } from "../shared/Toast";
import { MediaImage } from "../shared/MediaImage";

interface MediaCardProps {
  mediaInfo: Media;
  href: string;
  isFav: boolean;
  isWatch: boolean;
  stateHandler?: (id: any, type: any, action?: 'add' | 'remove') => void;
  isLoggedIn?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ mediaInfo, href, isFav, isWatch, stateHandler, isLoggedIn }) => {
  const { title, posterUrl, rating, releaseYear, originalLanguage } = mediaInfo;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(isFav);
  const [isInWatchList, setIsInWatchList] = useState(isWatch);
  const [toastOpen, setToastOpen] = useState(false);
  const [isOddRatio, setIsOddRatio] = useState(false);

  useEffect(() => {
    setIsFavorite(isFav);
    setIsInWatchList(isWatch);
  }, [isFav, isWatch]);

  useEffect(() => {
    setImageLoaded(false);
    setIsOddRatio(false);

    if (!posterUrl) {
      setImageUrl("");
      setImageLoaded(true);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageUrl(posterUrl);
      // Most posters are a clean 2:3. Anything else gets letterboxed over a
      // blurred copy of itself rather than cropped, so nothing important
      // (titles, faces) is cut off.
      setIsOddRatio(Math.abs(img.width / img.height - 2 / 3) > 0.02);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageUrl("");
      setImageLoaded(true);
    };
    img.src = posterUrl;
  }, [posterUrl]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isLoggedIn) {
        setIsFavorite(!isFavorite);
      }

      const res = await toggleFavorite(mediaInfo.id, mediaInfo.mediaType, setIsFavorite);

      if (stateHandler && isLoggedIn) {
        stateHandler(mediaInfo.id, "favourites", res ? 'add' : 'remove');
      }
    } catch (e) {
      setIsFavorite(!isFavorite);
      setToastOpen(true);
    }
  };

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isLoggedIn) {
        setIsInWatchList(!isInWatchList);
      }

      const res = await toggleWatchlist(mediaInfo.id, mediaInfo.mediaType, setIsInWatchList);

      if (stateHandler && isLoggedIn) {
        stateHandler(mediaInfo.id, "watchlist", res ? 'add' : 'remove');
      }
    } catch (e) {
      setIsInWatchList(!isInWatchList);
      setToastOpen(true);
    }
  };

  const genres = mediaInfo?.genreList?.length ? mediaInfo.genreList.slice(0, 2).join(" · ") : null;
  const ratingLabel = rating ? rating.toFixed(1) : null;

  if (!imageLoaded) {
    return (
      <div className="media-card media-card-skeleton" aria-hidden="true">
        <div className="media-card-poster-wrap" />
      </div>
    );
  }

  return (
    <>
      <CustomToast open={toastOpen} setOpen={setToastOpen} />
      <Link to={href} className="media-card" aria-label={title || "Untitled"}>
        <div className="media-card-poster-wrap">
          {isOddRatio && (
            <div
              className="media-card-backdrop"
              style={{ backgroundImage: `url(${imageUrl})` }}
              aria-hidden="true"
            />
          )}

          <MediaImage
            src={imageUrl}
            alt=""
            kind="poster"
            label={title}
            className={`media-card-poster ${isOddRatio ? "is-contained" : ""}`}
          />

          <div className="media-card-scrim" aria-hidden="true" />

          <div className="media-card-actions">
            <Tooltip title={isFavorite ? "Remove from favourites" : "Add to favourites"}>
              <button
                type="button"
                className={`media-card-action ${isFavorite ? "is-active is-fav" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
                aria-pressed={isFavorite}
              >
                <HeartIcon size={17} />
              </button>
            </Tooltip>

            <Tooltip title={isInWatchList ? "Remove from watchlist" : "Add to watchlist"}>
              <button
                type="button"
                className={`media-card-action ${isInWatchList ? "is-active is-watch" : ""}`}
                onClick={handleWatchlistClick}
                aria-label={isInWatchList ? "Remove from watchlist" : "Add to watchlist"}
                aria-pressed={isInWatchList}
              >
                <BookmarkIcon size={17} />
              </button>
            </Tooltip>
          </div>

          <span className="media-card-play" aria-hidden="true">
            <Play size={20} fill="currentColor" />
          </span>

          <div className="media-card-info">
            <h3 className="media-card-title">{title || "Untitled"}</h3>

            <div className="media-card-meta">
              {ratingLabel && (
                <span className="media-card-rating">
                  <Star size={12} fill="currentColor" strokeWidth={0} />
                  {ratingLabel}
                </span>
              )}
              {releaseYear && <span>{releaseYear}</span>}
              {originalLanguage && <span className="media-card-lang">{originalLanguage.toUpperCase()}</span>}
            </div>

            {genres && <div className="media-card-genres">{genres}</div>}
          </div>
        </div>
      </Link>
    </>
  );
};
