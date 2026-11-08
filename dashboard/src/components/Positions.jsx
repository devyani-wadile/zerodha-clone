
import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/allPositions",
          {
            withCredentials: true,
          }
        );

        setAllPositions(response.data);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Unable to load positions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return <h3>Loading positions...</h3>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h3 className="title">
        Positions ({allPositions.length})
      </h3>

      {allPositions.length === 0 ? (
        <p>No positions available yet.</p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg.</th>
                <th>LTP</th>
                <th>P&L</th>
                <th>Chg.</th>
              </tr>
            </thead>

            <tbody>
              {allPositions.map((stock) => {
                const curValue = stock.price * stock.qty;
                const investment = stock.avg * stock.qty;
                const profitLoss = curValue - investment;

                const profClass =
                  profitLoss >= 0 ? "profit" : "loss";

                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={stock._id}>
                    <td>{stock.product}</td>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{Number(stock.avg).toFixed(2)}</td>
                    <td>{Number(stock.price).toFixed(2)}</td>

                    <td className={profClass}>
                      {profitLoss.toFixed(2)}
                    </td>

                    <td className={dayClass}>
                      {stock.day}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Positions;
