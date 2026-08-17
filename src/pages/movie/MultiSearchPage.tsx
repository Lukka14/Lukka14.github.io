import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Media, MediaType } from "../../models/Movie";
import {
  fetchMedia,
  fetchOnlyMovies,
  fetchOnlyTvSeries,
  fetchTrendingMedia,
} from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import { SearchSuggest } from "../shared/SearchSuggest";
import { Clapperboard, Film, Flame, Layers, Search, Sparkles, Tv } from "lucide-react";

type SearchFilter = "all" | "movie" | "tv";

const FILTER_OPTIONS: {
  value: SearchFilter;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "all", label: "All", icon: Layers },
  { value: "movie", label: "Movies", icon: Film },
  { value: "tv", label: "Series", icon: Tv },
];

const FILTER_MEDIA_TYPE: Record<SearchFilter, MediaType | null> = {
  all: null,
  movie: MediaType.MOVIE,
  tv: MediaType.TV_SERIES,
};

const normalizeFilter = (value: string | null): SearchFilter =>
  value === "movie" || value === "tv" ? value : "all";

const dedupeMedia = (items: Media[]): Media[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = String(item.id ?? item.title ?? "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// The multi endpoint also returns people; only titles are playable here.
const dropPeople = (items: Media[]): Media[] =>
  items.filter((item) => item.mediaType !== MediaType.PERSON);

/**
 * `rawCount` is the page size before client-side filtering, so pagination can tell
 * "the backend ran out of results" apart from "this page held nothing we display".
 */
const fetchPage = (
  searchQuery: string,
  filter: SearchFilter,
  page: number
): Promise<{ items: Media[]; rawCount: number }> => {
  const withRawCount = (items: Media[]) => ({
    items: dropPeople(items),
    rawCount: items.length,
  });

  if (searchQuery) {
    if (filter === "movie")
      return fetchOnlyMovies(searchQuery, page).then(withRawCount);
    if (filter === "tv")
      return fetchOnlyTvSeries(searchQuery, page).then(withRawCount);
    return fetchMedia(searchQuery, page).then(withRawCount);
  }

  // Browsing with no query: trending is the only paginated feed, so filter it client-side.
  return fetchTrendingMedia(page).then((items) => {
    const mediaType = FILTER_MEDIA_TYPE[filter];
    const visible = mediaType
      ? items.filter((item) => item.mediaType === mediaType)
      : dropPeople(items);
    return { items: visible, rawCount: items.length };
  });
};

const MultiSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = normalizeFilter(searchParams.get("type"));
  // Seeded by the home page search box, which hands the term over in the URL.
  const initialQuery = searchParams.get("q")?.trim() ?? "";

  const [medias, setMedias] = useState<Media[]>([]);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [isTrending, setIsTrending] = useState(!initialQuery);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const queryRef = useRef("");
  const filterRef = useRef<SearchFilter>(filter);
  const isLoadingMoreRef = useRef(false);
  const requestIdRef = useRef(0);

  const loadFirstPage = useCallback(
    (searchQuery: string, activeFilter: SearchFilter) => {
      const requestId = ++requestIdRef.current;
      queryRef.current = searchQuery;
      filterRef.current = activeFilter;
      pageRef.current = 1;
      isLoadingMoreRef.current = false;

      setIsSearching(true);
      setHasMore(true);

      fetchPage(searchQuery, activeFilter, 1)
        .then(({ items, rawCount }) => {
          if (requestId !== requestIdRef.current) return;
          setMedias(dedupeMedia(items));
          setHasMore(searchQuery ? rawCount > 0 : true);
        })
        .catch((err) => {
          if (requestId !== requestIdRef.current) return;
          console.error(err);
          setMedias([]);
          setHasMore(false);
        })
        .finally(() => {
          if (requestId !== requestIdRef.current) return;
          setIsSearching(false);
        });
    },
    []
  );

  useEffect(() => {
    loadFirstPage(queryRef.current, filter);
  }, [loadFirstPage, filter]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 520;

      if (!scrolledToBottom) return;
      if (isLoadingMoreRef.current || isSearching || !hasMore) return;

      const requestId = requestIdRef.current;
      const nextPage = pageRef.current + 1;
      const activeQuery = queryRef.current;
      const activeFilter = filterRef.current;

      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);

      fetchPage(activeQuery, activeFilter, nextPage)
        .then(({ items, rawCount }) => {
          if (requestId !== requestIdRef.current) return;

          pageRef.current = nextPage;

          // A page can come back empty after client-side filtering without being the
          // last page, so only an empty raw response ends a search.
          if (!rawCount) {
            if (activeQuery) setHasMore(false);
            return;
          }

          if (!items.length) return;

          setMedias((prev) => {
            const merged = dedupeMedia([...prev, ...items]);
            if (merged.length === prev.length && activeQuery && rawCount)
              setHasMore(false);
            return merged;
          });
        })
        .catch((err) => {
          console.error(err);
          if (requestId === requestIdRef.current) setHasMore(false);
        })
        .finally(() => {
          isLoadingMoreRef.current = false;
          if (requestId === requestIdRef.current) setIsLoadingMore(false);
        });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearching, hasMore]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const normalizedQuery = searchQuery.trim();
      setQuery(normalizedQuery);
      setIsTrending(!normalizedQuery);
      loadFirstPage(normalizedQuery, filterRef.current);
    },
    [loadFirstPage]
  );

  const handleFilterChange = (nextFilter: SearchFilter) => {
    if (nextFilter === filter) return;

    const params = new URLSearchParams(searchParams);
    if (nextFilter === "all") {
      params.delete("type");
    } else {
      params.set("type", nextFilter);
    }
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (inputValue.trim() === query) return;

    const timer = window.setTimeout(() => {
      handleSearch(inputValue);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [inputValue, query, handleSearch]);

  const filterLabel = useMemo(
    () => FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? "All",
    [filter]
  );

  const resultLabel = useMemo(() => {
    const scope =
      filter === "movie" ? "movies" : filter === "tv" ? "series" : "titles";
    if (isTrending) return `Trending ${scope}`;
    if (query) return `${filterLabel} results for "${query}"`;
    return "Results";
  }, [filter, filterLabel, isTrending, query]);

  const summaryStats = [
    { label: "Mode", value: isTrending ? "Trending" : "Search" },
    { label: "Showing", value: filterLabel },
    { label: "Results", value: String(medias.length).padStart(2, "0") },
    {
      label: "Status",
      value: isSearching ? "Loading..." : isLoadingMore ? "Loading more..." : "Ready",
    },
  ];

  const searchPlaceholder =
    filter === "movie"
      ? "Search movies..."
      : filter === "tv"
        ? "Search series..."
        : "Search movies, series, people...";

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

      <main className="container py-4 py-lg-5 search-page-shell">
        <section className="search-hero-panel search-hero-panel--center p-4 p-lg-5 mb-4">
          <div className="search-hero-inner">
            <div className="search-hero-badge mb-3">
              <Sparkles size={16} />
              Discover movies and series
            </div>
            <h1 className="search-hero-title mb-2">Search Anything!</h1>
            <p className="search-hero-copy mb-0">
              Start with trending titles or use the search bar to jump straight to what you want.
            </p>

            <SearchSuggest
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSearch}
              scope={filter}
              placeholder={searchPlaceholder}
            />

            <div
              className="search-filter-group"
              role="group"
              aria-label="Filter by media type"
            >
              {FILTER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = option.value === filter;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`search-filter-btn${isActive ? " is-active" : ""}`}
                    aria-pressed={isActive}
                    onClick={() => handleFilterChange(option.value)}
                  >
                    <Icon size={15} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="search-hero-chip">
              <Search size={16} />
              <span>{resultLabel}</span>
            </div>
          </div>

          <div className="row g-3 mt-4 search-stats-row">
            {summaryStats.map((stat) => (
              <div className="col-6 col-lg-3" key={stat.label}>
                <div className="search-stat-card h-100">
                  <div className="search-stat-label">{stat.label}</div>
                  <div className="search-stat-value">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="search-results-panel">
          <div className="search-results-header mb-3 mb-md-4">
            <div>
              <div className="d-inline-flex align-items-center gap-2 search-results-kicker mb-2">
                <Flame size={16} />
                {isTrending ? "Trending now" : "Matched titles"}
              </div>
              <h2 className="search-results-title mb-1">{resultLabel}</h2>
              <p className="search-results-copy mb-0">
                {isSearching
                  ? "Updating your results..."
                  : medias.length > 0
                    ? `Showing ${medias.length} title${medias.length === 1 ? "" : "s"}.`
                    : "No titles found."}
              </p>
            </div>
            <div className="search-results-pill">
              <Clapperboard size={16} />
              <span>{isTrending ? "Trending feed" : "Search feed"}</span>
            </div>
          </div>

          <MovieList mediaList={medias} />

          {isLoadingMore && (
            <p className="search-results-copy text-center pb-3 mb-0">
              Loading more titles...
            </p>
          )}

          {!isLoadingMore && !hasMore && medias.length > 0 && (
            <p className="search-results-copy text-center pb-3 mb-0">
              You've reached the end of the list.
            </p>
          )}
        </section>
      </main>
    </>
  );
};

export default MultiSearchPage;
