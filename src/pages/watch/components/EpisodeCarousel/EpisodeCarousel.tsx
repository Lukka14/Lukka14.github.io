import React, { useState, useEffect, Dispatch } from "react";
import { ImdbMedia, Media, Season, TvSeries } from "../../../../models/Movie";
import { ListOrdered } from "lucide-react";
import { EpisodeCard } from "../EpisodeCard/EpisodeCard";
import './EpisodeCarousel.css';

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
  loading,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 411) setCardsToShow(1);
      else if (window.innerWidth < 668) setCardsToShow(2);
      else if (window.innerWidth < 992) setCardsToShow(3);
      else if (window.innerWidth < 1200) setCardsToShow(4);
      else setCardsToShow(5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = episodes.length - cardsToShow;

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - cardsToShow));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxIndex, prev + cardsToShow));
  };

  useEffect(() => {
    if (selectedEpisode !== null) {
      const selectedIndex = episodes.findIndex(ep => ep.episodeNumber === selectedEpisode);
      if (selectedIndex !== -1) {
        if (selectedIndex < startIndex || selectedIndex >= startIndex + cardsToShow) {
          let newStartIndex = selectedIndex - Math.floor(cardsToShow / 2);
          newStartIndex = Math.max(0, Math.min(maxIndex, newStartIndex));
          setStartIndex(newStartIndex);
        }
      }
    }
  }, [selectedEpisode, episodes, cardsToShow]);



  return (
    <>
      <div className="episodes-container">
        <div className="episodes-header">
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
          <div className="episodes-controls">
            <button onClick={handlePrev} disabled={startIndex === 0} className="episodes-button">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button onClick={handleNext} disabled={startIndex >= maxIndex} className="episodes-button">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="episodes-track-container" style={{
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
            className="episodes-track"
            style={{
              transform: `translateX(-${startIndex * (100 / cardsToShow)}%)`

            }}
          >

            {episodes.map((episode) => {
              return <div
                key={episode.id}
                className="episode-card"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <EpisodeCard episode={episode} isSelected={episode.episodeNumber == selectedEpisode} onClick={onEpisodeClick} />
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default EpisodeCarousel;