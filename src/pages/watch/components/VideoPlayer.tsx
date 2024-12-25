import React, { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { VideoPlayerProps } from "../../../models/VidePlayerProps";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  playerUrl,
  mediaType,
  season,
  episode,
  posterURL
}) => {
  const [isPlaying, setIsPlaying] = useState(false); // State to toggle between poster and iframe

  playerUrl = playerUrl
    .replace("{id}", id)
    .replace("{season}", season.toString())
    .replace("{episode}", episode.toString());

  const mediaURL = playerUrl;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <>
      <MDBContainer breakpoint="xl">
        <div className="ratio ratio-16x9" style={{ position: "relative" }}>
          {!isPlaying ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${posterURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              onClick={handlePlay}
            >
              {/* Optional Play Button Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  padding: "10px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="white"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.268 1.438a.5.5 0 0 1 .518-.04l10 6a.5.5 0 0 1 0 .884l-10 6A.5.5 0 0 1 4 14.5V1.5a.5.5 0 0 1 .268-.062z" />
                </svg>
              </div>
            </div>
          ) : (
            <iframe
              // testing, if it breaks the video player, remove the sandbox attribute
              sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"

              src={mediaURL}
              title="Vimeo video"
              allowFullScreen
              style={{ border: 0, width: "100%", height: "100%" }}
            ></iframe>
          )}
        </div>
      </MDBContainer>
    </>
  );
};

export default VideoPlayer;
