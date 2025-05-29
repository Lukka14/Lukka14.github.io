import React, { useState, useEffect } from "react";
import { Media, MediaType } from "../../../models/Movie";
import { useNavigate } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Cookies from "js-cookie";
import './MovieCarousel.css';

interface MovieCarouselProps {
  mediaList: Media[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ mediaList }) => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 700);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getGenresToShow = (genreList: string[] | undefined) => {
    if (!genreList) return [];

    if (isSmallScreen) {
      return genreList.slice(0, 2);
    } else if (window.innerWidth <= 768) {
      return genreList.slice(0, 2);
    } else {
      return genreList;
    }
  };

  return (
    <div style={{ width: !isSmallScreen ? "95%" : "100%", margin: "0 auto", marginTop: '10px', fontFamily: "Roboto" }}>
      <Carousel
        dynamicHeight={true}
        centerMode={true}
        showStatus={false}
        infiniteLoop={true}
        autoFocus={true}
        centerSlidePercentage={!isSmallScreen ? 80 : 90}
        autoPlay={true}
      >
        {mediaList.map((media, index) => (
          <div
            className="slide"
            onClick={() => {
              let url = `/watch?id=${media.id}`;

              if (media.mediaType === MediaType.TV_SERIES) {
                if (media.mediaType === MediaType.TV_SERIES) {
                  let cookieValue = Cookies.get(String(media?.id));
                  if (cookieValue) {
                    url += cookieValue;
                  } else {
                    url += `&s=${1}&e=${1}`;
                  }
                }
              }

              navigate(url)
            }}
            style={{ cursor: "pointer" }}
            key={index}
          >
            <div className="image-overlay"></div>
            <img alt="sample_file" src={media.backDropUrl} />
            <div className="movie-content">
              {isSmallScreen ? (
                <>
                  <div className="movie-content-top">
                    <div className="movie-rating-mobile">
                      <span className="rating-label-mobile">⭐</span>
                      <span className="rating-mobile-label">{media.rating?.toFixed(1) || 'N/A'}</span>
                    </div>

                    <div className="genres-mobile">
                      {getGenresToShow(media.genreList).map((genre, index) => (
                        <span key={index} className="genre-tag-mobile">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="movie-content-bottom">
                    <h2 className="movie-title">{media.title} ({media.releaseYear ?? "N/A"})</h2>
                    <p className="movie-description">{media.overview ? media.overview?.length > 120 ? media.overview?.substring(0, 120) + "..." : media.overview : 'No description available.'}</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="movie-title">{media.title} ({media.releaseYear ?? "N/A"})</h2>
                  <p className="movie-description">{media.overview ? media.overview?.length > 170 ? media.overview?.substring(0, 170) + "..." : media.overview : 'No description available.'}</p>
                  <div className="movie-meta">
                    <div className="movie-rating">
                      <span>{media.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="rating-label">Rating</span>
                    </div>

                    {getGenresToShow(media.genreList).map((genre, index) => (
                      <span key={index} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieCarousel;