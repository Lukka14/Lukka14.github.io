import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface SearchBarProps {
  onClick: (query: string) => void;
  displaySearch: boolean;
}

export default function SearchMUI_EXP({ onClick, displaySearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.0)' }}>
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img
              // src="https://gcdnb.pbrd.co/images/ju7aKvMSnS9w.png?o=1"
              src="https://gcdnb.pbrd.co/images/IMsjmeiKbRX1.png?o=1"
              alt="Movie Plus Logo"
              style={{ height: '60px', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </Box>
          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', md: 'block', cursor: 'pointer' } }}
            onClick={() => navigate('/')}
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
              inputProps={{ 'aria-label': 'movie' }}
              onChange={handleSearch}
              />
            </Search>
            )}

          {/* Hamburger Icon for Mobile */}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Menu Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Button sx={{ color: 'white' }} onClick={() => navigate('/')}>
              Home
            </Button>
            <Button sx={{ color: 'white' }} onClick={() => navigate('/multiSearch')}>
              Search
            </Button>
            <Button sx={{ color: 'white' }} onClick={() => navigate('/movies')}>
              Movies
            </Button>
            <Button sx={{ color: 'white' }} onClick={() => navigate('/tv-shows')}>
              TV Shows
            </Button>
            <Button sx={{ color: 'white' }} onClick={() => navigate('/help')}>
              Help
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundImage: 'url(https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            width: 200, // Smaller width
            padding: 2, // Add padding inside the drawer
          },
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button sx={{ width: '100%', color: 'white', fontSize: '1.2rem' }} onClick={() => navigate('/')}>
            Home
          </Button>
          <Button sx={{ width: '100%', color: 'white', fontSize: '1.2rem' }} onClick={() => navigate('/multiSearch')}>
            Search
          </Button>
          <Button sx={{ width: '100%', color: 'white', fontSize: '1.2rem' }} onClick={() => navigate('/movies')}>
            Movies
          </Button>
          <Button sx={{ width: '100%', color: 'white', fontSize: '1.2rem' }} onClick={() => navigate('/tv-shows')}>
            TV Shows
          </Button>
          <Button sx={{ width: '100%', color: 'white', fontSize: '1.2rem' }} onClick={() => navigate('/help')}>
            Help
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
