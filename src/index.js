import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ ADD THIS
import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from "react-helmet-async";



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);


