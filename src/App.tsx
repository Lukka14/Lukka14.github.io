// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/main/MainPage";
import WatchPage from "./components/watch/WatchPage";
import AccountPage from "./components/account/AccountPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/profile/:username" element={<AccountPage />} />
      </Routes>
    </Router>
  );
};

export default App;
