import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/App.css";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import ModalProvider from "./pages/shared/modal-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ModalProvider />
    <App></App>
  </React.StrictMode>
);
