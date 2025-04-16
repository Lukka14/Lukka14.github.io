import React, { useEffect, useState } from 'react';
import { Media } from '../../../models/Movie';
import { MediaCard } from '../../main/MediaCard';
import { generateHref } from '../../../utils/Utils';

const carouselStyles = `
  .similar-movies-container {
    width: 100%;
    position: relative;
    }

  .similar-movies-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .similar-movies-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: white;
    font-family: 'Roboto', sans-serif;
  }

  .similar-movies-controls {
    display: flex;
    gap: 10px;
  }

  .similar-movies-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
    color: #fff;
  }

  .similar-movies-button:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .similar-movies-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .similar-movies-track-container {
    overflow: hidden;
  }

  .similar-movies-track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .similar-movie-card {
    flex: 0 0 auto;
    padding: 0 10px;
    box-sizing: border-box;
  }

  @media (max-width: 992px) {
    .similar-movie-card {
      width: 33.33%;
    }
  }

  @media (max-width: 768px) {
    .similar-movie-card {
      width: 50%;
    }
  }

  @media (max-width: 576px) {
    .similar-movie-card {
      width: 100%;
    }
  }
`;

interface SimilarMoviesCarouselProps {
  similarMovies: Media[];
  title?: string;
}

const MoviesCarouselV2: React.FC<SimilarMoviesCarouselProps> = ({
  similarMovies,
  title = "Similar Movies"
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(5);
  // const [textSize, setTextSize] = useState("fs-2")

  const updateCardsToShow = () => {
    const width = window.innerWidth;
    if (width < 411) setCardsToShow(1);
    else if (width < 668) setCardsToShow(2);
    else if (width < 992) setCardsToShow(3);
    else if (width < 1200) setCardsToShow(4);
    else setCardsToShow(5);
  };

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const maxIndex = Math.max(0, similarMovies.length - cardsToShow);

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  if (!similarMovies || similarMovies.length === 0) return null;

  return (
    <>
      <style>{carouselStyles}</style>
      <div className="similar-movies-container">
        <div className="similar-movies-header">
          <h2 className="similar-movies-title">{title}</h2>
          <div className="similar-movies-controls">
            <button onClick={handlePrev} disabled={startIndex === 0} className="similar-movies-button">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button onClick={handleNext} disabled={startIndex >= maxIndex} className="similar-movies-button">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="similar-movies-track-container">
          <div
            className="similar-movies-track"
            style={{
              transform: `translateX(-${startIndex * (100 / cardsToShow)}%)`,
            }}
          >
            {similarMovies.map((movie) => (
              <div
                key={movie.id}
                className="similar-movie-card"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <MediaCard
                  mediaInfo={{
                    title: movie.title,
                    posterUrl: movie.posterUrl,
                    rating: movie.rating,
                    releaseYear: movie.releaseYear,
                    backDropUrl: movie.backDropUrl,
                    originalLanguage: movie.originalLanguage,
                    genreList: movie.genreList
                  }}
                  href={generateHref(movie)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesCarouselV2;