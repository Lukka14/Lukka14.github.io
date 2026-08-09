import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, CalendarDays, Eye, Heart, Mail, Settings } from "lucide-react";
import { Endpoints } from "../../config/Config";
import { Media } from "../../models/Movie";
import { fetchMedia, fetchUserByUsername } from "../../services/MediaService";
import { fetchAllPages } from "../../utils/Utils";
import { Background } from "../main/Background";
import NotFoundPage from "../shared/NotFoundPage";
import PrimarySearchAppBar from "../shared/TopNavBar";
import MoviesCarouselV2 from "../watch/components/MovieCarouselV2/MoviesCarouselV2";
import { getCurrentUser, getUsername } from "../../services/UserService";
import "./account-page.css";

const FALLBACK_BACKDROP =
  "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true";

const byNewest = (a: any, b: any) =>
  new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();

const withId = (items: any) =>
  (items as any[]).map((item) => ({ ...item, id: item.tmdbId })).sort(byNewest);

const AccountPage: React.FC = () => {
  const [, setMedias] = useState<Media[]>([]);
  const { username } = useParams<{ username: string }>();
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [avatarVersion] = useState(Date.now());
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const cookieUsername = getUsername();
  const [is404, setIs404] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<any>([]);
  const [watchlist, setWatchlist] = useState<any>([]);
  const [watched, setWatched] = useState<any>([]);

  const [user, setUser] = useState<any>({
    username: username,
    avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
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
    setAvatarUrl(`${Endpoints.IMG_VIEW}/${username}.webp`);
    setIsCurrentUserProfile(username === cookieUsername);
  }, [username, avatarVersion]);

  useEffect(() => {
    setIs404(false);
    setUser({
      username: username,
      avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
    });

    async function fetchUser() {
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
        window.history.replaceState({}, '', `/profile/` + userByUsername.username);
      } else {
        setIs404(true);
      }
    }

    if (cookieUsername && username?.toLowerCase() == cookieUsername?.toLowerCase()) {
      fetchUser();
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
        const [favouritesData, watchlistData, watchedListData] = await Promise.all([
          fetchAllPages(`${Endpoints.FAVOURITES}?username=${user.username}`),
          fetchAllPages(`${Endpoints.WATCHLIST}?username=${user.username}`),
          fetchAllPages(`${Endpoints.WATCHED}?username=${user.username}`),
        ]);

        setFavourites(withId(favouritesData));
        setWatchlist(withId(watchlistData));
        setWatched(withId(watchedListData));
      } catch (error) {
        console.error(error);
      }
    };

    if (user.username) fetchData();
  }, [user.username]);

  if (is404) {
    return <NotFoundPage />;
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
    : null;

  const stats = [
    { label: "Watched", value: watched.length, icon: Eye, to: "watched" },
    { label: "Favourites", value: favourites.length, icon: Heart, to: "favourites" },
    { label: "Watchlist", value: watchlist.length, icon: Bookmark, to: "watchlist" },
  ];

  const lists = [
    { title: "Favourites", items: favourites },
    { title: "Watchlist", items: watchlist },
    { title: "Watched", items: watched },
  ];

  return (
    <div className="profile-page">
      <Background url={FALLBACK_BACKDROP} />
      <div className="profile-scrim" />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

      <div className="profile-shell">
        <header className="profile-header">
          <div className="profile-avatar-ring">
            <img
              key={`avatar-${avatarVersion}`}
              src={avatarUrl}
              alt={`${user.username ?? "User"} avatar`}
              className="profile-avatar"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = user.avatar;
              }}
            />
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h1 className="profile-name">{user.username}</h1>
              {isCurrentUserProfile && <span className="profile-you-badge">You</span>}
            </div>

            <div className="profile-meta">
              {user?.email && (
                <span className="profile-meta-item">
                  <Mail size={15} />
                  {user.email}
                </span>
              )}
              {memberSince && (
                <span className="profile-meta-item">
                  <CalendarDays size={15} />
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>

          {isCurrentUserProfile && (
            <div className="profile-header-actions">
              <Link to="/settings" className="profile-edit-btn">
                <Settings size={16} />
                Edit profile
              </Link>
            </div>
          )}
        </header>

        <div className="profile-stats">
          {stats.map(({ label, value, icon: Icon, to }) => (
            <Link
              key={label}
              to={`/profile/${username}/${to}`}
              className="profile-stat"
            >
              <span className="profile-stat-icon">
                <Icon size={19} />
              </span>
              <span>
                <span className="profile-stat-value">{value}</span>
                <span className="profile-stat-label">{label}</span>
              </span>
            </Link>
          ))}
        </div>

        {lists.map(({ title, items }) => (
          <section className="profile-section" key={title}>
            <MoviesCarouselV2
              similarMovies={items ?? []}
              title={title}
              accountPage={true}
              stateHandler={stateHandler}
              isCurrentUserProfile={isCurrentUserProfile}
              username={username}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
