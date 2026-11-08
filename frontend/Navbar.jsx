
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img
            src="/media/images/images/logo.svg"
            style={{ width: "25%" }}
            alt="Logo"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/signup"
                style={{ marginLeft: "40px" }}
              >
                Signup
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/login"
                style={{ marginLeft: "40px" }}
              >
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/about"
                style={{ marginLeft: "40px" }}
              >
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/products"
                style={{ marginLeft: "40px" }}
              >
                Product
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/pricing"
                style={{ marginLeft: "40px" }}
              >
                Pricing
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/support"
                style={{ marginLeft: "40px" }}
              >
                Support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
