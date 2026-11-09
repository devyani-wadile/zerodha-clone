
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import axios from "axios";

import "./index.css";
import Home from "./components/Home";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://zerodha-clone-cu3e.onrender.com";

const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "https://zerodha-clone-eight-sable.vercel.app";

const ProtectedDashboard = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const verifyUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");

        if (tokenFromUrl) {
          sessionStorage.setItem("authToken", tokenFromUrl);

          // Remove token from browser address bar.
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        const token = sessionStorage.getItem("authToken");

        if (!token) {
          throw new Error("Authentication token missing");
        }

        await axios.get(`${API_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isActive) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error.response?.data || error.message
        );

        sessionStorage.removeItem("authToken");

        if (isActive) {
          window.location.replace(`${FRONTEND_URL}/login`);
        }
      }
    };

    verifyUser();

    return () => {
      isActive = false;
    };
  }, []);

  if (isChecking) {
    return <h3>Checking authentication...</h3>;
  }

  return children;
};

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedDashboard>
              <Home />
            </ProtectedDashboard>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
