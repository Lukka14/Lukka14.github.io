import React from "react";
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

  return (
    <div style={{ width: "95%", margin: "0 auto", marginTop: '10px', fontFamily: "Roboto" }}> {/* Centering the carousel */}
      <Carousel
        dynamicHeight={true}
        centerMode={true}
        showStatus={false}
        infiniteLoop={true}
        autoFocus={true}
        centerSlidePercentage={80}
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
              <h2 className="movie-title">{media.title} ({media.releaseYear ?? "N/A"})</h2>
              <p className="movie-description">{media.overview || 'No description available.'}</p>
              <div className="movie-meta">
                <div className="movie-rating">
                  <span>{media.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="rating-label">Rating</span>
                </div>

                {media.genreList?.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
