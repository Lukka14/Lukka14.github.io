import React, { useState, useEffect } from "react";
import { Background } from "./components/Background";
import VideoPlayer from "./components/VideoPlayer";
import { MediaType, ImdbMedia, TvSeries, Media } from "../../models/Movie";
import {
  fetchImdbMedia,
  fetchMedia,
  fetchTvSeries,
} from "../../services/MediaService";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import MediaInfo from "./components/MediaInfo";

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

  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  const [seasonEpisode, setSeasonEpisode] = useState<SeasonEpisode>(
    new SeasonEpisode(1, episode!)
  );

  return (
    <>
      <Background url={bgUrl} />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      {/* <MovieList mediaList={medias} /> */}
      <VideoPlayer
        id={id}
        mediaType={mediaType}
        season={seasonEpisode?.season ?? null} // Keep the actual value
        episode={seasonEpisode?.episode ?? null}
        posterURL={state.bgUrl}
      />
      <MediaInfo media={media!} setSeasonEpisode={setSeasonEpisode}></MediaInfo>
    </>
  );
};

export default WatchPage;
