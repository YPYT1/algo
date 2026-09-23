import React from "react";
import { createRoot } from "react-dom/client";
import { WatchApp } from "./WatchApp";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WatchApp />
  </React.StrictMode>,
);
