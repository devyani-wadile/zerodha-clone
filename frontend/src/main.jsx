import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import Pricing from "./landing_page/pricing/PricingPage";
import About from "./landing_page/about/AboutPage";
import Support from "./landing_page/support/SupportPage";
import Products from "./landing_page/products/Products";
import NotFound from "./landing_page/NotFound";
import Login from "./landing_page/signup/Login";

import Navbar from "../Navbar";
import Footer from "../Footer";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Navbar />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/support" element={<Support />} />
      <Route path="/products" element={<Products />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
    </Routes>

    <Footer />
  </BrowserRouter>
);
