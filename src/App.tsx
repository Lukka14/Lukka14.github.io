// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import WatchPage from "./pages/watch/WatchPage";
import AccountPage from "./pages/account/AccountPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import MultiSearchPage from "./pages/movie/MultiSearchPage";
import HelpPage from "./pages/about/HelpPage";
import RegisterRedirect from "./pages/register/RegisterRedirect";
import DevelopmentFooter from "./pages/shared/development-footer/DevelopmentFooter";
import UpdateNotifier from "./pages/shared/update-banner/UpdateNotifier";
import VerifyEmailPage from "./pages/verify-email/VerifyEmailPage";
import PasswordResetPage from "./pages/password-reset/PasswordResetPage";
import NotFoundPage from "./pages/shared/NotFoundPage";
import SettingsPage from "./pages/account/SettingsPage";
import ListSearch from "./pages/account/ListSearch/ListSearch";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/movies" element={<Navigate to="/multiSearch?type=movie" replace />} />
        <Route path="/tv-shows" element={<Navigate to="/multiSearch?type=tv" replace />} />
        <Route path="/multiSearch" element={<MultiSearchPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/register" element={<RegisterRedirect />} />
        <Route path="/profile/:username" element={<AccountPage />} />
        <Route path="/profile/:username/:list-type" element={<ListSearch />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/password/:token" element={<PasswordResetPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* <DevelopmentFooter /> */}
      <UpdateNotifier />
    </Router>
  );
};

export default App;
