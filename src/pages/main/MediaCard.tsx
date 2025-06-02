import React, { useState, useEffect } from "react";
import { Media } from "../../models/Movie";
import { HeartIcon, BookmarkIcon } from "lucide-react";
import { toggleFavorite, toggleWatchlist } from "../../services/MediaCardService";
import "./MediaCard.css";
import { Tooltip } from "@mui/material";
import { CustomToast } from "../shared/Toast";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(isFav);
  const [isInWatchList, setIsInWatchList] = useState(isWatch);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(0);

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
      setImageAspectRatio(img.width / img.height);
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
      return <div className="text-center genre-list">{limitedGenres.join(" | ")}</div>
    } else {
      return <div className="text-center genre-list">{mediaInfo.genreList.join(" | ")}</div>
    }
  };

  const handleFavoriteClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isLoggedIn) {
        setIsFavorite(!isFavorite);
      }

      let res = await toggleFavorite(mediaInfo.id, mediaInfo.mediaType, setIsFavorite);

      if (stateHandler && isLoggedIn) {
        stateHandler(mediaInfo.id, "favourites", res ? 'add' : 'remove');
      }
    } catch (e) {
      setIsFavorite(!isFavorite);
      setToastOpen(true);
    }
  };

  const handleWatchlistClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isLoggedIn) {
        setIsInWatchList(!isInWatchList);
      }

      let res = await toggleWatchlist(mediaInfo.id, mediaInfo.mediaType, setIsInWatchList);

      if (stateHandler && isLoggedIn) {
        stateHandler(mediaInfo.id, "watchlist", res ? 'add' : 'remove');
      }
    } catch (e) {
      setIsInWatchList(!isInWatchList);
      setToastOpen(true);
    }
  };

  return (
    <>
      <CustomToast open={toastOpen} setOpen={setToastOpen} />
      <a href={href} className="text-decoration-none media-card-link">
        <div className={`card border-0 shadow-lg position-relative media-card ${!imageLoaded ? 'skeleton-card' : ''}`}
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
              <div className="image-container fade-in" style={{ position: "relative", overflow: "hidden" }}>
                <div
                  style={{
                    background: `url(${mediaInfo.posterUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(8px)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                  }}
                ></div>

                <img
                  src={imageUrl}
                  alt={title}
                  className="media-poster"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    ...(Math.abs(imageAspectRatio - 2 / 3) > 0.003
                      ? {
                        maskImage:
                          "linear-gradient(to bottom, transparent 0%, white 6%, white 94%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, transparent 0%, white 6%, white 94%, transparent 100%)",
                      }
                      : {}),
                  }}
                />


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
                    <HeartIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isFavorite ? isHeartHovered ? "none" : "orange" : isHeartHovered ? "orange" : "none",
                        stroke: "#FFD580",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={handleFavoriteClick}
                      onMouseEnter={() => setIsHeartHovered(true)}
                      onMouseLeave={() => setIsHeartHovered(false)}
                    />
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
                    <BookmarkIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isInWatchList ? isBookmarkHovered ? "none" : "#00BFFF" : isBookmarkHovered ? "#00BFFF" : "none",
                        stroke: "#87CEFA",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={handleWatchlistClick}
                      onMouseEnter={() => setIsBookmarkHovered(true)}
                      onMouseLeave={() => setIsBookmarkHovered(false)}
                    />
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
                    <HeartIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isFavorite ? isHeartHovered ? "none" : "orange" : isHeartHovered ? "orange" : "none",
                        stroke: "#FFD580",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={handleFavoriteClick}
                      onMouseEnter={() => setIsHeartHovered(true)}
                      onMouseLeave={() => setIsHeartHovered(false)}
                    />
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
                    <BookmarkIcon
                      size={26}
                      style={{
                        cursor: "pointer",
                        fill: isInWatchList ? isBookmarkHovered ? "none" : "#00BFFF" : isBookmarkHovered ? "#00BFFF" : "none",
                        stroke: "#87CEFA",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={handleWatchlistClick}
                      onMouseEnter={() => setIsBookmarkHovered(true)}
                      onMouseLeave={() => setIsBookmarkHovered(false)}
                    />
                  </Tooltip>
                </div>

                <h5 className="card-title text-center text-white">
                  {title || "Untitled"}
                </h5>
                <p className="card-rating text-white">
                  ⭐ {rating ? rating.toFixed(1) : "N/A"}
                </p>
                {getDisplayGenres()}
                <div className="text-white-50 text-center">{originalLanguage?.toUpperCase() || "N/A"}</div>
              </div>

              <div className="card-footer text-white d-flex justify-content-between align-items-center" style={{
                zIndex: 1
              }}>
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
      </a >
    </>
  );
};