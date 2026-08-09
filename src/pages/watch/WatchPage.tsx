import React, { useState, useEffect } from "react";
import { Background } from "./components/Background";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { MediaType, ImdbMedia, TvSeries, ReleaseStatus } from "../../models/Movie";
import { fetchMovie, fetchTvSeries } from "../../services/MediaService";
import PrimarySearchAppBar from "../shared/TopNavBar";
import MediaInfo from "./components/MediaInfo";
import EpisodeSection from "./components/EpisodeSection";
import StreamingServerSelector from "./components/StreamingServerSelector";
import { Server } from "./models/Server";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveRecentlyWatched, saveResumePoint } from "../shared/RecentlyWatchService";
import MoviesCarouselV2 from "./components/MovieCarouselV2/MoviesCarouselV2";
import NotFoundPage from "../shared/NotFoundPage";
import { CalendarDays } from "lucide-react";
import "./css/watch.css";

export class SeasonEpisode {
  season: number = 1;
  episode: number = 1;

  constructor(season: number, episode: number) {
    this.season = season;
    this.episode = episode;
  }
}

const WatchPage: React.FC = () => {
  const [queryParams] = useSearchParams();
  const id = queryParams.get("id")!;
  const season = queryParams.get("s");
  const episode = Number(queryParams.get("e"));
  const mediaType = season == null ? MediaType.MOVIE : MediaType.TV_SERIES;
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [playerUrl, setPlayerUrl] = useState<string>("");

  const [state, setState] = useState<{
    media: ImdbMedia | TvSeries | null;
    bgUrl: string;
  }>({
    media: null,
    bgUrl:
      "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true",
  });

  const getDaysUntilRelease = (releaseDate: string): number => {
    const release = new Date(releaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((release.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setNotFound(false);
      try {
        let data: ImdbMedia | TvSeries | null = null;

        if (mediaType === MediaType.MOVIE) {
          data = await fetchMovie(id);
        } else if (mediaType === MediaType.TV_SERIES) {
          data = await fetchTvSeries(id);
        }

        if (!data) {
          setNotFound(true);
        } else {
          const finalBgUrl =
            data.backDropUrl ||
            "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true";

          setState({ media: data, bgUrl: finalBgUrl });
          setIsUpcoming(data.releaseStatus === ReleaseStatus.UPCOMING);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoadingFinished(true);
      }
    };

    fetchData();
  }, [id, mediaType]);

  const { media, bgUrl } = state;

  const navigate = useNavigate();

  const updateSeasonEpisode = (seasonEpisode: SeasonEpisode) => {
    const seasonAndEpisodeString = `&s=${seasonEpisode.season}&e=${seasonEpisode.episode}`;
    const query = `/watch?id=${media?.id}${seasonAndEpisodeString}`;
    setSeasonEpisode(seasonEpisode);
    navigate(query);

    if (media?.id) {
      saveResumePoint(media.id, seasonEpisode.season, seasonEpisode.episode);
    }
  };

  const [seasonEpisode, setSeasonEpisode] = useState<SeasonEpisode>(
    new SeasonEpisode(1, episode!)
  );

  const selectServer = (server: Server) => {
    let url;

    if (mediaType === MediaType.MOVIE) {
      url = server.movie_url;
    } else {
      url = server.series_url;
    }

    setPlayerUrl(url);
  };

  const playerKey = `${id}-${seasonEpisode?.season}-${seasonEpisode?.episode}`;

  useEffect(() => {
    if (media != null) {
      saveRecentlyWatched(media);

      // Record the resume point on load too. Previously it was only written
      // when the user opened the season selector, so simply landing on an
      // episode from a link never updated where they left off.
      if (
        media.mediaType === MediaType.TV_SERIES &&
        seasonEpisode?.season &&
        seasonEpisode?.episode
      ) {
        saveResumePoint(media.id, seasonEpisode.season, seasonEpisode.episode);
      }
    }
  }, [media, seasonEpisode]);

  if (loadingFinished && notFound) return <NotFoundPage />;

  const renderUpcomingBanner = () => {
    const releaseDate = media?.release_date;
    const daysUntil = releaseDate ? getDaysUntilRelease(releaseDate) : 0;
    const releaseFormatted = releaseDate
      ? new Date(releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "";

    return (
      <div className="watch-upcoming">
        <div className="watch-upcoming-dots" />
        <div className="watch-upcoming-inner">
          <div className="watch-upcoming-icon">
            <CalendarDays size={40} />
          </div>

          <span className="watch-upcoming-kicker">Coming soon</span>
          <h1 className="watch-upcoming-title">{media?.title}</h1>

          {releaseFormatted && (
            <div className="watch-upcoming-date">
              <span className="watch-upcoming-date-label">Release date</span>
              <div className="watch-upcoming-date-value">{releaseFormatted}</div>
              {daysUntil > 0 && (
                <div className="watch-upcoming-countdown">
                  {daysUntil} day{daysUntil !== 1 ? "s" : ""} to go
                </div>
              )}
            </div>
          )}

          <p className="watch-upcoming-note">
            This {mediaType === MediaType.MOVIE ? "movie" : "series"} hasn't been
            released yet.
            <br />
            Add it to your watchlist and we'll keep it handy.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Background url={bgUrl} />
      <PrimarySearchAppBar onClick={() => { }} displaySearch={false} />

      <div className="container-xl watch-shell">
        {!loadingFinished ? (
          <div className="watch-stage">
            <div className="ratio ratio-16x9">
              <div className="watch-skeleton" />
            </div>
          </div>
        ) : isUpcoming ? (
          renderUpcomingBanner()
        ) : (
          <>
            <div className="watch-stage">
              <VideoPlayer
                key={playerKey}
                id={id}
                playerUrl={playerUrl}
                mediaType={mediaType}
                season={seasonEpisode?.season ?? null}
                episode={seasonEpisode?.episode ?? null}
                posterURL={state.bgUrl}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

            <div className="watch-console">
              {media?.title && (
                <div className="watch-bar">
                  <h2 className="watch-bar-title">
                    <span>{media.title}</span>
                    {mediaType === MediaType.TV_SERIES && (
                      <span className="watch-ep-badge">
                        S{seasonEpisode?.season} · E{seasonEpisode?.episode}
                      </span>
                    )}
                  </h2>
                </div>
              )}

              <EpisodeSection
                media={media}
                setSeasonEpisode={updateSeasonEpisode}
                setIsPlaying={setIsPlaying}
              />

              <StreamingServerSelector selectServer={selectServer} />
            </div>
          </>
        )}

        {media && <MediaInfo media={media} />}

        {media?.similar && media.similar.length > 0 && (
          <div className="watch-recommended">
            <MoviesCarouselV2 similarMovies={media.similar} title="Recommended" />
          </div>
        )}
      </div>
    </>
  );
};

export default WatchPage;
