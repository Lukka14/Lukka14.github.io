import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dices, Film, Layers, RefreshCw, Sparkles, Star, Tv } from "lucide-react";
import { ImdbMedia, MediaType, Movie } from "../../models/Movie";
import {
  fetchGenres,
  fetchRandomMedia,
  GenresByMediaType,
  RandomMediaFilters,
} from "../../services/MediaService";
import {
  convertMinutes,
  generateHref,
  getInitials,
  isPlaceholderProfileUrl,
} from "../../utils/Utils";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import "./randomizer.css";

type RandomType = "ALL" | "MOVIE" | "TV_SERIES";

const TYPE_OPTIONS: { value: RandomType; label: string; icon: React.ElementType }[] = [
  { value: "ALL", label: "All", icon: Layers },
  { value: "MOVIE", label: "Movies", icon: Film },
  { value: "TV_SERIES", label: "Series", icon: Tv },
];

const CURRENT_YEAR = new Date().getFullYear();
const EARLIEST_YEAR = 1900;
const MAX_CAST = 8;
const FALLBACK_POSTER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019";

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * OMDb reports missing data as the literal string "N/A" rather than null, so a
 * plain truthiness check happily renders "IMDb N/A".
 */
const omdbValue = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed && trimmed.toUpperCase() !== "N/A" ? trimmed : null;
};

const RandomizerPage: React.FC = () => {
  const [type, setType] = useState<RandomType>("ALL");
  const [genresByType, setGenresByType] = useState<GenresByMediaType>({
    MOVIE: {},
    TV_SERIES: {},
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [matchAllGenres, setMatchAllGenres] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minYear, setMinYear] = useState(EARLIEST_YEAR);

  const [result, setResult] = useState<ImdbMedia | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRolled, setHasRolled] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGenres().then(setGenresByType);
  }, []);

  // With type ALL a genre only has to exist for one of the two media types, so
  // the union is what the backend actually accepts.
  const availableGenres = useMemo(() => {
    const names =
      type === "MOVIE"
        ? Object.values(genresByType.MOVIE)
        : type === "TV_SERIES"
          ? Object.values(genresByType.TV_SERIES)
          : [
              ...Object.values(genresByType.MOVIE),
              ...Object.values(genresByType.TV_SERIES),
            ];

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [genresByType, type]);

  // Switching type can invalidate previously picked genres (e.g. "Action" is
  // movie-only), so drop anything the new type doesn't offer.
  useEffect(() => {
    setSelectedGenres((prev) => prev.filter((genre) => availableGenres.includes(genre)));
  }, [availableGenres]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
  };

  const handleRoll = async () => {
    if (isRolling) return;

    setIsRolling(true);
    setError(null);
    setHasRolled(true);

    // Only send bounds that actually narrow the search, so the backend keeps
    // its own sensible defaults everywhere else.
    const filters: RandomMediaFilters = { type };
    if (selectedGenres.length) {
      filters.genres = selectedGenres;
      if (selectedGenres.length > 1) filters.matchAllGenres = matchAllGenres;
    }
    if (minRating > 0) filters.minRating = minRating;
    if (minYear > EARLIEST_YEAR) filters.minYear = minYear;

    try {
      // detailed=true costs an extra TMDB lookup but returns the cast, runtime
      // and IMDb rating this card is built around.
      const media = await fetchRandomMedia(filters, true);
      setResult(media);
      if (!media) {
        setError("No title matches those filters. Try loosening them.");
      } else {
        // The result sits below the filters, so bring it into view.
        requestAnimationFrame(() =>
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        );
      }
    } catch (err: any) {
      setResult(null);
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsRolling(false);
    }
  };

  const handleReset = () => {
    setType("ALL");
    setSelectedGenres([]);
    setMatchAllGenres(false);
    setMinRating(0);
    setMinYear(EARLIEST_YEAR);
    setResult(null);
    setError(null);
    setHasRolled(false);
  };

  const activeFilterCount =
    (type !== "ALL" ? 1 : 0) +
    selectedGenres.length +
    (minRating > 0 ? 1 : 0) +
    (minYear > EARLIEST_YEAR ? 1 : 0);

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />

      <PrimarySearchAppBar onClick={() => {}} displaySearch={false} />

      <main className="container py-4 py-lg-5 search-page-shell">
        <section className="search-hero-panel search-hero-panel--center p-4 p-lg-5 mb-4">
          <div className="search-hero-inner">
            <div className="search-hero-badge mb-3">
              <Sparkles size={16} />
              Can't decide what to watch?
            </div>
            <h1 className="search-hero-title mb-2">Randomizer</h1>
            <p className="search-hero-copy mb-0">
              Set a few filters and let us pick something for you out of the whole catalogue.
            </p>
          </div>
        </section>

        <section className="search-hero-panel p-4 p-lg-5">
          <div className="randomizer-filters">
            <div className="randomizer-field">
              <span className="randomizer-label">Type</span>
              <div className="search-filter-group" role="group" aria-label="Filter by media type">
                {TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isActive = option.value === type;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`search-filter-btn${isActive ? " is-active" : ""}`}
                      aria-pressed={isActive}
                      onClick={() => setType(option.value)}
                    >
                      <Icon size={15} />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="randomizer-field">
              <div className="randomizer-label-row">
                <span className="randomizer-label">
                  Genres
                  {selectedGenres.length > 0 && (
                    <span className="randomizer-value">{selectedGenres.length}</span>
                  )}
                </span>

                {selectedGenres.length > 1 && (
                  <label className="randomizer-switch">
                    <input
                      type="checkbox"
                      checked={matchAllGenres}
                      onChange={(event) => setMatchAllGenres(event.target.checked)}
                    />
                    <span>Match all genres</span>
                  </label>
                )}
              </div>

              {availableGenres.length === 0 ? (
                <p className="randomizer-hint mb-0">Loading genres...</p>
              ) : (
                <div className="randomizer-genre-grid">
                  {availableGenres.map((genre) => {
                    const isActive = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        className={`randomizer-chip${isActive ? " is-active" : ""}`}
                        aria-pressed={isActive}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="randomizer-row">
              <div className="randomizer-field">
                <span className="randomizer-label">
                  Minimum rating
                  <span className="randomizer-value">
                    {minRating === 0 ? "Any" : `${minRating.toFixed(1)}+`}
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={minRating}
                  aria-label="Minimum rating"
                  onChange={(event) => setMinRating(Number(event.target.value))}
                />
                <span className="randomizer-hint">
                  Filters on the TMDB community score, not IMDb.
                </span>
              </div>

              <div className="randomizer-field">
                <span className="randomizer-label">
                  Released after
                  <span className="randomizer-value">
                    {minYear === EARLIEST_YEAR ? "Any year" : minYear}
                  </span>
                </span>
                <input
                  type="number"
                  min={EARLIEST_YEAR}
                  max={CURRENT_YEAR}
                  value={minYear}
                  aria-label="Earliest release year"
                  onChange={(event) =>
                    setMinYear(
                      clampNumber(
                        Number(event.target.value) || EARLIEST_YEAR,
                        EARLIEST_YEAR,
                        CURRENT_YEAR
                      )
                    )
                  }
                />
              </div>
            </div>

            <div className="randomizer-actions">
              <button
                type="button"
                className="randomizer-roll"
                onClick={handleRoll}
                disabled={isRolling}
              >
                <Dices size={18} className={isRolling ? "is-spinning" : ""} />
                {isRolling ? "Rolling..." : hasRolled ? "Roll again" : "Surprise me"}
              </button>

              <button
                type="button"
                className="randomizer-reset"
                onClick={handleReset}
                disabled={isRolling || (activeFilterCount === 0 && !hasRolled)}
              >
                <RefreshCw size={16} />
                Reset
              </button>

              <span className="randomizer-hint">
                {activeFilterCount === 0
                  ? "No filters - anything goes."
                  : `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} active`}
              </span>
            </div>
          </div>
        </section>

        {hasRolled && (isRolling || error) && (
          <section className="randomizer-status mt-4">
            {isRolling ? "Rolling the dice..." : error}
          </section>
        )}

        {result && !isRolling && (
          <div ref={resultRef}>
            <RandomResultHero media={result} />
          </div>
        )}
      </main>
    </>
  );
};

const RandomResultHero: React.FC<{ media: ImdbMedia }> = ({ media }) => {
  const {
    title,
    posterUrl,
    backDropUrl,
    overview,
    releaseYear,
    rating,
    imdbRating,
    imdbVotes,
    genreList,
    originalLanguage,
    mediaType,
    cast,
  } = media;

  // Only movies carry a runtime; series responses simply omit it.
  const runtime = (media as Movie).runtime;
  const runtimeLabel = useMemo(() => {
    if (!runtime) return null;
    const { hours, minutes } = convertMinutes(runtime);
    return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [runtime]);

  const topCast = cast?.slice(0, MAX_CAST) ?? [];
  const imdbScore = omdbValue(imdbRating);
  const imdbVoteCount = omdbValue(imdbVotes);

  return (
    <section className="randomizer-hero mt-4">
      {backDropUrl && (
        <div
          className="randomizer-hero-backdrop"
          style={{ backgroundImage: `url(${backDropUrl})` }}
          aria-hidden="true"
        />
      )}
      <div className="randomizer-hero-scrim" aria-hidden="true" />

      <div className="randomizer-hero-content">
        <img
          className="randomizer-hero-poster"
          src={posterUrl || FALLBACK_POSTER}
          alt={title || "Poster"}
          onError={(event) => {
            (event.target as HTMLImageElement).src = FALLBACK_POSTER;
          }}
        />

        <div className="randomizer-hero-body">
          <div className="search-hero-badge">
            <Sparkles size={16} />
            Your pick
          </div>

          <h1 className="randomizer-hero-title">{title || "Untitled"}</h1>

          <div className="randomizer-hero-meta">
            {imdbScore && (
              <span className="randomizer-hero-imdb">
                IMDb {imdbScore}
                {imdbVoteCount && <em>{imdbVoteCount} votes</em>}
              </span>
            )}
            {typeof rating === "number" && rating > 0 && (
              // Shown alongside IMDb because the rating filter uses the TMDB
              // score, so this is the number the user actually filtered on.
              <span className="randomizer-hero-rating">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                {rating.toFixed(1)}
                <em>TMDB</em>
              </span>
            )}
            {releaseYear && <span>{releaseYear}</span>}
            {runtimeLabel && <span>{runtimeLabel}</span>}
            {mediaType && <span>{mediaType === MediaType.TV_SERIES ? "Series" : "Movie"}</span>}
            {originalLanguage && <span>{originalLanguage.toUpperCase()}</span>}
          </div>

          {genreList && genreList.length > 0 && (
            <div className="randomizer-hero-genres">
              {genreList.map((genre) => (
                <span key={genre} className="randomizer-chip is-static">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {overview && <p className="randomizer-hero-overview">{overview}</p>}

          {topCast.length > 0 && (
            <div className="randomizer-cast">
              <span className="randomizer-label">Cast</span>
              <div className="randomizer-cast-row">
                {topCast.map((member) => (
                  <div className="randomizer-cast-member" key={member.id}>
                    {isPlaceholderProfileUrl(member.profileUrl) ? (
                      <span className="randomizer-cast-avatar randomizer-cast-initials">
                        {getInitials(member.name)}
                      </span>
                    ) : (
                      <img
                        className="randomizer-cast-avatar"
                        src={member.profileUrl}
                        alt={member.name}
                        loading="lazy"
                      />
                    )}
                    <span className="randomizer-cast-name">{member.name}</span>
                    {member.character && (
                      <span className="randomizer-cast-character">{member.character}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to={generateHref(media)} className="randomizer-watch">
            Watch now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RandomizerPage;
