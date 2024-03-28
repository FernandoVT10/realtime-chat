import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App/>
    <ToastContainer
      position="top-center"
      theme="dark"
      autoClose={2000}
      hideProgressBar
    />
  </React.StrictMode>
);
