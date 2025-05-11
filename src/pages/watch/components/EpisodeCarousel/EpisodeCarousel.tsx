import React, { useState, useEffect } from "react";
import { ImdbMedia, Media, Season, TvSeries } from "../../../../models/Movie";
import { ListOrdered } from "lucide-react";
import './EpisodeCarousel.css'

interface Episode {
  id: number;
  tvSeriesId: number;
  name: string;
  airDate: string;
  overview: string;
  stillPath: string;
  runtime: number;
  seasonNumber: number;
  episodeNumber: number;
}

interface EpisodeCarouselProps {
  episodes: Episode[];
  selectedEpisode: number | null;
  onEpisodeClick: (seasonNumber: number, episodeNumber: number) => void;
  seasonNumber?: number;
  seasonName?: string;
  selectedSeason?: Season;
  handleSeasonClick?: (season: Season) => void;
  media: ImdbMedia | TvSeries;
  loading?: boolean;
}

const EpisodeCarousel: React.FC<EpisodeCarouselProps> = ({
  episodes,
  selectedEpisode,
  onEpisodeClick,
  seasonNumber,
  seasonName,
  media,
  selectedSeason,
  handleSeasonClick,
  loading
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 411) setCardsPerView(1);
      else if (window.innerWidth < 668) setCardsPerView(2);
      else if (window.innerWidth < 992) setCardsPerView(3);
      else if (window.innerWidth < 1200) setCardsPerView(4);
      else setCardsPerView(5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = episodes.length - cardsPerView;

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - cardsPerView));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxIndex, prev + cardsPerView));
  };

  useEffect(() => {
    if (selectedEpisode !== null) {
      const selectedIndex = episodes.findIndex(ep => ep.episodeNumber === selectedEpisode);
      if (selectedIndex !== -1) {
        if (selectedIndex < startIndex || selectedIndex >= startIndex + cardsPerView) {
          let newStartIndex = selectedIndex - Math.floor(cardsPerView / 2);
          newStartIndex = Math.max(0, Math.min(maxIndex, newStartIndex));
          setStartIndex(newStartIndex);
        }
      }
    }
  }, [selectedEpisode, episodes, cardsPerView]);

  return (
    <>
      <div className="episodes-carousel-container">
        <div className="episodes-carousel-header">
          <div className="dropdown custom-dropdown">
            <button
              className="btn dropdown-toggle custom-dropdown-button"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <ListOrdered style={{
                width: "16px",
                marginRight: "9px"
              }} />
              {selectedSeason ? `Season ${selectedSeason.seasonNumber}` : 'Select Season'}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark custom-dropdown-menu">
              {(media as TvSeries).seasonList
                ?.filter(season =>
                  season.seasonNumber !== 0 &&
                  !season.name?.toLowerCase().includes('special') &&
                  (season.episodeCount === undefined || season.episodeCount > 0)
                )
                .map((season, index) => (
                  <li key={season.id}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSeasonClick?.(season)}
                    >
                      Season {index + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </div>


          <div className="episodes-carousel-controls">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="episodes-carousel-button"
              aria-label="Previous episodes"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= maxIndex || maxIndex <= 0}
              className="episodes-carousel-button"
              aria-label="Next episodes"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
        <div className="episodes-carousel-track-container" style={{
          position: "relative"
        }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div
            className="episodes-carousel-track"
            style={{
              transform: `translateX(-${startIndex * (100 / cardsPerView)}%)`,
              opacity: loading ? 0.5 : 1
            }}
          >
            {episodes.map((episode) => (
              <div key={episode.id} className="episode-card">
                <div
                  className={`episode-card-inner ${selectedEpisode === episode.episodeNumber ? 'selected' : ''}`}
                  onClick={() => seasonNumber !== undefined && onEpisodeClick(seasonNumber, episode.episodeNumber)}
                >
                  <span className="episode-number">EP {episode.episodeNumber}</span>
                  <span className="episode-runtime">{episode.runtime} min</span>
                  <img
                    src={episode.stillPath || "https://via.placeholder.com/300x170?text=No+Image"}
                    alt={`Episode ${episode.episodeNumber}`}
                    className="episode-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/300x170?text=No+Image";
                    }}
                  />
                  <p className="episode-title" title={episode.name}>
                    {episode.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EpisodeCarousel;