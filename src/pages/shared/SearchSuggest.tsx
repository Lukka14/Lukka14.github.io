import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Media, MediaType } from "../../models/Movie";
import {
  fetchMedia,
  fetchOnlyMovies,
  fetchOnlyTvSeries,
} from "../../services/MediaService";
import { RoutePaths } from "../../config/Config";
import { getResumeQuery } from "./RecentlyWatchService";
import { MediaImage } from "./MediaImage";

export type SearchScope = "all" | "movie" | "tv";

const SUGGESTION_LIMIT = 8;
/** Short enough to feel live, long enough not to fire on every keystroke. */
const SUGGEST_DEBOUNCE_MS = 220;
const MIN_QUERY_LENGTH = 2;
/** Tallest the popup ever gets, matching the CSS max-height. */
const MAX_POPUP_HEIGHT = 352;
/** Below this much room, dropping down is not worth it. */
const MIN_POPUP_HEIGHT = 180;
const VIEWPORT_MARGIN = 16;

const fetchSuggestions = (query: string, scope: SearchScope): Promise<Media[]> => {
  if (scope === "movie") return fetchOnlyMovies(query, 1);
  if (scope === "tv") return fetchOnlyTvSeries(query, 1);
  return fetchMedia(query, 1);
};

export const buildWatchHref = (media: Media): string => {
  const seriesSuffix =
    media.mediaType === MediaType.TV_SERIES ? getResumeQuery(media.id) : "";
  return `${RoutePaths.WATCH}?id=${media.id}${seriesSuffix}`;
};

interface SearchSuggestProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired on submit and on Enter when no suggestion is highlighted. */
  onSubmit: (value: string) => void;
  /** Restricts suggestions to one media type. Defaults to everything. */
  scope?: SearchScope;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  /** Extra class on the wrapper, for page-specific sizing. */
  className?: string;
}

/**
 * Search input with a result-backed autocomplete popup. Suggestions come from
 * the same endpoints as the full search, so what is previewed here matches
 * what a submitted search returns.
 */
export const SearchSuggest: React.FC<SearchSuggestProps> = ({
  value,
  onChange,
  onSubmit,
  scope = "all",
  placeholder = "Search movies, series, people...",
  submitLabel = "Search",
  autoFocus = false,
  className = "",
}) => {
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<Media[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const requestIdRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [placement, setPlacement] = useState({
    dropUp: false,
    maxHeight: MAX_POPUP_HEIGHT,
  });

  useEffect(() => {
    const term = value.trim();

    if (term.length < MIN_QUERY_LENGTH) {
      requestIdRef.current++;
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const timer = window.setTimeout(() => {
      const requestId = ++requestIdRef.current;

      fetchSuggestions(term, scope)
        .then((items) => {
          if (requestId !== requestIdRef.current) return;

          const seen = new Set<number>();
          const usable = items.filter((item) => {
            // People have no watch page, and duplicate ids break the keys.
            if (!item.id || item.mediaType === MediaType.PERSON) return false;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });

          setSuggestions(usable.slice(0, SUGGESTION_LIMIT));
          setActiveIndex(-1);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setSuggestions([]);
        });
    }, SUGGEST_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, scope]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const goToMedia = (media: Media) => {
    setIsOpen(false);
    navigate(buildWatchHref(media));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      goToMedia(suggestions[activeIndex]);
    }
  };

  const showSuggestions = isOpen && suggestions.length > 0;

  /**
   * The box can sit anywhere on a page, so the popup is measured against the
   * viewport: it is capped to the free space and flipped above the input when
   * there is more room up there.
   */
  useLayoutEffect(() => {
    if (!showSuggestions) return;

    const update = () => {
      const form = formRef.current;
      if (!form) return;

      const rect = form.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
      const spaceAbove = rect.top - VIEWPORT_MARGIN;
      const dropUp = spaceBelow < MIN_POPUP_HEIGHT && spaceAbove > spaceBelow;
      const available = dropUp ? spaceAbove : spaceBelow;

      setPlacement({
        dropUp,
        maxHeight: Math.max(MIN_POPUP_HEIGHT, Math.min(MAX_POPUP_HEIGHT, available)),
      });
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [showSuggestions, suggestions.length]);

  return (
    <div className={`search-hero-search ${className}`.trim()} ref={wrapperRef}>
      <form
        className="search-hero-form"
        role="search"
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          setIsOpen(false);
          onSubmit(value);
        }}
      >
        <Search size={20} className="search-hero-form-icon" />
        <input
          id="movieSearchInput"
          type="search"
          className="search-hero-input"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls="searchSuggestions"
          aria-autocomplete="list"
          aria-label="Search movies and series"
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="search-hero-submit">
          {submitLabel}
        </button>
      </form>

      {showSuggestions && (
        <ul
          className={`search-suggestions${placement.dropUp ? " is-above" : ""}`}
          id="searchSuggestions"
          style={{ maxHeight: placement.maxHeight }}
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((item, index) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`search-suggestion${index === activeIndex ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToMedia(item)}
              >
                <MediaImage
                  className="search-suggestion-poster"
                  src={item.posterUrl}
                  alt=""
                  kind="poster"
                />
                <span className="search-suggestion-body">
                  <span className="search-suggestion-title">{item.title}</span>
                  <span className="search-suggestion-meta">
                    {item.mediaType === MediaType.TV_SERIES ? "Series" : "Movie"}
                    {item.releaseYear ? ` • ${item.releaseYear}` : ""}
                    {item.rating ? (
                      <span className="search-suggestion-rating">
                        {` • ★ ${Number(item.rating).toFixed(1)}`}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSuggest;
