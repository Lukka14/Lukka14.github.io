import React from "react";
import { Media } from "../../models/Movie";
import { useNavigate } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface MovieCarouselProps {
  mediaList: Media[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ mediaList }) => {
  const navigate = useNavigate();

  return (
    <div style={{ width: "80%", margin: "0 auto", marginTop:'10px' }}> {/* Centering the carousel */}
      <Carousel
        dynamicHeight={true}
        centerMode={true}
        showStatus={false}
        infiniteLoop={true}
        autoFocus={true}
        centerSlidePercentage={80}
        showArrows={true}
      >
        {mediaList.map((media, index) => (
          <div
            className="slide"
            onClick={() => navigate(`/watch?id=${media.id}`)}
            style={{ cursor: "pointer" }}
            key={index}
          >
            <img alt="sample_file" src={media.backDropUrl} />
            <p className="legend" style={{ backgroundColor: "rgba(0,0,0,0.1)", fontSize: "1.5vw" }}>
                <div>{media.title}</div>
                <div>⭐ {media.rating ? media.rating.toFixed(1) : "N/A"}</div>
                <div>{media.genreList?.join(' | ')}</div>
                <div>{media.releaseDate?.split('-')[0]}</div>
            </p>
          
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
