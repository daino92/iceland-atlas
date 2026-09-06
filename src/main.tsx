import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { registerSW } from "virtual:pwa-register";

import App from "@/App";
import { QUERY_CLIENT } from "@/lib";
import "@/styles.css";

registerSW({ immediate: true });

const ROOT_ELEMENT = document.getElementById("root");

if (!ROOT_ELEMENT) throw new Error("Missing application mount element: #root");

createRoot(ROOT_ELEMENT).render(
  <StrictMode>
    <QueryClientProvider client={QUERY_CLIENT}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
