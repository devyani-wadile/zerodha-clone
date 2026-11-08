
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, price, mode = "BUY" }) => {
  const generalContext = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(Number(price) || 0);
  const [loading, setLoading] = useState(false);

  const isBuy = mode === "BUY";

  useEffect(() => {
    setStockPrice(Number(price) || 0);
    setStockQuantity(1);
  }, [uid, price, mode]);

  const handleOrderClick = async () => {
    const quantity = Number(stockQuantity);
    const priceValue = Number(stockPrice);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      alert("Please enter a valid stock price.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3002/newOrder",
        {
          name: uid,
          qty: quantity,
          price: priceValue,
          mode: mode,
        },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);

      generalContext.closeBuyWindow();

    } catch (error) {
      console.error("Order placement failed:", error);

      alert(
        error.response?.data?.message ||
        "Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              min="0.05"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          Order value: ₹
          {(Number(stockQuantity) * Number(stockPrice)).toLocaleString("en-IN")}
        </span>

        <div>
          <button
            className={`btn ${isBuy ? "btn-blue" : "btn-red"}`}
            onClick={handleOrderClick}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isBuy
              ? "Buy"
              : "Sell"}
          </button>

          <button
            className="btn btn-grey"
            onClick={handleCancelClick}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
