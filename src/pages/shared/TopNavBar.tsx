import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { User2Icon } from "lucide-react";
import { ExitToApp, LogoutOutlined, Refresh } from "@mui/icons-material";
import { Endpoints } from "../../config/Config";
import { getCurrentUser, logout } from "../../services/UserService";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
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

export default function TopNavBar({ onClick, displaySearch }: SearchBarProps) {
  const navigate = useNavigate();
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
    logout()
    setUser(null);
    window.location.hash = "/";
    // navigate("/");
    // window.location.reload();
  };

  const handleUserBtn = () => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user?.username) {
        setUser(user);
        navigate(`/profile/${user?.username}`);
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#loginModal");
        button.style.display = "none";

        document.body.appendChild(button);
        button.click();
        document.body.removeChild(button);

      }
    }
    fetchUser();
  }

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.0)" }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <img
              src="/assets/movieplus-logo-no-bg.png"
              alt="Movie Plus Logo"
              style={{ height: "50px", cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Box>
          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", md: "block", cursor: "pointer" } }}
            onClick={() => navigate("/")}
          >
            Movie Plus
          </Typography>

          {/* Search Bar */}
          {displaySearch && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                id="movieSearchInput"
                placeholder="Search…"
                inputProps={{ "aria-label": "movie" }}
                onChange={handleSearch}
              />
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <div className="d-flex align-items-center gap-2">
            {user?.username ? (
              <Button
                sx={{
                  color: "white",
                  fontSize: "1.2rem",
                  p: "2px 18px",
                  minWidth: "auto",
                  alignItems: "center",
                  borderRight: "1px solid white",
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                  display: { xs: "flex", md: "none" },
                  textTransform: "none",
                }}
                onClick={() => navigate(`/profile/${user?.username}`)}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="h6 mb-0">
                    {user?.username}
                  </span>
                  <div className="header-profile-image-container">
                    <img
                      src={`${Endpoints.IMG_VIEW}/${user?.username}.webp?ver=${refresh}`}
                      alt="pfp"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.username}&backgroundType=gradientLinear,solid`;
                      }}
                    />
                  </div>
                </div>
              </Button>
            ) : (
              <Button
                sx={{
                  color: "white",
                  fontSize: "1.2rem",
                  p: "4px 5px",
                  minWidth: "auto",
                  display: { xs: "block", md: "none" }
                }}
                onClick={() => handleUserBtn()}
              >
                <User2Icon />
              </Button>
            )}
            {/* Hamburger Icon for Mobile */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>

          {/* Desktop Menu Items */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
            <Button sx={{ color: "white" }} onClick={() => navigate("/")}>
              Home
            </Button>
            <Button
              sx={{ color: "white" }}
              onClick={() => navigate("/multiSearch")}
            >
              Search
            </Button>
            <Button sx={{ color: "white" }} onClick={() => navigate("/movies")}>
              Movies
            </Button>
            <Button
              sx={{ color: "white" }}
              onClick={() => navigate("/tv-shows")}
            >
              TV Shows
            </Button>
            <Button sx={{ color: "white" }} onClick={() => navigate("/help")}>
              Help
            </Button>

            {user?.username ? (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    padding: "2px 18px",
                    borderLeft: "1px solid white",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    textTransform: "none"
                  }}
                >
                  <span className="h6 mb-0">
                    {user?.username}
                  </span>
                  <div className="header-profile-image-container">
                    <img
                      src={`${Endpoints.IMG_VIEW}/${user?.username}.webp?ver=${refresh}`}
                      alt="pfp"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.username}&backgroundType=gradientLinear,solid`;
                      }}
                    />
                  </div>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                  style={{
                    backgroundColor: "#061337",
                    border: "1px solid #0c2052",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
                  }}
                >
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2"
                      href={`/#/profile/${user?.username}`}
                      style={{ color: "#f5f5f5" }}
                    >
                      <i className="bi bi-person-circle"></i> Profile
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2"
                      href="/#/settings"
                      style={{ color: "#f5f5f5" }}
                    >
                      <i className="bi bi-gear-fill"></i> Settings
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" style={{ borderColor: "#0c2052" }} /></li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2"
                      href="#"
                      onClick={handleLogout}
                      style={{ color: "#f5f5f5" }}
                    >
                      <ExitToApp /> Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className="btn"
                type="button"
                onClick={() => handleUserBtn()}
                style={{
                  color: "white",
                  fontSize: "1.2rem",
                  padding: "4px 18px",
                  minWidth: "auto"
                }}
              >
                <User2Icon />
              </button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundImage:
              "url(https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            width: 200, // Smaller width
            padding: 2, // Add padding inside the drawer
          },
        }}
      >

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            sx={{ width: "100%", color: "white", fontSize: "1.2rem" }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            sx={{ width: "100%", color: "white", fontSize: "1.2rem" }}
            onClick={() => navigate("/multiSearch")}
          >
            Search
          </Button>
          <Button
            sx={{ width: "100%", color: "white", fontSize: "1.2rem" }}
            onClick={() => navigate("/movies")}
          >
            Movies
          </Button>
          <Button
            sx={{ width: "100%", color: "white", fontSize: "1.2rem" }}
            onClick={() => navigate("/tv-shows")}
          >
            TV Shows
          </Button>
          <Button
            sx={{ width: "100%", color: "white", fontSize: "1.2rem" }}
            onClick={() => navigate("/help")}
          >
            Help
          </Button>
          <Button
            sx={{ width: "100%", color: "white", fontSize: "1.2rem" }}
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
          {user?.username && (
            <Button
              sx={{
                color: "#FF4C4C",
                fontSize: "1.2rem",
                display: "flex",
                gap: "10px",
              }}
              onClick={() => handleLogout()}
            >
              <ExitToApp /> Logout
            </Button>
          )}
        </Box>
      </Drawer>
    </Box >
  );
}
