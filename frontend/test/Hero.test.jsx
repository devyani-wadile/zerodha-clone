
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "../src/landing_page/home/Hero";

describe("Hero Component", () => {
  test("renders hero content and signup link", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    // Check heading
    expect(
      screen.getByRole("heading", { name: "Invest in everything" })
    ).toBeInTheDocument();

    // Check description
    expect(
      screen.getByText(/Online platform to invest in stocks/)
    ).toBeInTheDocument();

    // Check hero image
    const heroImage = screen.getByAltText("Zerodha trading dashboard");

    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute(
      "src",
      "/media/images/images/homeHero.png"
    );

    // Check signup link
    const signupLink = screen.getByRole("link", {
      name: "Signup Now",
    });

    expect(signupLink).toHaveAttribute("href", "/signup");
  });
});
