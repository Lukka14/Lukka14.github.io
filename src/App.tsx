import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/main/MainPage";
import WatchPage from "./components/watch/WatchPage";
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch" element={<WatchPage />} />
      </Routes>
    </Router>
  );
};

export default App;
