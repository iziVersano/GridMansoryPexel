import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import App from "./App";

// Remove the preloader once React is ready to render
const preloader = document.getElementById("preloader");
if (preloader) {
  preloader.remove();
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GlobalStyles />
    <App />
  </BrowserRouter>
);
