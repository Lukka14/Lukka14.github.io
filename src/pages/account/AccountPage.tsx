import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Background } from "../main/Background";
import { Edit, Trash2 } from "lucide-react";
import {
  fetchMe,
  fetchMedia,
  fetchUserByUsername,
} from "../../services/MediaService";
import { Media, Movie } from "../../models/Movie";
import PrimarySearchAppBar from "../shared/TopNavBar";
import { getRecentlyWatched } from "../shared/RecentlyWatchService";
import AccountStatCard from "../shared/AccountStatCard";
import { Endpoints } from "../../config/Config";
import Cookies from "js-cookie";
import NotFoundPage from "../shared/NotFoundPage";
import { WorkInProgress } from "../shared/WorkInProgress";

const accountPageStyle = `
  .similar-movies-controls {
    display: flex;
    gap: 10px;
  }

  .similar-movies-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
    color: #fff;
  }

  .similar-movies-button:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .similar-movies-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }`

const AccountPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const { username } = useParams<{ username: string }>();
  const [authed, setAuthed] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const cookieUsername = Cookies.get("username");
  const [user, setUser] = useState<any>({
    username: username,
    avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
    createdAt: new Date("2023-01-01"),
  });

  useEffect(() => {
    const newAvatarUrl = `${Endpoints.IMG_VIEW}/${username}.webp`;
    setAvatarUrl(newAvatarUrl);
    if (username === cookieUsername) setAuthed(true)
    else setAuthed(false);
  }, [username, avatarVersion]);

  useEffect(() => {
    setUser({
      username: username,
      avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
      createdAt: new Date("2023-01-01"),
    });
    async function fetchUser() {
      const me = await fetchMe();
      if (me?.username && me?.username?.toLowerCase() === username?.toLowerCase()) {
        setUser((prev: any) => {
          const updated = { ...prev, ...me };
          setAuthed(true);
          return updated;
        });
      }
    }

    async function fetchUserByUsrname() {
      const userByUsername = await fetchUserByUsername(username!);
      if (userByUsername) {
        setUser((prev: any) => ({ ...prev, ...userByUsername }));
        console.log(userByUsername);
        setAvatarUrl(userByUsername?.avatarUrl);
        window.history.replaceState({}, '', `/#/profile/` + userByUsername.username);
      } else {
        setUser(null);
      }
    }

    if (cookieUsername) {
      if (username?.toLowerCase() == cookieUsername?.toLowerCase()) {
        fetchUser();
      } else {
        fetchUserByUsrname();
      }
    } else {
      fetchUserByUsrname();
    }
  }, [username]);

  useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      setAvatarVersion((currentEvent) => {
        const customEvent = event as CustomEvent;
        return customEvent.detail?.timestamp || Date.now();
      });
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  // vitom bazidanaa
  const accountStats = [
    {
      value: "42",
      label: "Films Watched",
    },
    {
      value: "16",
      label: "Favorites",
    },
    {
      value: "23",
      label: "Watchlist",
    },
    {
      value: "4.2",
      label: "Avg Rating",
    },
  ];

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  const [favorites, setFavorites] = useState<Movie[]>(() =>
    getRecentlyWatched()
  );
  const [watchlist, setWatchlist] = useState<Movie[]>(() =>
    getRecentlyWatched()
  );

  function removeFromFavorites(id: number): void {
    throw new Error("Function not implemented.");
  }

  function removeFromWatchlist(id: number): void {
    throw new Error("Function not implemented.");
  }

  if (user == null) {
    return <NotFoundPage />;
  }

  return (
    <>
      <style>
        {accountPageStyle}
      </style>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      <div className="container-xl px-4 py-1">
        <div
          className="rounded-lg shadow-lg p-4 mb-4"
          style={{
            padding: "24px",
            marginTop: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="d-flex align-items-center gap-3 justify-content-center">
            <img
              key={`avatar-${avatarVersion}`}
              src={avatarUrl}
              alt="Profile"
              className="rounded-circle border-2 border-primary"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "1px solid white"
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = user.avatar;
              }}
            />

            <div>
              <h2 className="h3 text-white">{user.username}</h2>
              {user?.email && <p className="text-muted">{user.email}</p>}
              <p className="small text-muted">
                Member since{" "}
                {new Date(user.createdAt).toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {authed && (
            <div className="mt-4 d-flex gap-2 justify-content-center">
              <button
                className="btn btn-outline-primary px-4 py-2 d-flex align-items-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#editProfileModal"
              >
                <Edit size={16} />
                Edit Profile
              </button>
              <button
                className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#deleteAccountModal"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          )}

          <div
            className="mt-4 d-flex justify-content-between"
            style={{ maxWidth: "500px", margin: "auto" }}
          >
            {accountStats.map((stat, index) => (
              <AccountStatCard
                key={index}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>

        <div
          className="row"
          style={{
            margin: "auto",
            padding: "24px",
            marginTop: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-white mb-0">Favourites</h3>
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
            <WorkInProgress />
          </div>
        </div>

        <div
          className="row"
          style={{
            margin: "24px auto 0px auto",
            padding: "24px",
            marginTop: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-white mb-0">Watchlist</h3>
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
            <WorkInProgress />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;