import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

// index.html ke #root element ke andar React app render hoti hai.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter URL ke basis par frontend pages change karta hai. */}
    <BrowserRouter><App /></BrowserRouter>
  </React.StrictMode>
);
