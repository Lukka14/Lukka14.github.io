import React, { useState, useEffect } from "react";
import { ImdbMedia, Media, Season, TvSeries } from "../../../models/Movie";
import { ListOrdered } from "lucide-react";

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

    const carouselStyles = `
  .episodes-carousel-container {
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .episodes-carousel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .episodes-carousel-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: white;
    font-family: 'Roboto', sans-serif;
  }

  .episodes-carousel-controls {
    display: flex;
    gap: 10px;
  }

  .episodes-carousel-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(23, 162, 184, 0.3);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: #fff;
  }

  .episodes-carousel-button:hover:not(:disabled) {
    background-color: rgba(23, 162, 184, 0.6);
  }

  .episodes-carousel-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .episodes-carousel-track-container {
    overflow: visible;
  }

  .episodes-carousel-track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .episode-card {
    flex: 0 0 ${100 / cardsPerView}%;
    padding: 0 8px;
    box-sizing: border-box;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    margin-bottom: 15px;
  }
  
  .episode-card-inner {
    position: relative;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 2px solid transparent;
  }
  
  .episode-card-inner:hover {
    transform: none;
    box-shadow: none;
    border: 2px solid #17a2b8;
  }

  .episode-card-inner.selected {
    border: 2px solid #17a2b8;
  }
  
  .episode-number {
    background-color: rgba(23, 162, 184, 0.8);
    color: white;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.75rem;
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 1;
  }
      .episode-runtime {
    background-color: rgba(23, 162, 184, 0.8);
    color: white;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.75rem;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1;
  }
  
  .episode-title {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 10px;
    color: white;
  }
  
  .episode-image {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  @media (max-width: 992px) {
    .episode-card {
      flex: 0 0 ${100 / Math.min(3, cardsPerView)}%;
    }
  }

  @media (max-width: 768px) {
    .episode-card {
      flex: 0 0 ${100 / Math.min(2, cardsPerView)}%;
    }
    .episode-image {
      height: 90px;
    }
  }

  @media (max-width: 576px) {
    .episode-card {
      flex: 0 0 100%;
    }
    .episode-image {
      height: 120px;
    }
  }
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.custom-dropdown-button {
  background-color: transparent;
  border: 2px solid #f5f5f5;
  color: white;
  padding-left: 36px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  width: 100%;
  text-align: left;
  position: relative;
padding: 7px;
display: flex;
align-items: center;
  }

.custom-dropdown-button:hover,
.custom-dropdown-button:focus,
.custom-dropdown-button:active,
.show > .custom-dropdown-button {
  background-color: transparent;
  border: 2px solid #f5f5f5;
  color: white;
  box-shadow: none;
}

.custom-dropdown .icon-left {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.custom-dropdown-menu {
  background-color: #1a1a1a;
  min-width: 100%;
  border: none;
  border-radius: 0 0 6px 6px;
  padding: 0;
}

.custom-dropdown-menu .dropdown-item {
  color: #f5f5f5;
  font-size: 0.9rem;
  padding: 8px 16px;
}

.custom-dropdown-menu .dropdown-item:hover {
  background-color: #2a2a2a !important;
  color: #ffffff;
}


.icon-left, .icon-right {
  position: absolute;
  pointer-events: none;
  width: 16px;
  height: 16px;
  fill: #f5f5f5;
}

.icon-left {
  left: 10px;
}

.icon-right {
  right: 10px;
}

`;

    return (
        <>
            <style>{carouselStyles}</style>
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