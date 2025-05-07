import React, { useEffect, useState } from "react";
import { ImdbMedia, TvSeries, MediaType, Season, Movie } from "../../../models/Movie";
import { SeasonEpisode } from "../WatchPage";
import { ClassNames } from "@emotion/react";
import { convertMinutes, fetchAllPages, formatMoney } from "../../../utils/Utils";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import axios from "axios";
import { Endpoints } from "../../../config/Config";
import Cookies from "js-cookie";
import { toggleFavorite, toggleWatchlist } from "../../../services/MediaCardService";
import { Snackbar, SnackbarCloseReason, Tooltip } from "@mui/material";
import { CustomToast } from "../../shared/Toast";

interface MediaInfoProps {
  media: ImdbMedia | TvSeries | null;
  setSeasonEpisode: (seasonEpisode: SeasonEpisode) => void;
}

const styles = `
@media (max-width: 767.98px) {
  .resHeader {
    margin-top: 1.5rem;
  }
}`

const MediaInfo: React.FC<MediaInfoProps> = ({ media, setSeasonEpisode }) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isBookmarkIconHovered, setIsBookmarkIconHovered] = useState(false);
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const queryParams = new URLSearchParams(window.location.hash.split("?")[1]); // Use `window.location.hash` for HashRouter
  const seasonFromQuery = Number(queryParams.get("s"));
  const episodeFromQuery = Number(queryParams.get("e"));

  useEffect(() => {
    if (media && media.mediaType === MediaType.TV_SERIES) {

      const tvSeason = (media as TvSeries).seasonList?.find(
        (season) => season.seasonNumber === seasonFromQuery
      );
      if (tvSeason) {
        setSelectedSeason(tvSeason);
        // Set the first episode of season 1 as default
        setSelectedEpisode(1);
        if (tvSeason.seasonNumber !== undefined) {
          setSeasonEpisode(new SeasonEpisode(tvSeason.seasonNumber, episodeFromQuery || 1));
          setSelectedEpisode(episodeFromQuery);
        }
      }
    }
  }, [media]);

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
      setIsFavorite(!isFavorite);
      const newStatus = await toggleFavorite(media?.id, media?.mediaType);
      setIsFavorite(newStatus);
    } catch (e) {
      setIsFavorite(!isFavorite);
      setToastOpen(true);
    }
  };

  const handleWatchlistClick = async () => {
    try {
      setIsInWatchList(!isInWatchList);
      const newStatus = await toggleWatchlist(media?.id, media?.mediaType);
      setIsInWatchList(newStatus);
    } catch (e) {
      setIsInWatchList(!isInWatchList);
      setToastOpen(true);
    }
  };

  if (!media) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Unable to display media information. Please try again later.
        </div>
      </div>
    );
  }

  const isTvSeries = media.mediaType === MediaType.TV_SERIES;
  const genres = media.genreList?.join(", ") || "Unknown";

  const handleSeasonClick = (season: Season) => {
    setSelectedSeason(season);
    setSelectedEpisode(null); // Reset the episode selection when season is clicked
  };

  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
    setSelectedEpisode(episodeNumber); // Set the selected episode
    setSeasonEpisode(new SeasonEpisode(seasonNumber, episodeNumber)); // Notify parent component about the selected episode
  };

  const textClass = "text-light fw-bold";

  const runtime = (media as Movie).runtime;
  const budget = (media as Movie).budget;

  let hours = 0, minutes = 0;
  if (!isTvSeries && runtime) {
    ({ hours, minutes } = convertMinutes(runtime));
  }

  return (
    <>
      <CustomToast open={toastOpen} setOpen={setToastOpen} />

      <style>
        {styles}
      </style>
      <div className="container-xl" style={{ fontFamily: "Roboto" }}>
        <div
          className="card shadow-lg"
          style={{
            backgroundImage: `url(${media.backDropUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          <div
            className="card-body p-4"
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <div className="row">
              <div className="col-md-4">
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  className="img-fluid rounded shadow"
                />
              </div>
              <div className="col-md-8">
                <div className="d-flex align-items-center justify-content-between resHeader">
                  <h1 style={{ paddingTop: '0px' }} className="mb-0">{media.title}</h1>
                  <div className="d-flex align-items-center gap-3">
                    <Tooltip title={isFavorite ? "Remove from favourites" : "Add to favourites"}>
                      <HeartIcon
                        size={36}
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

                    <Tooltip title={isInWatchList ? "Remove from watchlist" : "Add to watchlist"}>
                      <BookmarkIcon
                        size={36}
                        style={{
                          cursor: "pointer",
                          fill: isInWatchList ? isBookmarkIconHovered ? "none" : "#00BFFF" : isBookmarkIconHovered ? "#00BFFF" : "none",
                          stroke: "#87CEFA",
                          transition: "all 0.2s ease-in-out"
                        }}
                        onClick={handleWatchlistClick}
                        onMouseEnter={() => setIsBookmarkIconHovered(true)}
                        onMouseLeave={() => setIsBookmarkIconHovered(false)}
                      />
                    </Tooltip>
                  </div>
                </div>

                <p className="text-muted">
                  ({media.originalLanguage?.toUpperCase()})
                </p>

                <p>
                  <span className={textClass}>Description:</span> <br />

                  <p className="text-light">
                    {media.overview}
                  </p>
                </p>
                <p>
                  <strong className={textClass}>Genres:</strong> {genres}
                </p>
                <p >
                  <strong className={textClass}>Release Year:</strong> {media.releaseYear ? new Date(media.releaseYear).getFullYear() : "N/A"}
                </p>
                {media.imdbId && (
                  <p>
                    <strong className={textClass}>IMDb: ⭐</strong>{" "}
                    <a
                      href={`https://www.imdb.com/title/${media.imdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warning"
                    >
                      {media.imdbRating} ({media.imdbVotes} votes)
                    </a>
                  </p>
                )}
                {isTvSeries && (
                  <>
                    <p>
                      <strong>Number of Seasons:</strong>{" "}
                      {(media as TvSeries).numberOfSeasons}
                    </p>
                    <p>
                      <strong>Number of Episodes:</strong>{" "}
                      {(media as TvSeries).numberOfEpisodes}
                    </p>
                    <div className="mt-4">
                      <h5>Seasons:</h5>
                      <div className="d-flex flex-wrap gap-3">
                        {(media as TvSeries).seasonList?.map((season) =>
                          season.episodeCount == undefined || season.episodeCount > 0 ? (
                            <button
                              key={season.id}
                              className={`btn btn-outline-warning ${selectedSeason?.id === season.id ? "active" : ""
                                }`}
                              onClick={() => handleSeasonClick(season)}
                              style={{
                                border: selectedSeason?.id === season.id ? "2px solid orange" : "2px solid rgba(255, 165, 0, 0.5)", // Orange border when unselected
                                backgroundColor: selectedSeason?.id === season.id ? "orange" : "transparent",
                                color: selectedSeason?.id === season.id ? "black" : "",
                              }}
                            >
                              {season.name}
                            </button>
                          ) : null
                        )}
                      </div>
                    </div>
                    {selectedSeason && (
                      <div className="mt-4">
                        <h5>Episodes in {selectedSeason.name}</h5>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.from(
                            { length: selectedSeason.episodeCount || 0 },
                            (_, index) => (
                              <button
                                key={index}
                                className={`btn btn-outline-info ${selectedEpisode === index + 1 ? "active" : ""
                                  }`}
                                onClick={() => selectedSeason?.seasonNumber && handleEpisodeClick(selectedSeason.seasonNumber, index + 1)}
                                style={{
                                  border: selectedEpisode === index + 1 ? "2px solid #17a2b8" : "2px solid rgba(23, 162, 184, 0.5)", // Cyan border when unselected
                                  backgroundColor: selectedEpisode === index + 1 ? "#17a2b8" : "transparent",
                                  color: selectedEpisode === index + 1 ? "black" : "",
                                }}
                              >
                                {index + 1}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {!isTvSeries && (
                  <>
                    <p>
                      <strong>Duration:</strong>{" "}
                      {runtime ? (
                        <>
                          {hours > 0 && <>{hours} Hours </>}
                          {minutes > 0 && <>{minutes} Minutes</>}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p>
                      <strong>Budget:</strong> {budget ? <>${formatMoney(budget)}</> : "N/A"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaInfo;