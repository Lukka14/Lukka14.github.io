import React, { useEffect, useState } from 'react';
import { Media, MediaType } from '../../../../models/Movie';
import { MediaCard } from '../../../main/MediaCard';
import { fetchAllPages, generateHref, normalizeType } from '../../../../utils/Utils';
import { WorkInProgress } from '../../../shared/WorkInProgress';
import Cookies from 'js-cookie';
import { Endpoints } from '../../../../config/Config';
import axios from 'axios';
import './MoviesCarouselV2.css'
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../../../services/UserService';


interface MediaWithType extends Media {
  type?: MediaType;
}
interface SimilarMoviesCarouselProps {
  similarMovies: MediaWithType[];
  title?: string;
  accountPage?: boolean;
  stateHandler?: (id: any, type: any, action?: 'add' | 'remove') => void;
  isCurrentUserProfile?: boolean;
  username?: string;
}

const MoviesCarouselV2: React.FC<SimilarMoviesCarouselProps> = ({
  similarMovies,
  title = "Similar Movies",
  accountPage = false,
  stateHandler,
  isCurrentUserProfile,
  username: ParamsUsername
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(5);
  const [fav, setFav] = useState([]);
  const [watch, setWatch] = useState([]);
  // const [textSize, setTextSize] = useState("fs-2")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    async function userFetch() {
      setIsLoggedIn(!!(await getCurrentUser())?.username);
    }
    userFetch();
  }, [isLoggedIn])

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

  const maxIndex = (Math.ceil(similarMovies.length / cardsToShow) - 1) * cardsToShow;

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + cardsToShow, maxIndex));
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - cardsToShow, 0));
  };

  const username = Cookies.get("username");
  useEffect(() => {
    async function getT() {
      try {
        const favEndpoint = `${Endpoints.FAVOURITES}?username=${username}`;
        const watchEndpoint = `${Endpoints.WATCHLIST}?username=${username}`;

        const [favouritesData, watchlistData] = await Promise.all([
          fetchAllPages(favEndpoint),
          fetchAllPages(watchEndpoint),
        ]);

        setFav(favouritesData as any);
        setWatch(watchlistData as any);
      } catch (err) {
        console.error(err);
      }
    }

    if (similarMovies && username) {
      getT();
      setStartIndex(0);
    }
  }, [similarMovies, username, ParamsUsername]);


  if (!similarMovies || similarMovies.length === 0) return (
    <>
      <div className="similar-movies-container">
        <div className="similar-movies-header">
          <h2 className="similar-movies-title">{title}</h2>
          <div className="similar-movies-controls">
            <button disabled={true} className="similar-movies-button">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button disabled={true} className="similar-movies-button">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="similar-movies-track-container">
          {title == "Favourites" && <WorkInProgress
            text="No favourites yet."
            subtext={!isCurrentUserProfile && ParamsUsername ? `${ParamsUsername} currently has no movies or TV shows added to favourites` : `Add movies and tv shows to favourites and they will appear here.`}
          />
          }
          {title == "Watchlist" && <WorkInProgress
            text={!isCurrentUserProfile && ParamsUsername ? `${ParamsUsername}'s watchlist is empty` : `Your watchlist is empty.`}
            subtext={!isCurrentUserProfile && ParamsUsername ? `${ParamsUsername} currently has no movies or TV shows added to watchlist` : `Add movies and tv shows to watchlist and they will appear here.`}
          />
          }
          {title == "Watched" && <WorkInProgress
            text={!isCurrentUserProfile && ParamsUsername ? `${ParamsUsername}'s watched list is empty` : `Your watched list is empty.`}
            subtext={!isCurrentUserProfile && ParamsUsername ? `${ParamsUsername} currently has not watched any movie` : `Watch at least half of a movie and they will appear here`}
          />
          }
        </div>
      </div>
    </>
  )


  return (
    <>
      <div className="similar-movies-container">
        <div className="similar-movies-header">
          <div className='d-flex align-items-center justify-content-center'>
            <h2 className="similar-movies-title">{title}</h2>
            {accountPage && <Link
              to={`/profile/${ParamsUsername}/${title.toLowerCase()}`}
              style={{
                marginLeft: "15px",
                borderLeft: "1px solid #f5f5f5",
                paddingLeft: "10px"
              }}
            >
              View at once <i className="fas fa-arrow-right"></i>
            </Link>}
          </div>
          <div className="similar-movies-controls d-flex align-items-center">
            <span className="page-indicator h5 mb-0" style={{
              color: "#f5f5f5",
              marginRight: "10px"
            }}>
              {Math.floor(startIndex / cardsToShow) + 1} / {Math.ceil(similarMovies.length / cardsToShow)}
            </span>
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
            {similarMovies.map((movie) => {
              let isFav = fav.some((item: any) => item.tmdbId == movie?.id);
              let isWatch = watch.some((item: any) => item.tmdbId == movie?.id);
              let mediaTy = accountPage ? normalizeType(movie?.type) : movie?.mediaType;
              let link = generateHref(movie, accountPage);
              return <div
                key={movie.id}
                className="similar-movie-card"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <MediaCard
                  mediaInfo={{
                    id: movie?.id,
                    mediaType: mediaTy,
                    title: movie.title,
                    posterUrl: movie.posterUrl,
                    rating: movie.rating,
                    releaseYear: movie.releaseYear,
                    backDropUrl: movie.backDropUrl,
                    originalLanguage: movie.originalLanguage,
                    genreList: movie.genreList
                  }}
                  href={link} isFav={isFav} isWatch={isWatch} stateHandler={stateHandler} isLoggedIn={isLoggedIn} />
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesCarouselV2;