import React from "react";
import { Media } from "../../models/Movie";

interface MediaCardProps {
  mediaInfo: Media;
  href: string; // The link to navigate to
}

const WithBG = ({ text }: { text: string }): React.ReactElement => {
  return (
    <div
      className="card-text text-white-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

export const MediaCard: React.FC<MediaCardProps> = ({ mediaInfo, href }) => {
  const { title, posterUrl, rating, releaseDate, originalLanguage } = mediaInfo;

  return (
    <a href={href} className="text-decoration-none">
      <div
        className="card h-100 border-0 shadow-lg position-relative media-card"
        style={{ cursor: "pointer" }}
      >
        {/* Poster */}
        <div
          className="image-container"
          style={{
            width: "100%",
            aspectRatio: "3 / 4",
            backgroundImage: `url(${posterUrl || "default-poster.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#000",
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
          <WithBG text={mediaInfo?.genreList?.join(" | ") || "N/A"} />
          <WithBG text={originalLanguage?.toUpperCase() || "N/A"} />
        </div>
      </div>
    </a>
  );
};
