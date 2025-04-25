// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import WatchPage from "./pages/watch/WatchPage";
import AccountPage from "./pages/account/AccountPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MoviePage from "./pages/movie/MoviePage";
import TvSeriesPage from "./pages/movie/TvSeriesPage";
import MultiSearchPage from "./pages/movie/MultiSearchPage";
import HelpPage from "./pages/about/HelpPage";
import RegisterPage from "./pages/register/RegisterPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/tv-shows" element={<TvSeriesPage />} />
        <Route path="/multiSearch" element={<MultiSearchPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:username" element={<AccountPage />} />
      </Routes>
    </Router>
  );
};

export default App;
