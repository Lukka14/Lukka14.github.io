import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import {
  ChevronDown,
  Clapperboard,
  Dices,
  HelpCircle,
  Home,
  LogOut,
  Menu as MenuIcon,
  Search as SearchLucide,
  Settings,
  Tv,
  User2Icon,
  UserCircle2,
  X,
} from "lucide-react";
import { Endpoints } from "../../config/Config";
import { getCurrentUser, logout } from "../../services/UserService";
import { openModal } from "./modals/modal-utils";
import { DISCORD_INVITE_URL, DiscordMark } from "./DiscordIcon";
import "./top-nav.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  backgroundColor: alpha(theme.palette.common.white, 0.07),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
  "&:focus-within": {
    borderColor: "rgba(129, 140, 248, 0.6)",
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1.75),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(225, 232, 255, 0.55)",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1.5, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3.5)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "22ch",
    },
  },
}));

interface SearchBarProps {
  onClick: (query: string) => void;
  displaySearch: boolean;
}

export interface Authority {
  authority: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  avatarUrl: string;
  createdAt: Date;
  enabled: boolean;
  authorities: Authority[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search", path: "/multiSearch", icon: SearchLucide },
  { label: "Movies", path: "/multiSearch?type=movie", icon: Clapperboard },
  { label: "TV Shows", path: "/multiSearch?type=tv", icon: Tv },
  { label: "Randomizer", path: "/randomizer", icon: Dices },
  { label: "Help", path: "/help", icon: HelpCircle },
];

export default function TopNavBar({ onClick, displaySearch }: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState("");
  const [user, setUser] = React.useState<User | null>(null);

  const handleSearch = () => {
    const searchInput = document.querySelector(
      "#movieSearchInput"
    ) as HTMLInputElement;
    const query = searchInput.value;
    onClick(query);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  React.useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user?.username) setUser(user);
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setDrawerOpen(false);
    navigate("/");
  };

  const handleUserBtn = () => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user?.username) {
        setUser(user);
        navigate(`/profile/${user?.username}`);
      } else {
        openModal("loginModal");
      }
    }
    fetchUser();
  };

  React.useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      setRefresh((_) => {
        const customEvent = event as CustomEvent;
        return customEvent.detail?.timestamp || Date.now();
      });
    };

    window.addEventListener("profile-updated", handleProfileUpdated);
    return () => window.removeEventListener("profile-updated", handleProfileUpdated);
  }, []);

  const currentType = new URLSearchParams(location.search).get("type");

  const isActive = (path: string) => {
    const [pathname, query] = path.split("?");
    if (location.pathname !== pathname) return false;
    const type = query ? new URLSearchParams(query).get("type") : null;
    return (type ?? null) === (currentType ?? null);
  };

  const go = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const avatarSrc = `${Endpoints.IMG_VIEW}/${user?.username}.webp?ver=${refresh}`;
  const avatarFallback = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.username}&backgroundType=gradientLinear,solid`;

  const renderAvatar = (className = "mp-nav-avatar") => (
    <div className={className}>
      <img
        src={avatarSrc}
        alt="pfp"
        onError={(e) => {
          e.currentTarget.src = avatarFallback;
        }}
      />
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          // Below Bootstrap's modal/backdrop (1050+) so modals still cover the bar.
          zIndex: 1030,
          backgroundColor: "rgba(4, 8, 20, 0.72)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.28)",
          backgroundImage: "none",
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: { xs: 64, md: 72 } }}>
          <button
            type="button"
            className="mp-nav-brand"
            onClick={() => go("/")}
            aria-label="MoviePlus home"
          >
            <img src="/assets/movieplus-mark.svg" alt="" aria-hidden="true" />
            <span className="mp-nav-brand-text d-none d-sm-block">
              Movie<span>Plus</span>
            </span>
          </button>

          {displaySearch && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                id="movieSearchInput"
                placeholder="Search movies & series…"
                inputProps={{ "aria-label": "movie" }}
                onChange={handleSearch}
              />
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop navigation */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`mp-nav-link${isActive(item.path) ? " is-active" : ""}`}
                onClick={() => go(item.path)}
              >
                {item.label}
              </button>
            ))}

            <Box sx={{ width: "1px", height: 24, bgcolor: "rgba(255,255,255,0.12)", mx: 1 }} />

            <Tooltip title="Join our Discord">
              <a
                className="mp-nav-discord"
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our Discord"
              >
                <DiscordMark size={19} />
              </a>
            </Tooltip>

            {user?.username ? (
              <div className="dropdown">
                <button
                  className="mp-nav-user"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {renderAvatar()}
                  <span className="mp-nav-user-name">{user.username}</span>
                  <ChevronDown size={15} className="mp-nav-user-caret" />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end mp-nav-menu"
                  aria-labelledby="userDropdown"
                >
                  <li className="mp-nav-menu-head">
                    <span className="mp-nav-menu-name">{user.username}</span>
                    <span className="mp-nav-menu-sub">Signed in</span>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/profile/${user.username}`}>
                      <UserCircle2 size={17} /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <Settings size={17} /> Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item is-danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} /> Log out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className="mp-nav-signin"
                type="button"
                onClick={() => handleUserBtn()}
              >
                <User2Icon size={17} />
                Sign in
              </button>
            )}
          </Box>

          {/* Mobile controls */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
            {user?.username ? (
              <button
                type="button"
                className="mp-nav-user is-icon-only"
                onClick={() => go(`/profile/${user.username}`)}
                aria-label="Open profile"
              >
                {renderAvatar()}
              </button>
            ) : (
              <button
                type="button"
                className="mp-nav-icon-btn"
                onClick={() => handleUserBtn()}
                aria-label="Sign in"
              >
                <User2Icon size={19} />
              </button>
            )}

            <button
              type="button"
              className="mp-nav-icon-btn"
              aria-label="Open menu"
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon size={20} />
            </button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 285,
            maxWidth: "85vw",
            backgroundColor: "rgba(8, 12, 26, 0.96)",
            backgroundImage: "none",
            backdropFilter: "blur(22px)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.09)",
            color: "white",
          },
        }}
      >
        <div className="mp-drawer">
          <div className="mp-drawer-head">
            <span className="mp-nav-brand-text">
              Movie<span>Plus</span>
            </span>
            <button
              type="button"
              className="mp-nav-icon-btn"
              onClick={() => toggleDrawer(false)}
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          </div>

          {user?.username ? (
            <button
              type="button"
              className="mp-drawer-user"
              onClick={() => go(`/profile/${user.username}`)}
            >
              {renderAvatar()}
              <span style={{ minWidth: 0 }}>
                <span className="mp-drawer-user-name">{user.username}</span>
                <span className="mp-drawer-user-sub">View profile</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="mp-nav-signin w-100 justify-content-center mb-3"
              onClick={() => {
                setDrawerOpen(false);
                handleUserBtn();
              }}
            >
              <User2Icon size={17} />
              Sign in
            </button>
          )}

          <nav className="mp-drawer-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`mp-drawer-link${isActive(item.path) ? " is-active" : ""}`}
                onClick={() => go(item.path)}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className={`mp-drawer-link${isActive("/settings") ? " is-active" : ""}`}
              onClick={() => go("/settings")}
            >
              <Settings size={18} />
              Settings
            </button>

            <a
              className="mp-drawer-link mp-drawer-discord"
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toggleDrawer(false)}
            >
              <DiscordMark size={18} />
              Join our Discord
            </a>
          </nav>

          {user?.username && (
            <div className="mp-drawer-foot">
              <button
                type="button"
                className="mp-drawer-link is-danger"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          )}
        </div>
      </Drawer>
    </Box>
  );
}
