import React from "react";
import { Media, MediaType } from "../../models/Movie";
import { useNavigate } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface MovieCarouselProps {
  mediaList: Media[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ mediaList }) => {
  const navigate = useNavigate();

  return (
    <div style={{ width: "95%", margin: "0 auto", marginTop:'10px' , fontFamily: "Roboto" }}> {/* Centering the carousel */}
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
            onClick={ () => {
              let url = `/watch?id=${media.id}`;

              if (media.mediaType === MediaType.TV_SERIES) {
                let s = '1';
                let e = '1';

                document.cookie.split(';').forEach(cookie => {
                  const [name, value] = cookie.trim().split('=');
                  if (name === `${media.id}` && value) {
                    const sMatch = value.match(/[?&]s=(\d+)/);
                    const eMatch = value.match(/[?&]e=(\d+)/);

                    if (sMatch?.[1]) s = sMatch[1];
                    if (eMatch?.[1]) e = eMatch[1];
                  }
                });

                url += `&s=${s}&e=${e}`;
              }

              navigate(url);
            }}
            style={{ cursor: "pointer" }}
            key={index}
          >
            <img alt="sample_file" src={media.backDropUrl} />
            <div className="legend" style={{ backgroundColor: "rgba(0,0,0,0.1)", fontSize: "1.5vw" }}>
                <div>{media.title}</div>
                <div>⭐ {media.rating ? media.rating.toFixed(1) : "N/A"}</div>
                <div>{media.genreList?.join(' | ')}</div>
                <div>{media.releaseDate?.split('-')[0]}</div>
            </div>
          
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
