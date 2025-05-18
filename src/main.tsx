import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Router from "./router";
import Providers from "./providers";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Providers>
);
