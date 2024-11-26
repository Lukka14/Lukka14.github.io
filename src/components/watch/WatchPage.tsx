import React, { useState, useEffect } from "react";
import { Background } from "./Background";
import VideoPlayer from "./VideoPlayer";
import { MediaType, ImdbMedia, TvSeries } from "../../models/Movie";
import { fetchImdbMedia, fetchTvSeries } from "../../services/MediaService";

const WatchPage: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id")!;
  const mediaType = queryParams.get("m") as MediaType;
  const season = queryParams.get("s");
  const episode = queryParams.get("e");

  // State to store media and bgUrl
  const [state, setState] = useState<{ media: ImdbMedia | TvSeries | null; bgUrl: string }>({
    media: null,
    bgUrl: "https://i.pinimg.com/originals/e5/d7/42/e5d7426b911e35aa1e517c52d56b984b.jpg", // Default bgUrl
  });

  useEffect(() => {
    const fetchData = () => {
      // Fetching data synchronously here, but it still handles promises inside the function
      let data: ImdbMedia | TvSeries | null = null;
      const fetchAsyncData = async () => {
        try {
          if (mediaType === MediaType.MOVIE) {
            data = await fetchImdbMedia(id);
          } else if (mediaType === MediaType.TV_SERIES) {
            data = await fetchTvSeries(id);
          }

          // Decide final bgUrl based on fetched data
          const finalBgUrl =
            data?.backDropUrl ||
            // "https://i.pinimg.com/originals/e5/d7/42/e5d7426b911e35aa1e517c52d56b984b.jpg";
            "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true";

          // Set both media and bgUrl once data is fetched
          setState({ media: data, bgUrl: finalBgUrl });
        } catch (err) {
          console.error(err);
        }
      };

      fetchAsyncData(); // Execute the async function
    };

    fetchData(); // Run fetchData function when the component mounts or dependencies change
  }, [id, mediaType]); // Dependencies: when `id` or `mediaType` changes, fetch new data

  // Destructure the state object
  const { media, bgUrl } = state;

  return (
    <>
      <Background url={bgUrl}></Background>
      <VideoPlayer
        id={id}
        mediaType={mediaType}
        season={season}
        episode={episode}
      ></VideoPlayer>
    </>
  );
};

export default WatchPage;
