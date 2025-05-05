import React, { useState, useEffect } from "react";
import { Media, MediaType } from "../../models/Movie";
import { HeartIcon, BookmarkIcon } from "lucide-react";
import { checkIsFavorite, checkIsInWatchlist, toggleFavorite, toggleWatchlist } from "../../services/MediaCardService";
import "./MediaCard.css";
import { Tooltip } from "@mui/material";

interface MediaCardProps {
  mediaInfo: Media;
  href: string;
  isFav: boolean;
  isWatch: boolean;
}

const WithBG = ({ text }: { text: string }): React.ReactElement => {
  return <div className="text-white-50 text-center forMb">{text}</div>;
};

export const MediaCard: React.FC<MediaCardProps> = ({ mediaInfo, href, isFav, isWatch }) => {
  const { title, posterUrl, rating, releaseYear, originalLanguage } = mediaInfo;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(isFav);
  const [isInWatchList, setIsInWatchList] = useState(isWatch);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(isFav);
    setIsInWatchList(isWatch);
  }, [isFav, isWatch]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setImageLoaded(false);

    if (!posterUrl) {
      setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019");
      setImageLoaded(true);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageUrl(posterUrl);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019");
      setImageLoaded(true);
    };
    img.src = posterUrl;
  }, [posterUrl]);

  const getDisplayGenres = () => {
    if (!mediaInfo?.genreList || mediaInfo.genreList.length === 0) {
      return null;
    }

    if (windowWidth <= 576) {
      const limitedGenres = mediaInfo.genreList.slice(0, 2);
      return <WithBG text={limitedGenres.join(" | ")} />;
    } else {
      return <WithBG text={mediaInfo.genreList.join(" | ")} />;
    }
  };

  const handleFavoriteClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavouriteLoading(true);
    try {
      const newStatus = await toggleFavorite(mediaInfo.id, mediaInfo.mediaType);
      setIsFavorite(newStatus);
    } finally {
      setIsFavouriteLoading(false);
    }
  };

  const handleWatchlistClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWatchlistLoading(true);
    try {
      const newStatus = await toggleWatchlist(mediaInfo.id, mediaInfo.mediaType);
      setIsInWatchList(newStatus);
    } finally {
      setIsWatchlistLoading(false);
    }
  };

  return (
    <a href={href} className="text-decoration-none media-card-link">
      <div className={`card h-100 border-0 shadow-lg position-relative media-card ${!imageLoaded ? 'skeleton-card' : ''}`}
        style={{
          background: "black"
        }}>
        {!imageLoaded ? (
          <>
            <div className="skeleton-image"></div>
            <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
              <div className="skeleton-title"></div>
              <div className="skeleton-rating"></div>
              <div className="skeleton-year"></div>
              <div className="skeleton-genre"></div>
              <div className="skeleton-language"></div>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div className="skeleton-badge"></div>
              <div className="skeleton-badge"></div>
            </div>
          </>
        ) : (
          <>
            <div
              className="image-container fade-in"
              style={{
                backgroundImage: `url(${imageUrl})`
              }}
            >
              <div style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 2,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Tooltip title={isFavorite ? "Remove from favourites" : "Add to favourites"}>
                  <div style={{ opacity: isFavouriteLoading ? 0.5 : 1, pointerEvents: isFavouriteLoading ? 'none' : 'auto' }}>
                    <HeartIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isFavorite || isFavouriteLoading ? isHeartHovered ? "none" : "orange" : isHeartHovered ? "orange" : "none",
                        stroke: "#FFD580",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={handleFavoriteClick}
                      onMouseEnter={() => setIsHeartHovered(true)}
                      onMouseLeave={() => setIsHeartHovered(false)}
                    />
                  </div>
                </Tooltip>
              </div>

              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 2,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Tooltip title={isInWatchList ? "Remove from watchlist" : "Add to watchlist"}>
                  <div style={{ opacity: isWatchlistLoading ? 0.5 : 1, pointerEvents: isWatchlistLoading ? 'none' : 'auto' }}>
                    <BookmarkIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isInWatchList || isWatchlistLoading ? isBookmarkHovered ? "none" : "#00BFFF" : isBookmarkHovered ? "#00BFFF" : "none",
                        stroke: "#87CEFA",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onClick={handleWatchlistClick}
                      onMouseEnter={() => setIsBookmarkHovered(true)}
                      onMouseLeave={() => setIsBookmarkHovered(false)}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>

            <div className={`card-img-overlay d-flex flex-column justify-content-center align-items-center overlay-text`}>
              <div style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 2,
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Tooltip title={isFavorite ? "Remove from favourites" : "Add to favourites"}>
                  <div style={{ opacity: isFavouriteLoading ? 0.5 : 1, pointerEvents: isFavouriteLoading ? 'none' : 'auto' }}>
                    <HeartIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isFavorite || isFavouriteLoading ? isHeartHovered ? "none" : "orange" : isHeartHovered ? "orange" : "none",
                        stroke: "#FFD580",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={handleFavoriteClick}
                      onMouseEnter={() => setIsHeartHovered(true)}
                      onMouseLeave={() => setIsHeartHovered(false)}
                    />
                  </div>
                </Tooltip>
              </div>

              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 2,
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Tooltip title={isInWatchList ? "Remove from watchlist" : "Add to watchlist"}>
                  <div style={{ opacity: isWatchlistLoading ? 0.5 : 1, pointerEvents: isWatchlistLoading ? 'none' : 'auto' }}>
                    <BookmarkIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isInWatchList || isWatchlistLoading ? isBookmarkHovered ? "none" : "#00BFFF" : isBookmarkHovered ? "#00BFFF" : "none",
                        stroke: "#87CEFA",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onClick={handleWatchlistClick}
                      onMouseEnter={() => setIsBookmarkHovered(true)}
                      onMouseLeave={() => setIsBookmarkHovered(false)}
                    />
                  </div>
                </Tooltip>
              </div>

              <h5 className="card-title text-center text-white">
                {title || "Untitled"}
              </h5>
              <p className="card-rating text-white">
                ⭐ {rating ? rating.toFixed(1) : "N/A"}
              </p>
              <p className="card-year text-white-50">
                {releaseYear ? releaseYear : "N/A"}
              </p>
              {getDisplayGenres()}
              <WithBG text={originalLanguage?.toUpperCase() || "N/A"} />
            </div>

            <div className="card-footer text-white d-flex justify-content-between align-items-center">
              <div className="rating-badge">
                <span className="imdb-star">⭐</span> {rating ? rating.toFixed(1) : "N/A"}
              </div>
              <div className="year-badge">
                {releaseYear ? releaseYear : "N/A"}
              </div>
            </div>
          </>
        )}
      </div>
    </a>
  );
};