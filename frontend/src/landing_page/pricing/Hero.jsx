
import React from "react";

import pricingEquity from "../../../media/images/images/pricingEquity.svg";

import intradayTrades from "../../../media/images/images/intradayTrades.svg";

import pricingMF from "../../../media/images/images/pricingMF.svg";

function Hero() {
  return (
    <div className="container">
      {/* Pricing Heading */}
      <div className="row p-5 mt-5 border-bottom text-center">
        <h1>Pricing</h1>
        <h3 className="text-muted mt-3 fs-5">
          Free equity investments and flat ₹20 trading and F&O trades
        </h3>
      </div>

      {/* Pricing Illustrations */}
      <div className="row p-5 mt-5 text-center">

        {/* Equity Delivery */}
        <div className="col-md-4 col-12 p-4">
          <img
            src={pricingEquity}
            alt="Free equity delivery"
            className="img-fluid mb-3"
          />
          <h1 className="fs-3">Free equity delivery</h1>
          <p className="text-muted">
            All equity delivery investments (NSE, BSE),
            are absolutely free — ₹0 brokerage.
          </p>
        </div>

        {/* Intraday Trades */}
        <div className="col-md-4 col-12 p-4">
          <img
            src={intradayTrades}
            alt="Intraday and F&O trades"
            className="img-fluid mb-3"
          />
          <h1 className="fs-3">Intraday and F&O trades</h1>
          <p className="text-muted">
            Flat Rs. 20 or 0.03% (whichever is lower)
            per executed order on intraday trades
            across equity, currency, and commodity trades.
          </p>
        </div>

        {/* Mutual Funds */}
        <div className="col-md-4 col-12 p-4">
          <img
            src={pricingMF}
            alt="Free direct mutual funds"
            className="img-fluid mb-3"
          />
          <h1 className="fs-3">Free direct MF</h1>
          <p className="text-muted">
            All direct mutual fund investments are
            absolutely free — ₹0 commissions and DP charges.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Hero;
