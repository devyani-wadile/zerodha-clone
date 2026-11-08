
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");

  // Fetch logged-in user's details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/verify-token",
          {
            withCredentials: true,
          }
        );

        setUsername(response.data.username);
      } catch (error) {
        console.error("Unable to fetch user details:", error);
      }
    };

    fetchUser();
  }, []);

  // Generate initials from username
  const getInitials = (name) => {
    if (!name) return "U";

    const words = name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim()
      .split(/\s+/);

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setIsProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Logout user
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3002/logout",
        {},
        {
          withCredentials: true,
        }
      );

      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to logout. Please try again.");
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img
        src="logo.png"
        alt="Zerodha Logo"
        style={{ width: "50px" }}
      />

      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>

        <hr />

        <div
          className="profile"
          onClick={handleProfileClick}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="avatar">{getInitials(username)}</div>

          <p className="username">{username || "Loading..."}</p>

          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "12px 20px",
                minWidth: "140px",
                zIndex: 1000,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <p
                onClick={handleLogout}
                style={{
                  margin: 0,
                  cursor: "pointer",
                  color: "#ff4b4b",
                  fontSize: "14px",
                }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
