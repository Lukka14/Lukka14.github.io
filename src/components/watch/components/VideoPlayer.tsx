import React from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { Media, MediaType } from "../../../models/Movie";
import { VideoPlayerProps } from "../../../models/VidePlayerProps";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  mediaType,
  season,
  episode,
}) => {
  const mediaURL = getMediaURL({ id, mediaType, season, episode });
  
  // console.log("season, episode", season,episode)

  return (
    <>
      <MDBContainer breakpoint="xl">
        <div className="ratio ratio-16x9">
          <iframe src={mediaURL} title="Vimeo video" allowFullScreen></iframe>
        </div>
      </MDBContainer>
    </>
  );
};

const getMediaURL = (props: VideoPlayerProps): string => {
  const id = props.id;

  const autoPlay = true;

  switch (props.mediaType) {
    case MediaType.MOVIE:
      return `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=${autoPlay}`;
    case MediaType.TV_SERIES:
      return `https://vidsrc.cc/v2/embed/tv/${id}/${props.season}/${props.episode}?autoPlay=${autoPlay}`;
    default:
      return "";
  }
};

export default VideoPlayer;
