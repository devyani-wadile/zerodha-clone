
import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://zerodha-clone-cu3e.onrender.com";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const token = sessionStorage.getItem("authToken");

        const response = await axios.get(
          `${API_URL}/allHoldings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllHoldings(response.data);
      } catch (err) {
        console.error("Error fetching holdings:", err);
        setError("Unable to load holdings.");
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const totalInvestment = allHoldings.reduce(
    (total, stock) => total + stock.avg * stock.qty,
    0
  );

  const currentValue = allHoldings.reduce(
    (total, stock) => total + stock.price * stock.qty,
    0
  );

  const totalProfitLoss = currentValue - totalInvestment;

  const profitPercentage =
    totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

  const formatCurrency = (value) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return <h3>Loading holdings...</h3>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {allHoldings.length === 0 ? (
        <p>No holdings available yet.</p>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Cur. val</th>
                  <th>P&L</th>
                  <th>Net chg.</th>
                  <th>Day chg.</th>
                </tr>
              </thead>

              <tbody>
                {allHoldings.map((stock) => {
                  const curValue = stock.price * stock.qty;
                  const investment = stock.avg * stock.qty;
                  const profitLoss = curValue - investment;

                  const profClass =
                    profitLoss >= 0 ? "profit" : "loss";

                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={stock._id}>
                      <td>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>{Number(stock.avg).toFixed(2)}</td>
                      <td>{Number(stock.price).toFixed(2)}</td>
                      <td>{curValue.toFixed(2)}</td>

                      <td className={profClass}>
                        {profitLoss.toFixed(2)}
                      </td>

                      <td className={profClass}>{stock.net}</td>
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col">
              <h5>₹{formatCurrency(totalInvestment)}</h5>
              <p>Total investment</p>
            </div>

            <div className="col">
              <h5>₹{formatCurrency(currentValue)}</h5>
              <p>Current value</p>
            </div>

            <div className="col">
              <h5 className={totalProfitLoss >= 0 ? "profit" : "loss"}>
                ₹{formatCurrency(totalProfitLoss)} (
                {profitPercentage.toFixed(2)}%)
              </h5>
              <p>P&L</p>
            </div>
          </div>

          <VerticalGraph data={data} />
        </>
      )}
    </>
  );
};

export default Holdings;
