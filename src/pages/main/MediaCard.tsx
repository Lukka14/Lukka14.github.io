import React, { useState, useEffect } from "react";
import { Media } from "../../models/Movie";
import "./MediaCard.css";

interface MediaCardProps {
  mediaInfo: Media;
  href: string;
}

const WithBG = ({ text }: { text: string }): React.ReactElement => {
  return (
    <div className="text-white-50 text-center forMb">
      {text}
    </div>
  );
};

export const MediaCard: React.FC<MediaCardProps> = ({ mediaInfo, href }) => {
  const { title, posterUrl, rating, releaseYear, originalLanguage } = mediaInfo;
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const getDisplayGenres = () => {
    if (!mediaInfo?.genreList || mediaInfo.genreList.length === 0) {
      return null;
    }
    
    if (windowWidth <= 576) {
      const limitedGenres = mediaInfo.genreList.slice(0, 2);
      return <WithBG text={limitedGenres.join(" | ")} />;
    } else {
      return <WithBG text={mediaInfo.genreList.join(" | ")} />;
    }
  };

  return (
    <a href={href} className="text-decoration-none media-card-link">
      <div
        className={`card h-100 border-0 shadow-lg position-relative media-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="image-container"
          style={{
            backgroundImage: `url(${posterUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019"})`
          }}
        >
          <div className={`darken-overlay ${isHovered ? 'visible' : ''}`}></div>
        </div>

        <div className={`card-img-overlay d-flex flex-column justify-content-center align-items-center overlay-text ${isHovered ? 'visible' : ''}`}>
          <h5 className="card-title text-center text-white">
            {title || "Untitled"}
          </h5>
          <p className="card-rating text-white">
            ⭐ {rating ? rating.toFixed(1) : "N/A"}
          </p>
          <p className="card-year text-white-50">
            {releaseYear ? releaseYear : "N/A"}
          </p>
          {getDisplayGenres()}
          <WithBG text={originalLanguage?.toUpperCase() || "N/A"} />
        </div>

        <div className="card-footer text-white d-flex justify-content-between align-items-center">
          <div className="rating-badge">
            <span className="imdb-star">⭐</span> {rating ? rating.toFixed(1) : "N/A"}
          </div>
          <div className="year-badge">
            {releaseYear ? releaseYear : "N/A"}
          </div>
        </div>
      </div>
    </a>
  );
};