import React, { useState, useEffect } from "react";
import { Background } from "./components/Background";
import VideoPlayer from "./components/VideoPlayer";
import { MediaType, ImdbMedia, TvSeries, Media } from "../../models/Movie";
import {
  fetchImdbMedia,
  fetchMedia,
  fetchTvSeries,
} from "../../services/MediaService";
import PrimarySearchAppBar from "../main/SearchMUI_EXPERIMENTAL";
import MediaInfo from "./components/MediaInfo";

export class SeasonEpisode {
  season: string = "1";
  episode: string = "1";

  constructor(season: string, episode: string) {
    this.season = season;
    this.episode = episode;
  }
}

const WatchPage: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id")!;
  const season = queryParams.get("s");
  // const episode = queryParams.get("e");
  const mediaType = season == null ? MediaType.MOVIE : MediaType.TV_SERIES;

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

  const [seasonEpisode, setSeasonEpisode] = useState<SeasonEpisode>(new SeasonEpisode("1","1"));

  return (
    <>
      <Background url={bgUrl} />
      <PrimarySearchAppBar onClick={handleSearch} />
      {/* <MovieList mediaList={medias} /> */}
      <VideoPlayer
        id={id}
        mediaType={mediaType}
        season={seasonEpisode?.season ?? null} // Keep the actual value
        episode={seasonEpisode?.episode ?? null}
      />
      <MediaInfo media={media!} setSeasonEpisode={setSeasonEpisode}></MediaInfo>
    </>
  );
};

export default WatchPage;
