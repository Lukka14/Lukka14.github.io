import React, { useEffect, useMemo, useRef, useState } from "react";
import { Media, MediaType } from "../../models/Movie";
import {
  fetchTrendingMedia,
  fetchTrendingMediaPage,
  fetchTrendingMediaWithDetails,
} from "../../services/MediaService";
import { MovieList } from "../shared/MovieList";
import { Background } from "./Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import { getRecentlyWatched, getResumeQuery } from "../shared/RecentlyWatchService";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  Play,
  Search,
  Sparkles,
  Star,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCarousel from "./MovieCarousel/MovieCarousel";
import { DiscordBanner } from "./DiscordBanner";
import { SearchSuggest } from "../shared/SearchSuggest";

const buildWatchUrl = (media: Media) => {
  let url = `/watch?id=${media.id}`;

  if (media.mediaType === MediaType.TV_SERIES) {
    url += getResumeQuery(media.id);
  }

  return url;
};

const getBackdropImage = (media: Media) => {
  return media.backDropUrl || media.posterUrl || "";
};

const getMediaTypeLabel = (media: Media) => {
  if (media.mediaType === MediaType.TV_SERIES) return "Series";
  if (media.mediaType === MediaType.MOVIE) return "Movie";
  return "Title";
};

const getRatingLabel = (media: Media) => {
  if (!media.rating || media.rating <= 0) return "N/A";
  return media.rating.toFixed(1);
};

const isUpcoming = (media: Media): boolean => {
  if (!media.release_date) return false;

  const releaseDate = new Date(media.release_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return releaseDate > today;
};

const getDaysUntilRelease = (media: Media): number | null => {
  if (!media.release_date) return null;

  const releaseDate = new Date(media.release_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (releaseDate > today) {
    return Math.ceil(
      (releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return null;
};

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaListCarousel, setMediaListCarousel] = useState<Media[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const pageRef = useRef(1);

  const handleSearch = () => {};

  useEffect(() => {
    let isActive = true;

    const loadInitialMedia = async () => {
      setInitialLoading(true);

      try {
        const [carouselMedia, trendingPage] = await Promise.all([
          fetchTrendingMediaWithDetails(),
          fetchTrendingMediaPage(),
        ]);

        if (!isActive) return;

        setMediaListCarousel(carouselMedia);
        setMediaList(trendingPage.media);
        setTotalResults(trendingPage.totalResults);
        pageRef.current = 1;
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) {
          setInitialLoading(false);
        }
      }
    };

    loadInitialMedia();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 520;

      if (!scrolledToBottom || isLoadingMoreRef.current) return;

      const nextPage = pageRef.current + 1;
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);

      fetchTrendingMedia(nextPage)
        .then((media) => {
          if (media.length) {
            setMediaList((prevMediaList) => [...prevMediaList, ...media]);
            pageRef.current = nextPage;
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialLoading]);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const recentlyWatched = getRecentlyWatched();

  const featuredPool = useMemo(() => {
    return mediaListCarousel.length > 0 ? mediaListCarousel : mediaList;
  }, [mediaListCarousel, mediaList]);

  useEffect(() => {
    setFeaturedIndex(0);
  }, [featuredPool]);

  const featuredMedia = featuredPool[featuredIndex] || recentlyWatched[0] || null;

  const featuredGenres = featuredMedia?.genreList?.slice(0, 4) || [];
  const movieTitles = mediaList.filter((m) => m.mediaType === MediaType.MOVIE);
  const seriesTitles = mediaList.filter((m) => m.mediaType === MediaType.TV_SERIES);
  const recentTitles = recentlyWatched.slice(0, 10);

  const handleSelectMedia = (media: Media) => {
    navigate(buildWatchUrl(media));
  };

  // Anything not picked straight from the suggestions is handed to the full
  // search page, which knows how to page through and filter the results.
  const handleSubmitSearch = (term: string) => {
    const normalized = term.trim();
    navigate(
      normalized ? `/multiSearch?q=${encodeURIComponent(normalized)}` : "/multiSearch"
    );
  };

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

      {initialLoading && <LoadingSpinner initial={true} />}

      {!initialLoading && (
        <main className="home-page">

          {/* ── Full-width featured card ── */}
          <section className="home-featured-section">
            {featuredMedia ? (
              <article
                className="home-feature-card"
                onClick={() => handleSelectMedia(featuredMedia)}
              >
                <div
                  key={featuredIndex}
                  className="home-feature-art"
                  style={
                    getBackdropImage(featuredMedia)
                      ? { backgroundImage: `url(${getBackdropImage(featuredMedia)})` }
                      : undefined
                  }
                />
                <div className="home-feature-art-overlay" />

                <div className="home-feature-nav">
                  <button
                    type="button"
                    className="home-feature-nav-btn"
                    onClick={(e) => { e.stopPropagation(); setFeaturedIndex((i) => Math.max(0, i - 1)); }}
                    disabled={featuredIndex === 0}
                    aria-label="Previous featured"
                  >‹</button>
                  <button
                    type="button"
                    className="home-feature-nav-btn"
                    onClick={(e) => { e.stopPropagation(); setFeaturedIndex((i) => Math.min(featuredPool.length - 1, i + 1)); }}
                    disabled={featuredIndex >= featuredPool.length - 1}
                    aria-label="Next featured"
                  >›</button>
                </div>

                <div className="home-feature-copy">
                  <div className="home-feature-copy-top">
                    <span className="home-feature-badge">
                      {isUpcoming(featuredMedia)
                        ? `Upcoming • ${getDaysUntilRelease(featuredMedia)}d`
                        : `Featured ${getMediaTypeLabel(featuredMedia)}`}
                    </span>
                    {featuredGenres.length > 0 && (
                      <div className="home-chip-row">
                        {featuredGenres.map((genre) => (
                          <span key={genre} className="home-chip">{genre}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h2>{featuredMedia.title || "Featured title"}</h2>
                  <p>{featuredMedia.overview || "A top pick from the trending catalog."}</p>
                  <div className="home-feature-actions">
                    <button
                      type="button"
                      className="home-primary-button"
                      onClick={(e) => { e.stopPropagation(); handleSelectMedia(featuredMedia); }}
                    >
                      <Play size={18} fill="currentColor" />
                      Play now
                    </button>
                    <button
                      type="button"
                      className="home-secondary-button"
                      onClick={(e) => { e.stopPropagation(); navigate("/multiSearch"); }}
                    >
                      <Search size={18} />
                      Browse library
                    </button>
                  </div>
                  <div className="home-feature-meta">
                    <span><Star size={14} fill="currentColor" />{getRatingLabel(featuredMedia)}</span>
                    <span>{featuredMedia.releaseYear || "Now playing"}</span>
                    <span>{getMediaTypeLabel(featuredMedia)}</span>
                  </div>
                </div>
              </article>
            ) : (
              <div className="home-feature-card home-feature-card-empty">
                <Sparkles size={32} />
                <h2>Fresh picks are loading</h2>
                <p>We're preparing the latest trending titles for your homepage.</p>
              </div>
            )}
          </section>

          <section className="home-search-section">
            <div className="home-search-header">
              <p className="movie-carousel-kicker">Search</p>
              <h2 className="movie-carousel-title">Looking for something specific?</h2>
            </div>
            <SearchSuggest
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSubmitSearch}
              placeholder="Search for a movie or series..."
              className="home-search-box"
            />
          </section>

          <MovieCarousel
            title="Continue watching"
            description="Pick up where you left off"
            mediaList={recentTitles}
          />

          <MovieCarousel
            title="Trending movies"
            description="The most watched films right now"
            mediaList={movieTitles.slice(0, 12)}
          />

          <MovieCarousel
            title="Popular series"
            description="Binge-ready shows and ongoing favorites"
            mediaList={seriesTitles.slice(0, 12)}
          />

          <DiscordBanner />

          <section className="home-section home-section-grid">
            <div className="home-section-header">
              <div>
                <p className="home-section-kicker">Explore everything</p>
                <h2>Browse the full trending catalog</h2>
              </div>
              <span className="home-section-count">
                <Clock3 size={14} />
                {isLoadingMore ? "Loading more" : `${mediaList.length} titles`}
              </span>
            </div>
            <MovieList mediaList={mediaList} />
          </section>
        </main>
      )}
    </>
  );
};

export default MainPage;
