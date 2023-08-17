import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import TwitterContextProvider from "./components/TwitterAuth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TwitterContextProvider>
      <App />
    </TwitterContextProvider>
  </React.StrictMode>
);
