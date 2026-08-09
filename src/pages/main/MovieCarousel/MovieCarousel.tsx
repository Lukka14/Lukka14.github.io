import React, { useEffect, useRef, useState } from "react";
import { Media, MediaType } from "../../../models/Movie";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./MovieCarousel.css";

interface MovieCarouselProps {
  title: string;
  description: string;
  mediaList: Media[];
}

const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019";

const DRAG_THRESHOLD = 60;

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  description,
  mediaList,
}) => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(5);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const didDrag = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 411) setCardsToShow(1);
      else if (width < 668) setCardsToShow(2);
      else if (width < 992) setCardsToShow(3);
      else if (width < 1200) setCardsToShow(4);
      else setCardsToShow(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [mediaList, cardsToShow]);

  const buildWatchUrl = (media: Media) => {
    let url = `/watch?id=${media.id}`;

    if (media.mediaType === MediaType.TV_SERIES) {
      const cookieValue = Cookies.get(String(media.id));
      url += cookieValue ? cookieValue : "&s=1&e=1";
    }

    return url;
  };

  if (!mediaList || mediaList.length === 0) return null;

  const maxIndex = Math.max(
    0,
    (Math.ceil(mediaList.length / cardsToShow) - 1) * cardsToShow
  );

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + cardsToShow, maxIndex));
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - cardsToShow, 0));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) didDrag.current = true;
    setDragOffset(dx);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = dragOffset;
    setDragOffset(0);
    if (dx < -DRAG_THRESHOLD) handleNext();
    else if (dx > DRAG_THRESHOLD) handlePrev();
  };

  const visibleMedia = mediaList;

  return (
    <section className="movie-carousel-container">
      <div className="movie-carousel-header">
        <div>
          <p className="movie-carousel-kicker">{title}</p>
          <h2 className="movie-carousel-title">{description}</h2>
        </div>
        <div className="movie-carousel-controls">
          <span className="movie-carousel-count">
            {Math.floor(startIndex / cardsToShow) + 1} /{" "}
            {Math.ceil(mediaList.length / cardsToShow)}
          </span>
          <button
            type="button"
            className="movie-carousel-button"
            onClick={handlePrev}
            disabled={startIndex === 0}
            aria-label={`Previous ${title.toLowerCase()}`}
          >
            ‹
          </button>
          <button
            type="button"
            className="movie-carousel-button"
            onClick={handleNext}
            disabled={startIndex >= maxIndex}
            aria-label={`Next ${title.toLowerCase()}`}
          >
            ›
          </button>
        </div>
      </div>

      <div className="movie-carousel-track-container">
        <div
          className={`movie-carousel-track${isDragging.current ? " dragging" : ""}`}
          style={{
            transform: `translateX(calc(-${startIndex * (100 / cardsToShow)}% + ${dragOffset}px))`,
            transition: dragOffset !== 0 ? "none" : "transform 0.45s ease",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {visibleMedia.map((media) => (
            <div
              key={media.id || media.title}
              className="movie-carousel-card-wrap"
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <button
                type="button"
                className="movie-carousel-card"
                onClick={() => {
                  if (didDrag.current) return;
                  navigate(buildWatchUrl(media));
                }}
              >
                <img
                  src={media.posterUrl || media.backDropUrl || fallbackImage}
                  alt={media.title || "Featured title"}
                />
                <div className="movie-carousel-overlay">
                  <span className="movie-carousel-tag">
                    {media.mediaType === MediaType.TV_SERIES ? "Series" : "Movie"}
                  </span>
                  <div className="movie-carousel-copy">
                    <h3>{media.title || "Untitled"}</h3>
                    <p>
                      {media.releaseYear || "Now playing"}
                      {media.rating ? ` • ${media.rating.toFixed(1)}` : ""}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
