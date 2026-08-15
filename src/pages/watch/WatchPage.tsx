import React, { useState, useEffect } from "react";
import { Background } from "./components/Background";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { MediaType, ImdbMedia, TvSeries, ReleaseStatus } from "../../models/Movie";
import { fetchMovie, fetchTvSeries } from "../../services/MediaService";
import PrimarySearchAppBar from "../shared/TopNavBar";
import MediaInfo from "./components/MediaInfo";
import CastSection from "./components/CastSection";
import EpisodeSection from "./components/EpisodeSection";
import StreamingServerSelector from "./components/StreamingServerSelector";
import { Server } from "./models/Server";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveRecentlyWatched, saveResumePoint } from "../shared/RecentlyWatchService";
import MoviesCarouselV2 from "./components/MovieCarouselV2/MoviesCarouselV2";
import NotFoundPage from "../shared/NotFoundPage";
import { CalendarDays } from "lucide-react";
import { ChevronLeft, ChevronRight, Shuffle, X } from "lucide-react";
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
  const [sandboxed, setSandboxed] = useState(false);

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

  const availableSeasons =
    mediaType === MediaType.TV_SERIES
      ? ((media as TvSeries | null)?.seasonList?.filter(
        (tvSeason) =>
          tvSeason.seasonNumber !== undefined &&
          tvSeason.seasonNumber !== 0 &&
          !tvSeason.name?.toLowerCase().includes("special") &&
          (tvSeason.episodeCount === undefined || tvSeason.episodeCount > 0)
      ) ?? [])
      : [];

  const sortedSeasons = [...availableSeasons].sort(
    (a, b) => (a.seasonNumber ?? 0) - (b.seasonNumber ?? 0)
  );

  const currentSeasonIndex = sortedSeasons.findIndex(
    (tvSeason) => tvSeason.seasonNumber === seasonEpisode.season
  );
  const currentSeason = currentSeasonIndex >= 0 ? sortedSeasons[currentSeasonIndex] : null;
  const currentEpisodeCount = currentSeason?.episodeCount ?? 0;
  const isLastEpisodeInSeason =
    currentEpisodeCount > 0 && seasonEpisode.episode >= currentEpisodeCount;
  const nextSeason = currentSeasonIndex >= 0 ? sortedSeasons[currentSeasonIndex + 1] : null;
  const hasNextEpisode =
    mediaType === MediaType.TV_SERIES &&
    (currentEpisodeCount === 0 || !isLastEpisodeInSeason || Boolean(nextSeason));
  const hasPreviousEpisode =
    mediaType === MediaType.TV_SERIES && (seasonEpisode.episode ?? 1) > 1;

  // --- "Up next" prompt near the end of an episode -------------------------
  // Playback happens inside a third party iframe, so there is no reliable
  // currentTime to read. Progress is approximated by counting the seconds the
  // player has been active and comparing that with the episode runtime.
  const NEXT_EPISODE_PROMPT_SECONDS = 120;
  const [episodeRuntime, setEpisodeRuntime] = useState<number | null>(null);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [promptDismissed, setPromptDismissed] = useState(false);

  useEffect(() => {
    setWatchedSeconds(0);
    setPromptDismissed(false);
  }, [id, seasonEpisode.season, seasonEpisode.episode]);

  useEffect(() => {
    if (!isPlaying || mediaType !== MediaType.TV_SERIES) return;

    const interval = setInterval(() => {
      setWatchedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, mediaType, id, seasonEpisode.season, seasonEpisode.episode]);

  const runtimeSeconds = episodeRuntime ? episodeRuntime * 60 : null;
  const showNextEpisodePrompt =
    mediaType === MediaType.TV_SERIES &&
    hasNextEpisode &&
    isPlaying &&
    !promptDismissed &&
    runtimeSeconds !== null &&
    runtimeSeconds - watchedSeconds <= NEXT_EPISODE_PROMPT_SECONDS;

  const handlePreviousEpisode = () => {
    if (mediaType !== MediaType.TV_SERIES || !hasPreviousEpisode) return;
    updateSeasonEpisode(
      new SeasonEpisode(seasonEpisode.season, (seasonEpisode.episode ?? 1) - 1)
    );
    setIsPlaying(true);
  };

  const handleNextEpisode = () => {
    if (mediaType !== MediaType.TV_SERIES || !hasNextEpisode) return;

    if (currentEpisodeCount > 0 && isLastEpisodeInSeason && nextSeason?.seasonNumber) {
      updateSeasonEpisode(new SeasonEpisode(nextSeason.seasonNumber, 1));
    } else {
      updateSeasonEpisode(
        new SeasonEpisode(seasonEpisode.season, (seasonEpisode.episode ?? 1) + 1)
      );
    }

    setIsPlaying(true);
  };

  // Seasons with an unknown episode count can't be sampled safely, so a random
  // pick is only offered once at least one season has a usable count.
  const randomizableSeasons = sortedSeasons.filter(
    (tvSeason) => tvSeason.seasonNumber !== undefined && (tvSeason.episodeCount ?? 0) > 0
  );
  const hasRandomEpisode =
    mediaType === MediaType.TV_SERIES && randomizableSeasons.length > 0;

  const handleRandomEpisode = () => {
    if (!hasRandomEpisode) return;

    const pick = (): SeasonEpisode => {
      const tvSeason =
        randomizableSeasons[Math.floor(Math.random() * randomizableSeasons.length)];
      const episodeNumber = Math.floor(Math.random() * (tvSeason.episodeCount ?? 1)) + 1;
      return new SeasonEpisode(tvSeason.seasonNumber!, episodeNumber);
    };

    const totalEpisodes = randomizableSeasons.reduce(
      (sum, tvSeason) => sum + (tvSeason.episodeCount ?? 0),
      0
    );

    let next = pick();
    // Re-roll a few times so the button doesn't appear dead by landing on the
    // episode already playing. Pointless when there is only one to choose from.
    for (
      let attempt = 0;
      attempt < 5 &&
      totalEpisodes > 1 &&
      next.season === seasonEpisode.season &&
      next.episode === seasonEpisode.episode;
      attempt++
    ) {
      next = pick();
    }

    updateSeasonEpisode(next);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectServer = (server: Server) => {
    let url;

    if (mediaType === MediaType.MOVIE) {
      url = server.movie_url;
    } else {
      url = server.series_url;
    }

    setPlayerUrl(url);
    // Opt-in: current providers detect and reject any sandbox, so this stays
    // off unless a server explicitly sets "sandbox": true.
    setSandboxed(server.sandbox === true);
  };

  // The sandbox attribute only takes effect on load, so a change in sandbox
  // mode has to remount the iframe rather than patch it in place.
  const playerKey = `${id}-${seasonEpisode?.season}-${seasonEpisode?.episode}-${sandboxed}`;

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
                sandboxed={sandboxed}
              />

              {showNextEpisodePrompt && (
                <div className="watch-up-next">
                  <div className="watch-up-next-card">
                    <div className="watch-up-next-text">
                      <span className="watch-up-next-label">Up next</span>
                      <span className="watch-up-next-value">
                        {isLastEpisodeInSeason && nextSeason?.seasonNumber
                          ? `S${nextSeason.seasonNumber} · E1`
                          : `S${seasonEpisode.season} · E${seasonEpisode.episode + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="watch-next-ep-btn"
                      onClick={handleNextEpisode}
                    >
                      Play next
                      <ChevronRight size={14} />
                    </button>
                    <button
                      type="button"
                      className="watch-up-next-close"
                      onClick={() => setPromptDismissed(true)}
                      aria-label="Dismiss up next"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="watch-console">
              {media?.title && (
                <div className="watch-bar">
                  <h2 className="watch-bar-title">
                    <span>{media.title}</span>
                  </h2>
                  {mediaType === MediaType.TV_SERIES && (
                    <div className="watch-ep-actions">
                      <span className="watch-ep-badge">
                        S{seasonEpisode?.season} · E{seasonEpisode?.episode}
                      </span>
                      <button
                        type="button"
                        className="watch-next-ep-btn"
                        onClick={handlePreviousEpisode}
                        disabled={!hasPreviousEpisode}
                      >
                        <ChevronLeft size={14} />
                        Previous episode
                      </button>
                      <button
                        type="button"
                        className="watch-next-ep-btn"
                        onClick={handleNextEpisode}
                        disabled={!hasNextEpisode}
                      >
                        Next episode
                        <ChevronRight size={14} />
                      </button>
                      <button
                        type="button"
                        className="watch-next-ep-btn watch-random-ep-btn"
                        onClick={handleRandomEpisode}
                        disabled={!hasRandomEpisode}
                        title="Play a random episode"
                      >
                        <Shuffle size={14} />
                        Random episode
                      </button>
                    </div>
                  )}
                </div>
              )}

              <EpisodeSection
                media={media}
                setSeasonEpisode={updateSeasonEpisode}
                setIsPlaying={setIsPlaying}
                onEpisodeRuntimeChange={setEpisodeRuntime}
              />

              <StreamingServerSelector selectServer={selectServer} />
            </div>
          </>
        )}

        {media && <MediaInfo media={media} />}

        {media && <CastSection cast={media.cast} />}

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
