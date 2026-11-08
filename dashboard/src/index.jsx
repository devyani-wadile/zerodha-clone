
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

// Protect dashboard from unauthenticated access
const ProtectedDashboard = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const verifyUser = async () => {
      try {
        await axios.get(
          "http://localhost:3002/verify-token",
          {
            withCredentials: true,
          }
        );

        if (isActive) {
          setIsChecking(false);
        }
      } catch (error) {
        if (isActive) {
          window.location.replace(
            "http://localhost:5173/login"
          );
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
