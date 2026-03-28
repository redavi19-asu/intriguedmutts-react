import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/consent.css";
import { ConsentProvider } from "./context/ConsentContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConsentProvider>
      <App />
    </ConsentProvider>
  </React.StrictMode>
);
