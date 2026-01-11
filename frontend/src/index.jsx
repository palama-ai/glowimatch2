import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");

// Use hydrateRoot if the page was pre-rendered, otherwise use createRoot
// This enables SSR/pre-rendering compatibility for SEO crawlers
if (container.hasChildNodes()) {
    hydrateRoot(container, <App />);
} else {
    const root = createRoot(container);
    root.render(<App />);
}
