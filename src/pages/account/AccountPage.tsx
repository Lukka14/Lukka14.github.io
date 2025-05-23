import { Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Endpoints } from "../../config/Config";
import { Media } from "../../models/Movie";
import {
  fetchMedia,
  fetchUserByUsername,
} from "../../services/MediaService";
import { fetchAllPages } from "../../utils/Utils";
import { Background } from "../main/Background";
import AccountStatCard from "../shared/AccountStatCard";
import NotFoundPage from "../shared/NotFoundPage";
import PrimarySearchAppBar from "../shared/TopNavBar";
import MoviesCarouselV2 from "../watch/components/MovieCarouselV2/MoviesCarouselV2";
import { getCurrentUser, getUsername } from "../../services/UserService";

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
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const cookieUsername = getUsername();
  const [is404, setIs404] = useState<boolean>(false);
  const [accountStats, setaccountStats] = useState<any>([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [watchlist, setWatchlist] = useState<any>([]);
  const [watched, setWatched] = useState<any>([]);

  // change to loading screen instead of showing this data
  const [user, setUser] = useState<any>({
    username: username,
    avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
    createdAt: new Date("2023-01-01"),
  });

  function stateHandler(id: any, type: any, action: 'add' | 'remove' = 'remove') {
    const updateItemStatus = (item: any, key: 'watchlist' | 'favourite', value: boolean) => ({
      ...item,
      [key]: value,
    });

    if (type === "watchlist") {
      if (action === 'remove') {
        setWatchlist((prev: any) => prev.filter((item: any) => item.id !== id));
        setFavourites((prev: any) =>
          prev.map((item: any) =>
            item.id === id ? updateItemStatus(item, 'watchlist', false) : item
          )
        );
      } else {
        const itemExists = watchlist.some((item: any) => item.id === id);
        if (!itemExists) {
          const baseItem = favourites.find((item: any) => item.id === id);
          const newItem = baseItem
            ? updateItemStatus(baseItem, 'watchlist', true)
            : {
              id,
              tmdbId: id,
              watchlist: true,
              favourite: false,
            };
          setWatchlist((prev: any) => [newItem, ...prev]);
          setFavourites((prev: any) =>
            prev.map((item: any) =>
              item.id === id ? updateItemStatus(item, 'watchlist', true) : item
            )
          );
        }
      }
    } else if (type === "favourites") {
      if (action === 'remove') {
        setFavourites((prev: any) => prev.filter((item: any) => item.id !== id));
        setWatchlist((prev: any) =>
          prev.map((item: any) =>
            item.id === id ? updateItemStatus(item, 'favourite', false) : item
          )
        );
      } else {
        const itemExists = favourites.some((item: any) => item.id === id);
        if (!itemExists) {
          const baseItem = watchlist.find((item: any) => item.id === id);
          const newItem = baseItem
            ? updateItemStatus(baseItem, 'favourite', true)
            : {
              id,
              tmdbId: id,
              watchlist: false,
              favourite: true,
            };
          setFavourites((prev: any) => [newItem, ...prev]);
          setWatchlist((prev: any) =>
            prev.map((item: any) =>
              item.id === id ? updateItemStatus(item, 'favourite', true) : item
            )
          );
        }
      }
    }
  }

  useEffect(() => {
    const newAvatarUrl = `${Endpoints.IMG_VIEW}/${username}.webp`;
    setAvatarUrl(newAvatarUrl);
    if (username === cookieUsername) setIsCurrentUserProfile(true)
    else setIsCurrentUserProfile(false);
  }, [username, avatarVersion]);

  useEffect(() => {
    setIs404(false);
    setUser({
      username: username,
      avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
      createdAt: new Date("2023-01-01"),
    });
    async function fetchUser() {
      // const me = await fetchMe();
      const me = await getCurrentUser();
      if (me?.username && me?.username?.toLowerCase() === username?.toLowerCase()) {
        setUser((prev: any) => {
          const updated = { ...prev, ...me };
          setIsCurrentUserProfile(true);
          setAvatarUrl(me?.avatarUrl);
          return updated;
        });
      }
    }

    async function fetchUserByUsrname() {
      const userByUsername = await fetchUserByUsername(username!);
      if (userByUsername) {
        setUser((prev: any) => ({ ...prev, ...userByUsername }));
        setAvatarUrl(userByUsername?.avatarUrl);
        window.history.replaceState({}, '', `/#/profile/` + userByUsername.username);
      } else {
        setIs404(true);
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

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favEndpoint = `${Endpoints.FAVOURITES}?username=${user.username}`;
        const watchEndpoint = `${Endpoints.WATCHLIST}?username=${user.username}`;
        const watchedList = `${Endpoints.WATCHED}?username=${user.username}`;

        const [favouritesData, watchlistData, watchedListData] = await Promise.all([
          fetchAllPages(favEndpoint),
          fetchAllPages(watchEndpoint),
          fetchAllPages(watchedList)
        ]);

        setFavourites(
          (favouritesData as any)
            .map((item: { [key: string]: any }) => ({
              ...item,
              id: item.tmdbId
            }))
            .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        );

        setWatchlist(
          (watchlistData as any)
            .map((item: { [key: string]: any }) => ({
              ...item,
              id: item.tmdbId
            }))
            .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        );

        setWatched(
          (watchedListData as any)
            .map((item: { [key: string]: any }) => ({
              ...item,
              id: item.tmdbId
            }))
            .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (user.username) fetchData();
  }, [user.username]);

  useEffect(() => {
    setaccountStats([
      { value: watched.length, label: "Films Watched" },
      { value: favourites.length, label: "Favorites" },
      { value: watchlist.length, label: "Watchlist" },
      { value: "WiP", label: "Avg Rating" }
    ]);
  }, [watched, favourites, watchlist])

  if (is404) {
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

          <div
            className="mt-4 d-flex justify-content-between"
            style={{ maxWidth: "500px", margin: "auto" }}
          >
            {accountStats.map((stat: any, index: any) => (
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
            margin: "24px auto 0px auto",
            padding: "24px",
            marginTop: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="col-12">
            <MoviesCarouselV2
              similarMovies={favourites ?? []}
              title="Favourites"
              accountPage={true}
              stateHandler={stateHandler}
              isCurrentUserProfile={isCurrentUserProfile}
              username={username}
            />
          </div>
        </div>


        <div
          className="row"
          style={{
            margin: "24px auto 29px auto",
            padding: "24px",
            marginTop: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="col-12">
            <MoviesCarouselV2
              similarMovies={watchlist ?? []}
              title="Watchlist"
              accountPage={true}
              stateHandler={stateHandler}
              isCurrentUserProfile={isCurrentUserProfile}
              username={username}
            />
          </div>

        </div>

        <div
          className="row"
          style={{
            margin: "24px auto 29px auto",
            padding: "24px",
            marginTop: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="col-12">
            <MoviesCarouselV2
              similarMovies={watched ?? []}
              title="Watched"
              accountPage={true}
              stateHandler={stateHandler}
              isCurrentUserProfile={isCurrentUserProfile}
              username={username}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;