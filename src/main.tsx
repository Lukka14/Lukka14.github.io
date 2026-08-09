import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalProvider from "./pages/shared/modal-provider";
import { migrateLegacyResumeCookies } from "./pages/shared/RecentlyWatchService";

migrateLegacyResumeCookies();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ModalProvider />
    <App></App>
  </React.StrictMode>
);
