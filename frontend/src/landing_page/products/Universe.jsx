
import React from "react";

import smallcaseLogo from "../../../media/images/images/smallcaseLogo.png";
import streakLogo from "../../../media/images/images/streakLogo.png";
import sensibullLogo from "../../../media/images/images/sensibullLogo.svg";
import zerodhaFundhouseLogo from "../../../media/images/images/zerodhaFundhouse.png";
import goldenpiLogo from "../../../media/images/images/goldenpiLogo.png";
import dittoLogo from "../../../media/images/images/dittoLogo.png";

function Universe() {
  const platforms = [
    {
      logo: smallcaseLogo,
      name: "Smallcase",
      description: "Thematic investment platform",
    },
    {
      logo: streakLogo,
      name: "Streak",
      description: "Algo & strategy platform",
    },
    {
      logo: sensibullLogo,
      name: "Sensibull",
      description: "Options trading platform",
    },
    {
      logo: zerodhaFundhouseLogo,
      name: "Zerodha Fund House",
      description: "Asset management",
    },
    {
      logo: goldenpiLogo,
      name: "GoldenPi",
      description: "Bonds trading platform",
    },
    {
      logo: dittoLogo,
      name: "Ditto",
      description: "Insurance",
    },
  ];

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1>The Zerodha Universe</h1>

        <p>
          Extend your trading and investment experience even further
          with our partner platforms
        </p>
      </div>

      <div className="row text-center mt-5">
        {platforms.map((platform) => (
          <div className="col-md-4 col-12 p-3 mb-4" key={platform.name}>
            <div
              style={{
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={platform.logo}
                alt={platform.name}
                style={{
                  maxWidth: "220px",
                  width: "100%",
                  maxHeight: "80px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            <p className="text-small text-muted mt-2">
              {platform.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mb-5">
        <button
          className="btn btn-primary fs-5 px-5 py-2"
          style={{ minWidth: "280px" }}
        >
          Signup Now
        </button>
      </div>
    </div>
  );
}

export default Universe;
