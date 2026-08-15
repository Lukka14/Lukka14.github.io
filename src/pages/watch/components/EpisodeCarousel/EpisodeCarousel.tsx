import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ImdbMedia, Season, TvSeries } from "../../../../models/Movie";
import { ChevronLeft, ChevronRight, Eye, EyeOff, ListOrdered } from "lucide-react";
import { EpisodeCard } from "../EpisodeCard/EpisodeCard";
import './EpisodeCarousel.css';

const SPOILER_STORAGE_KEY = "mp:hideEpisodeSpoilers";

const readSpoilerPreference = (): boolean => {
  try {
    return localStorage.getItem(SPOILER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

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
  media,
  selectedSeason,
  handleSeasonClick,
  loading,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const [hideSpoilers, setHideSpoilers] = useState(readSpoilerPreference);
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const seasonButtonRef = useRef<HTMLButtonElement>(null);
  const seasonMenuRef = useRef<HTMLUListElement>(null);

  const toggleSpoilers = () => {
    setHideSpoilers((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SPOILER_STORAGE_KEY, String(next));
      } catch {
        /* storage unavailable (private mode) — keep the in-memory state */
      }
      return next;
    });
  };

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

  const maxIndex = Math.max(0, (Math.ceil(episodes.length / cardsToShow) - 1) * cardsToShow);

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

  const handleSeasonClickWrapper = (season: Season) => {
    setStartIndex(0);
    setSeasonMenuOpen(false);
    handleSeasonClick?.(season);
  };

  /* The menu is portalled to <body> with fixed positioning: any ancestor with
     overflow:hidden (like .episodes-container) would otherwise clip long season
     lists, and the height is capped to whatever space the viewport actually has. */
  const positionSeasonMenu = useCallback(() => {
    const button = seasonButtonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const gap = 8;
    const margin = 12;
    const spaceBelow = window.innerHeight - rect.bottom - gap - margin;
    const spaceAbove = rect.top - gap - margin;
    const openUpwards = spaceBelow < 200 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(160, Math.min(340, openUpwards ? spaceAbove : spaceBelow));
    const width = Math.max(rect.width, 230);
    const left = Math.min(
      Math.max(margin, rect.right - width),
      window.innerWidth - width - margin
    );

    setMenuStyle({
      position: 'fixed',
      left,
      top: openUpwards ? undefined : rect.bottom + gap,
      bottom: openUpwards ? window.innerHeight - rect.top + gap : undefined,
      width,
      maxHeight,
    });
  }, []);

  useEffect(() => {
    if (!seasonMenuOpen) return;

    positionSeasonMenu();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        seasonMenuRef.current?.contains(target) ||
        seasonButtonRef.current?.contains(target)
      ) {
        return;
      }
      setSeasonMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSeasonMenuOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', positionSeasonMenu);
    window.addEventListener('scroll', positionSeasonMenu, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', positionSeasonMenu);
      window.removeEventListener('scroll', positionSeasonMenu, true);
    };
  }, [seasonMenuOpen, positionSeasonMenu]);

  const seasons = useMemo(
    () =>
      (media as TvSeries).seasonList?.filter(
        (season) =>
          season.seasonNumber !== 0 &&
          !season.name?.toLowerCase().includes('special') &&
          (season.episodeCount === undefined || season.episodeCount > 0)
      ) ?? [],
    [media]
  );

  const totalPages = Math.max(1, Math.ceil(episodes.length / cardsToShow));
  const currentPage = Math.floor(startIndex / cardsToShow) + 1;

  return (
    <div className="episodes-container">
      <div className="episodes-header">
        <div className="episodes-heading">
          <h3 className="episodes-title">Episodes</h3>
          {episodes.length > 0 && (
            <span className="episodes-count">{episodes.length} total</span>
          )}
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button"
            className={`spoiler-toggle${hideSpoilers ? ' is-active' : ''}`}
            onClick={toggleSpoilers}
            aria-pressed={hideSpoilers}
            title={
              hideSpoilers
                ? 'Episode thumbnails are blurred — click to show them'
                : 'Blur episode thumbnails to avoid spoilers'
            }
          >
            {hideSpoilers ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="spoiler-toggle-text">
              {hideSpoilers ? 'Spoilers hidden' : 'Hide spoilers'}
            </span>
          </button>

          <div className={`season-select${seasonMenuOpen ? ' show' : ''}`}>
            <button
              className="btn season-select-btn"
              type="button"
              ref={seasonButtonRef}
              onClick={() => setSeasonMenuOpen((open) => !open)}
              aria-expanded={seasonMenuOpen}
              aria-haspopup="listbox"
            >
              <ListOrdered size={17} />
              <span className="season-select-label">Season</span>
              {selectedSeason ? selectedSeason.seasonNumber : 'Select'}
            </button>
            {seasonMenuOpen &&
              createPortal(
                <ul
                  className="season-select-menu"
                  ref={seasonMenuRef}
                  style={menuStyle}
                  role="listbox"
                >
                  {seasons.map((season) => (
                    <li key={season.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={
                          season.seasonNumber === selectedSeason?.seasonNumber
                        }
                        className={`season-option${
                          season.seasonNumber === selectedSeason?.seasonNumber
                            ? ' is-selected'
                            : ''
                        }`}
                        onClick={() => handleSeasonClickWrapper(season)}
                      >
                        {/* Label from seasonNumber, not the filtered array index — specials
                            are filtered out, so an index would drift from the real season. */}
                        <span>Season {season.seasonNumber}</span>
                        {season.episodeCount != null && (
                          <span className="season-option-meta">
                            {season.episodeCount} ep
                            {season.episodeCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>,
                document.body
              )}
          </div>

          {episodes.length > cardsToShow && (
            <div className="episodes-controls">
              <span className="episodes-page-indicator">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="episodes-button"
                aria-label="Previous episodes"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= maxIndex}
                className="episodes-button"
                aria-label="Next episodes"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="episodes-track-container">
        {loading && (
          <div className="episodes-loading-overlay">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <div
          className="episodes-track"
          style={{
            transform: `translateX(-${startIndex * (100 / cardsToShow)}%)`,
          }}
        >
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="episode-slide"
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <EpisodeCard
                episode={episode}
                isSelected={episode.episodeNumber === selectedEpisode}
                hideSpoilers={hideSpoilers}
                onClick={onEpisodeClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodeCarousel;
