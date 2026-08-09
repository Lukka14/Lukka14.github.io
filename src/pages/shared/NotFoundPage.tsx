import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Home, Play, Star } from "lucide-react";
import { fetchMedia, fetchTrendingMedia } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import PrimarySearchAppBar from "./TopNavBar";
import quotesData from "../../dict/404_quotes.json";
import { generateHref } from "../../utils/Utils";
import { Background } from "../watch/components/Background";
import "./not-found.css";

interface Quote {
  text: string;
  movie: string;
}

export default function NotFoundPage() {
  const [, setMedias] = useState<Media[]>([]);
  const [randomMedia, setRandomMedia] = useState<Media>();
  const [randomQuote, setRandomQuote] = useState<Quote>();

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTrendingMedia()
      .then((media: Media[]) => {
        if (media?.length) {
          setRandomMedia(media[Math.floor(Math.random() * media.length)]);
        }
      })
      .catch((err: any) => console.error(err));

    setRandomQuote(
      quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)]
    );
  }, []);

  return (
    <div className="not-found-page">
      <Background url={randomMedia?.backDropUrl ?? ""} />
      <div className="not-found-scrim" />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

      <div className="not-found-shell">
        <div className="not-found-panel">
          <p className="not-found-code">404</p>
          <h1 className="not-found-title">This page is off the reel</h1>
          <p className="not-found-lead">
            The page you were looking for does not exist, or it moved somewhere
            else. Nothing is broken on your side.
          </p>

          {randomQuote && (
            <blockquote className="not-found-quote">
              <p>&ldquo;{randomQuote.text}&rdquo;</p>
              <cite>&mdash; {randomQuote.movie}</cite>
            </blockquote>
          )}

          <div className="not-found-actions">
            <Link to="/" className="not-found-btn not-found-btn--primary">
              <Home size={17} />
              Back to home
            </Link>
            <Link
              to="/multiSearch?type=movie"
              className="not-found-btn not-found-btn--ghost"
            >
              <Compass size={17} />
              Browse movies
            </Link>
            <Link
              to="/multiSearch?type=tv"
              className="not-found-btn not-found-btn--ghost"
            >
              <Compass size={17} />
              Browse series
            </Link>
          </div>

          {randomMedia && (
            <div className="not-found-suggestion">
              <span className="not-found-suggestion-label">
                While you are here
              </span>

              <Link to={generateHref(randomMedia)} className="not-found-pick">
                {randomMedia.posterUrl && (
                  <img
                    className="not-found-pick-poster"
                    src={randomMedia.posterUrl}
                    alt=""
                    loading="lazy"
                  />
                )}

                <div className="not-found-pick-body">
                  <h2 className="not-found-pick-title">{randomMedia.title}</h2>

                  <div className="not-found-pick-meta">
                    {typeof randomMedia.rating === "number" && (
                      <span className="not-found-chip not-found-chip--rating">
                        <Star size={12} fill="currentColor" />
                        {randomMedia.rating.toFixed(1)}
                      </span>
                    )}
                    {randomMedia.releaseYear && (
                      <span className="not-found-chip">
                        {randomMedia.releaseYear}
                      </span>
                    )}
                    {randomMedia.originalLanguage && (
                      <span className="not-found-chip">
                        {randomMedia.originalLanguage.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {randomMedia.genreList?.length ? (
                    <p className="not-found-pick-genres">
                      {randomMedia.genreList.join(" \u00b7 ")}
                    </p>
                  ) : null}

                  <span className="not-found-pick-cta">
                    <Play size={14} fill="currentColor" />
                    Watch now
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
