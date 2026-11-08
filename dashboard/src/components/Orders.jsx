
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/allOrders",
          {
            withCredentials: true,
          }
        );

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <h3>Loading orders...</h3>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>

          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <div className="orders-table">
          <h3>Your Orders</h3>

          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Mode</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>₹{Number(order.price).toLocaleString("en-IN")}</td>
                  <td
                    className={
                      order.mode === "BUY" ? "buy" : "sell"
                    }
                  >
                    {order.mode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
