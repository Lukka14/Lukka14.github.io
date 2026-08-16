import { lazy, Suspense } from "react";
import MainPage from "./pages/main/MainPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import UpdateNotifier from "./pages/shared/update-banner/UpdateNotifier";
import ErrorBoundary from "./pages/shared/ErrorBoundary";
import { LoadingSpinner } from "./pages/main/LoadingSpinner";

// The landing page stays in the main bundle so the most common entry point
// renders without a second round trip. Everything else loads on demand.
const WatchPage = lazy(() => import("./pages/watch/WatchPage"));
const AccountPage = lazy(() => import("./pages/account/AccountPage"));
const MultiSearchPage = lazy(() => import("./pages/movie/MultiSearchPage"));
const HelpPage = lazy(() => import("./pages/about/HelpPage"));
const RegisterRedirect = lazy(() => import("./pages/register/RegisterRedirect"));
const VerifyEmailPage = lazy(() => import("./pages/verify-email/VerifyEmailPage"));
const PasswordResetPage = lazy(() => import("./pages/password-reset/PasswordResetPage"));
const NotFoundPage = lazy(() => import("./pages/shared/NotFoundPage"));
const SettingsPage = lazy(() => import("./pages/account/SettingsPage"));
const ListSearch = lazy(() => import("./pages/account/ListSearch/ListSearch"));
const RandomizerPage = lazy(() => import("./pages/randomizer/RandomizerPage"));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner initial />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/movies" element={<Navigate to="/multiSearch?type=movie" replace />} />
            <Route path="/tv-shows" element={<Navigate to="/multiSearch?type=tv" replace />} />
            <Route path="/multiSearch" element={<MultiSearchPage />} />
            <Route path="/randomizer" element={<RandomizerPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/register" element={<RegisterRedirect />} />
            <Route path="/profile/:username" element={<AccountPage />} />
            <Route path="/profile/:username/:list-type" element={<ListSearch />} />
            <Route path="/verify/:token" element={<VerifyEmailPage />} />
            <Route path="/password/:token" element={<PasswordResetPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <UpdateNotifier />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
