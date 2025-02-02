import React, { useState, useEffect } from "react";
import { Background } from "./components/Background";
import VideoPlayer from "./components/VideoPlayer";
import { MediaType, ImdbMedia, TvSeries, Media } from "../../models/Movie";
import { fetchImdbMedia, fetchTvSeries } from "../../services/MediaService";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import MediaInfo from "./components/MediaInfo";
import StreamingServerSelector from "./components/StreamingServerSelector";
import { Server } from "./models/Server";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { saveRecentlyWatched } from "../shared/RecentlyWatchService";

export class SeasonEpisode {
  season: number = 1;
  episode: number = 1;

  constructor(season: number, episode: number) {
    this.season = season;
    this.episode = episode;
  }
}

const WatchPage: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.hash.split("?")[1]); // Use `window.location.hash` for HashRouter
  const id = queryParams.get("id")!;
  const season = queryParams.get("s");
  const episode = Number(queryParams.get("e"));
  const mediaType = season == null ? MediaType.MOVIE : MediaType.TV_SERIES;

  // console.log("id:", id);
  // console.log("season:", season);
  // console.log("episode:", episode);
  // console.log("mediaType:", mediaType);

  const [state, setState] = useState<{
    media: ImdbMedia | TvSeries | null;
    bgUrl: string;
  }>({
    media: null,
    bgUrl:
      "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: ImdbMedia | TvSeries | null = null;

        if (mediaType === MediaType.MOVIE) {
          data = await fetchImdbMedia(id);
        } else if (mediaType === MediaType.TV_SERIES) {
          data = await fetchTvSeries(id);
        }

        const finalBgUrl =
          data?.backDropUrl ||
          "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true";

        setState({ media: data, bgUrl: finalBgUrl });
      } catch (err) {
        console.error(err);
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

  const [playerUrl, setPlayerUrl] = useState<string>("");

  const selectServer = (server: Server) => {
    let url;

    if (mediaType === MediaType.MOVIE) {
      url = server.movie_url;
    } else {
      url = server.series_url;
    }

    setPlayerUrl(url);
  };

  if (media != null && (mediaType === MediaType.TV_SERIES || mediaType === MediaType.MOVIE)) {
    saveRecentlyWatched(media!);
  }

  return (
    <>
      <Background url={bgUrl} />
      <PrimarySearchAppBar onClick={() => {}} displaySearch={false} />
      {/* <MovieList mediaList={medias} /> */}
      <VideoPlayer
        id={id}
        playerUrl={playerUrl}
        mediaType={mediaType}
        season={seasonEpisode?.season ?? null} // Keep the actual value
        episode={seasonEpisode?.episode ?? null}
        posterURL={state.bgUrl}
      />
      <StreamingServerSelector
        selectServer={selectServer}
      ></StreamingServerSelector>
      <MediaInfo
        media={media!}
        setSeasonEpisode={updateSeasonEpisode}
      ></MediaInfo>
    </>
  );
};

export default WatchPage;
