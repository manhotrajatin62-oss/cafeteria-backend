import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import LoginContextProvider from "./context/LoginContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginContextProvider>
        <App />
      </LoginContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
