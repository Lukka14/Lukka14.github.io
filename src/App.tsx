// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/main/MainPage";
import WatchPage from "./components/watch/WatchPage";
import AccountPage from "./components/account/AccountPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MoviePage from "./components/movie/MoviePage";
import TvSeriesPage from "./components/movie/TvSeriesPage";
import MultiSearchPage from "./components/movie/MultiSearchPage";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/tv-shows" element={<TvSeriesPage />} />
        <Route path="/multiSearch" element={<MultiSearchPage />} />
        <Route path="/profile/:username" element={<AccountPage />} />
      </Routes>
    </Router>
  );
};

export default App;
