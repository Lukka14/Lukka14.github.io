import React, { useState, useEffect } from "react";
import { Background } from "./components/Background";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { MediaType, ImdbMedia, TvSeries, Media, Movie } from "../../models/Movie";
import { fetchMovie, fetchTvSeries, fetchFullMovieInfo } from "../../services/MediaService";
import PrimarySearchAppBar from "../shared/TopNavBar";
import MediaInfo from "./components/MediaInfo";
import StreamingServerSelector from "./components/StreamingServerSelector";
import { Server } from "./models/Server";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { saveRecentlyWatched } from "../shared/RecentlyWatchService";
import MoviesCarouselV2 from "./components/MovieCarouselV2/MoviesCarouselV2";
import NotFoundPage from "../shared/NotFoundPage";
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
  const queryParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const id = queryParams.get("id")!;
  const season = queryParams.get("s");
  const episode = Number(queryParams.get("e"));
  const mediaType = season == null ? MediaType.MOVIE : MediaType.TV_SERIES;
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [releaseDate, setReleaseDate] = useState<string | null>(null);
  const [playerUrl, setPlayerUrl] = useState<string>("");

  const [state, setState] = useState<{
    media: ImdbMedia | TvSeries | null;
    bgUrl: string;
  }>({
    media: null,
    bgUrl:
      "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true",
  });

  const checkIfUpcoming = (releaseDate: string): boolean => {
    const release = new Date(releaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return release > today;
  };

  const getDaysUntilRelease = (releaseDate: string): number => {
    const release = new Date(releaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((release.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
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

          try {
            const fullInfo = await fetchFullMovieInfo(id);
            if (fullInfo?.release_date) {
              setReleaseDate(fullInfo.release_date);
              const upcoming = checkIfUpcoming(fullInfo.release_date);
              setIsUpcoming(upcoming);
            }
          } catch (error) {
            console.error(error);
          }
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

    const cookieName = String(media?.id);
    Cookies.set(cookieName, seasonAndEpisodeString, { expires: 30 }); // Expires in 30 days
    // alert("Cookie saved!");
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

  if (
    media != null &&
    (mediaType === MediaType.TV_SERIES || mediaType === MediaType.MOVIE)
  ) {
    saveRecentlyWatched(media!);
  }

  if (loadingFinished && notFound) return <NotFoundPage />;

  const renderPlayerSkeleton = () => {
    return (
      <div className="container-xl">
        <div className="ratio ratio-16x9" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, #2c2c2c 25%, #3c3c3c 50%, #2c2c2c 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton-loading 1.5s infinite"
            }}
          />
        </div>
      </div>
    );
  };

  const renderUpcomingBanner = () => {
    const daysUntil = releaseDate ? getDaysUntilRelease(releaseDate) : 0;
    const releaseFormatted = releaseDate ? new Date(releaseDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

    return (
      <div className="container-xl">
        <div
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "0px 0px 16px 16px",
            padding: "3rem 2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(13, 26, 63, 0.3)"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              animation: "float 20s infinite linear"
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 2rem",
                background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>

            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "1rem",
              lineHeight: "1.2"
            }}>
              Coming Soon
            </h1>

            <h2 style={{
              fontSize: "1.8rem",
              fontWeight: "400",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "2rem",
              lineHeight: "1.3"
            }}>
              {media?.title}
            </h2>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "2rem",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <div style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "0.5rem"
              }}>
                Release Date
              </div>

              <div style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: "white",
                marginBottom: "1rem"
              }}>
                {releaseFormatted}
              </div>

              {daysUntil > 0 && (
                <div style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.15)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  fontSize: "1.1rem",
                  color: "white",
                  fontWeight: "500"
                }}>
                  {daysUntil} day{daysUntil !== 1 ? 's' : ''} to go
                </div>
              )}
            </div>

            <p style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.7)",
              margin: "0",
              lineHeight: "1.6"
            }}>
              This {mediaType === MediaType.MOVIE ? 'movie' : 'series'} hasn't been released yet.<br />
              Add it to your watchlist!
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Background url={bgUrl} />
      <PrimarySearchAppBar onClick={() => { }} displaySearch={false} />

      {!loadingFinished ? (
        renderPlayerSkeleton()
      ) : isUpcoming ? (
        renderUpcomingBanner()
      ) : (
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
      )}

      <StreamingServerSelector
        selectServer={selectServer}
      ></StreamingServerSelector>
      <MediaInfo
        media={media!}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setSeasonEpisode={updateSeasonEpisode}
      ></MediaInfo>

      <div className="container-xl">
        {media?.similar && (
          <div
            className="row"
            style={{
              margin: "auto",
              padding: "24px",
              marginTop: "24px",
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="col-12">
              <MoviesCarouselV2
                similarMovies={media.similar}
                title="Recommended"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WatchPage;
