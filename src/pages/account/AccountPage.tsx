import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Background } from "../main/Background";
import { Heart, Bookmark, Edit, Trash2 } from "lucide-react";
import { fetchMedia } from "../../services/MediaService";
import { Media, Movie } from "../../models/Movie";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import { getRecentlyWatched } from "../shared/RecentlyWatchService";
import { MediaCard } from "../main/MediaCard";
import { generateHref } from "../../utils/Utils";
import MoviesCarouselV2 from "../watch/components/MoviesCarouselV2";

const AccountPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const { username } = useParams<{ username: string }>();
  const [user] = useState({
    name: username,
    email: username + "@example.com",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVpGLjXCmAqHxC8L4xztCuXKWuUEOJIfz7g&s"
  });

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  const [favorites, setFavorites] = useState<Movie[]>(() => getRecentlyWatched());
  const [watchlist, setWatchlist] = useState<Movie[]>(() => getRecentlyWatched());

  function removeFromFavorites(id: number): void {
    throw new Error("Function not implemented.");
  }

  function removeFromWatchlist(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      <div className="container-xl px-4 py-5">
        <div className="rounded-lg shadow-lg p-4 mb-4" style={{
          padding: "24px",
          marginTop: "24px",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)"
        }}>
          <div className="d-flex align-items-center gap-3 justify-content-center">
            <img
              src={user.avatar}
              alt="Profile"
              className="rounded-circle border-2 border-primary"
              style={{
                width: "120px",
                height: "120px"
              }}
            />
            <div>
              <h2 className="h3 text-white">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
              <p className="small text-muted">Member since Jan 2023</p>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2 justify-content-center">
            <button className="btn btn-outline-primary px-4 py-2 d-flex align-items-center gap-2">
              <Edit size={16} />
              Edit Profile
            </button>
            <button className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2">
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>

          <div className="mt-4 d-flex justify-content-between" style={{maxWidth: "500px", margin: "auto"}}>
            <div className="text-center">
              <p className="h4 text-white">42</p>
              <p className="small text-muted">Films Watched</p>
            </div>
            <div className="text-center">
              <p className="h4 text-white">16</p>
              <p className="small text-muted">Favorites</p>
            </div>
            <div className="text-center">
              <p className="h4 text-white">23</p>
              <p className="small text-muted">Watchlist</p>
            </div>
            <div className="text-center">
              <p className="h4 text-white">4.2</p>
              <p className="small text-muted">Avg Rating</p>
            </div>
          </div>
        </div>

        <div className="row" style={{
          margin: "auto",
          padding: "24px",
          marginTop: "24px",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)"
        }}>
          <div className="col-12">
            <MoviesCarouselV2
              similarMovies={favorites}
              title="Favorites"
            />
          </div>
        </div>

        <div className="row" style={{
          margin: "24px auto 0px auto",
          padding: "24px",
          marginTop: "24px",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)"
        }}>
          <div className="col-12">
            <MoviesCarouselV2
              similarMovies={watchlist}
              title="Watchlist"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
