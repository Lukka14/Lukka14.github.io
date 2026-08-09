import React, { Dispatch, useEffect, useState } from "react";
import { ImdbMedia, TvSeries, MediaType, Season, Movie } from "../../../models/Movie";
import { SeasonEpisode } from "../WatchPage";
import { convertMinutes, fetchAllPages, formatMoney } from "../../../utils/Utils";
import { BookmarkIcon, Clapperboard, Clock3, Globe, HeartIcon, Star, Tv } from "lucide-react";
import axios from "axios";
import { Endpoints } from "../../../config/Config";
import Cookies from "js-cookie";
import { toggleFavorite, toggleWatchlist } from "../../../services/MediaCardService";
import { CustomToast } from "../../shared/Toast";
import EpisodeCarousel from "./EpisodeCarousel/EpisodeCarousel";
import { getCurrentUser } from "../../../services/UserService";
import { useSearchParams } from "react-router-dom";

interface MediaInfoProps {
  media: ImdbMedia | TvSeries | null;
  setSeasonEpisode: (seasonEpisode: SeasonEpisode) => void;
  isPlaying: boolean,
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
}

interface Episode {
  id: number;
  tvSeriesId: number;
  name: string;
  airDate: string;
  overview: string;
  stillPath: string;
  runtime: number;
  seasonNumber: number;
  episodeNumber: number;
}

const MediaInfo: React.FC<MediaInfoProps> = ({ media, setSeasonEpisode, isPlaying, setIsPlaying }) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryParams] = useSearchParams();
  const seasonFromQuery = Number(queryParams.get("s"));
  const episodeFromQuery = Number(queryParams.get("e"));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    async function userFetch() {
      setIsLoggedIn(!!(await getCurrentUser())?.username);
    }
    userFetch();
  }, []);

  useEffect(() => {
    if (media && media.mediaType === MediaType.TV_SERIES) {
      const tvSeason = (media as TvSeries).seasonList?.find(
        (season) => season.seasonNumber === seasonFromQuery
      );
      if (tvSeason) {
        setSelectedSeason(tvSeason);
        // Set the first episode of season 1 as default
        setSelectedEpisode(episodeFromQuery || 1);
        if (tvSeason.seasonNumber !== undefined) {
          setSeasonEpisode(new SeasonEpisode(tvSeason.seasonNumber, episodeFromQuery || 1));
          loadEpisodes(media.id, tvSeason.seasonNumber);
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

  const loadEpisodes = async (seriesId?: number | null, seasonNumber?: number) => {
    if (!seriesId || seasonNumber === undefined) return;

    setLoading(true);
    try {
      const response = await axios.get(`${Endpoints.EPISODES}?id=${seriesId}&seasonNumber=${seasonNumber}`);
      if (response.data) {
        setEpisodes(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSeasonClick = (season: Season) => {
    setSelectedSeason(season);
    setSelectedEpisode(null); // Reset the episode selection when season is clicked
    if (season.seasonNumber !== undefined && media.id) {
      loadEpisodes(media.id, season.seasonNumber);
    }
  };

  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
    setSelectedEpisode(episodeNumber); // Set the selected episode
    setSeasonEpisode(new SeasonEpisode(seasonNumber, episodeNumber)); // Notify parent component about the selected episode
    window.scrollTo(0, 0);
    setIsPlaying(true)
  };

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
              {media.imdbId && media.imdbRating && (
                <a
                  href={`https://www.imdb.com/title/${media.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-chip watch-chip--rating"
                  title="View on IMDb"
                >
                  <Star size={14} fill="currentColor" />
                  {media.imdbRating}
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

        {selectedSeason && (
          <div className="watch-episodes">
            {episodes.length > 0 ? (
              <EpisodeCarousel
                episodes={episodes}
                selectedEpisode={selectedEpisode}
                onEpisodeClick={handleEpisodeClick}
                seasonNumber={selectedSeason.seasonNumber}
                seasonName={selectedSeason.name}
                media={media}
                selectedSeason={selectedSeason}
                handleSeasonClick={handleSeasonClick}
                loading={loading}
              />
            ) : (
              <div className="watch-empty-note">
                No episode data available for this season.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MediaInfo;
