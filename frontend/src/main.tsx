import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <App />
      </CartProvider>
    </ErrorBoundary>
    <Toaster position="top-right" richColors closeButton />
  </StrictMode>
);