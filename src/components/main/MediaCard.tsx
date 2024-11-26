import React from "react";
import { Media } from "../../models/Movie";

interface MediaCardProps {
  mediaInfo: Media;
  onClick: (media: Media) => void;
}

const WithBG = ({ text }: { text: string }): React.ReactElement => {
  return (
    <div
      className="card-text text-white-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        padding: "4px 8px",
        borderRadius: "4px",
        // display: "flex", // Enables flexbox
        // justifyContent: "center", // Centers text horizontally
        //   alignItems: "center", // Centers text vertically
        //   height: "100%", // Ensures vertical centering works
        textAlign: "center", // Optional, ensures multi-line text is centered
      }}
    >
      {text}
    </div>
  );
};

export const MediaCard: React.FC<MediaCardProps> = ({ mediaInfo, onClick }) => {
  const { title, posterUrl, rating, releaseDate, originalLanguage } = mediaInfo;

  return (
    <div className="card h-100 border-0 shadow-lg position-relative media-card"  
    style={{ cursor: "pointer" }} 
    onClick={() => onClick(mediaInfo)}
    >
      {/* Poster */}
      <div
        className="image-container"
        style={{
          width: "100%",
          aspectRatio: "3 / 4", // Optional: Maintain a specific aspect ratio
          backgroundImage: `url(${posterUrl || "default-poster.jpg"})`,
          backgroundSize: "cover", // Ensures the image covers the container
          backgroundPosition: "center", // Centers the image
          backgroundRepeat: "no-repeat", // Prevents tiling
          backgroundColor: "#000", // Fallback color in case the image fails to load
        }}
      >
        {/* Darkening effect */}
        <div className="darken-overlay"></div>
      </div>

      {/* Overlay Text */}
      <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center overlay-text">
        <h5 className="card-title text-center text-white">
          {title || "Untitled"}
        </h5>
        <p className="card-text text-white-50">⭐ {rating || "N/A"}</p>
        <p className="card-text text-white-50">
          {releaseDate ? new Date(releaseDate).getFullYear() : "N/A"}
        </p>
        <WithBG text={mediaInfo?.genreList?.join(" | ") || "N/A"}></WithBG>
        <WithBG text={originalLanguage?.toUpperCase() || "N/A"} />
      </div>
    </div>
  );
};
