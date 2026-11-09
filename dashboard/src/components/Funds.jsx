
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://zerodha-clone-cu3e.onrender.com";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  },
});

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [processing, setProcessing] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [filter, setFilter] = useState("ALL");

  const colors = {
    orange: "#ff5722",
    text: "#424242",
    muted: "#888888",
    border: "#e8e8e8",
    green: "#16834a",
    red: "#d64b4b",
  };

  // Fetch funds
  const fetchFunds = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/allFunds`,
        getAuthConfig()
      );

      setFunds(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching funds:", err);
      setError("Unable to load funds.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/allFundsTransactions`,
        getAuthConfig()
      );

      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchFunds();
    fetchTransactions();
  }, []);

  // Format currency
  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "ALL") return true;
    return transaction.type === filter;
  });

  // Open transaction form
  const openTransaction = (type) => {
    setTransactionType(type);
    setAmount("");
    setError("");
    setMessage("");
  };

  // Close transaction form
  const closeTransaction = () => {
    setTransactionType("");
    setAmount("");
  };

  // Handle Add Funds and Withdraw
  const handleTransaction = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      numericAmount > 10000000
    ) {
      setError("Enter a valid amount.");
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const endpoint =
        transactionType === "ADD"
          ? `${API_URL}/addFunds`
          : `${API_URL}/withdrawFunds`;

      const response = await axios.post(
        endpoint,
        { amount: numericAmount },
        getAuthConfig()
      );

      setMessage(response.data.message);

      // Refresh balance and transaction history
      await Promise.all([
        fetchFunds(),
        fetchTransactions(),
      ]);

      closeTransaction();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Transaction failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p>Loading funds...</p>;
  }

  if (!funds) {
    return <p>{error || "Unable to load funds."}</p>;
  }

  const actionButtonStyle = {
    padding: "10px 20px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  };

  const filterButtonStyle = {
    background: "transparent",
    border: "none",
    padding: "12px 4px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <>
      {/* Fund Actions */}
      <div
        className="funds"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <p style={{ color: colors.muted, marginRight: "5px" }}>
          Manage your virtual funds
        </p>

        <button
          type="button"
          onClick={() => openTransaction("ADD")}
          style={{
            ...actionButtonStyle,
            background: colors.orange,
            color: "#ffffff",
            border: `1px solid ${colors.orange}`,
          }}
        >
          + Add Funds
        </button>

        <button
          type="button"
          onClick={() => openTransaction("WITHDRAW")}
          style={{
            ...actionButtonStyle,
            background: "#ffffff",
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          Withdraw
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <p
          style={{
            color: colors.green,
            margin: "15px 0",
            fontSize: "14px",
          }}
        >
          {message}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p
          style={{
            color: colors.red,
            margin: "15px 0",
            fontSize: "14px",
          }}
        >
          {error}
        </p>
      )}

      {/* Add Funds / Withdraw Form */}
      {transactionType && (
        <div
          style={{
            padding: "24px",
            margin: "20px 0",
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            maxWidth: "420px",
            background: "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              color: colors.text,
            }}
          >
            {transactionType === "ADD"
              ? "Add Virtual Funds"
              : "Withdraw Virtual Funds"}
          </h3>

          <form onSubmit={handleTransaction}>
            <label
              style={{
                fontSize: "13px",
                color: colors.muted,
              }}
            >
              Enter amount (₹)
            </label>

            <input
              type="number"
              min="0.01"
              max="10000000"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                margin: "10px 0 20px",
                boxSizing: "border-box",
                border: `1px solid ${colors.border}`,
                borderRadius: "4px",
                outlineColor: colors.orange,
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
              disabled={processing}
              style={{
                ...actionButtonStyle,
                background: colors.orange,
                color: "#ffffff",
                border: `1px solid ${colors.orange}`,
                opacity: processing ? 0.6 : 1,
              }}
            >
              {processing
                ? "Processing..."
                : transactionType === "ADD"
                ? "Add Funds"
                : "Withdraw"}
            </button>

            <button
              type="button"
              onClick={closeTransaction}
              disabled={processing}
              style={{
                ...actionButtonStyle,
                marginLeft: "10px",
                background: "#ffffff",
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Equity Funds Details */}
      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">
                {formatCurrency(funds.availableBalance)}
              </p>
            </div>

            <div className="data">
              <p>Used margin</p>
              <p className="imp">
                {formatCurrency(funds.usedMargin)}
              </p>
            </div>

            <div className="data">
              <p>Available cash</p>
              <p className="imp">
                {formatCurrency(funds.availableBalance)}
              </p>
            </div>

            <hr />

            <div className="data">
              <p>Opening Balance</p>
              <p>{formatCurrency(100000)}</p>
            </div>

            <div className="data">
              <p>Payin</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>

            <hr />

            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div
        style={{
          marginTop: "45px",
          width: "100%",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: colors.text,
                margin: 0,
              }}
            >
              Transaction History
            </h3>

            <p
              style={{
                fontSize: "12px",
                color: colors.muted,
                marginTop: "6px",
              }}
            >
              View your recent fund activity
            </p>
          </div>

          <span
            style={{
              fontSize: "12px",
              color: colors.muted,
            }}
          >
            {filteredTransactions.length} transactions
          </span>
        </div>

        {/* Transaction Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
            borderBottom: `1px solid ${colors.border}`,
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "ALL", label: "All Transactions" },
            { value: "ADD", label: "Deposits" },
            { value: "WITHDRAW", label: "Withdrawals" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              style={{
                ...filterButtonStyle,
                color:
                  filter === item.value
                    ? colors.orange
                    : colors.muted,
                fontWeight:
                  filter === item.value ? "600" : "400",
                borderBottom:
                  filter === item.value
                    ? `2px solid ${colors.orange}`
                    : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Transaction Table */}
        {transactionsLoading ? (
          <p style={{ color: colors.muted, padding: "20px 0" }}>
            Loading transactions...
          </p>
        ) : filteredTransactions.length === 0 ? (
          <div
            style={{
              padding: "35px 15px",
              textAlign: "center",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              color: colors.muted,
              fontSize: "14px",
            }}
          >
            No transactions found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    color: colors.muted,
                  }}
                >
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "left",
                      fontWeight: "500",
                    }}
                  >
                    Date & Time
                  </th>

                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "left",
                      fontWeight: "500",
                    }}
                  >
                    Transaction Type
                  </th>

                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "right",
                      fontWeight: "500",
                    }}
                  >
                    Amount
                  </th>

                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "center",
                      fontWeight: "500",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 12px",
                        color: colors.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString("en-IN")}
                    </td>

                    <td
                      style={{
                        padding: "16px 12px",
                        color: colors.text,
                      }}
                    >
                      {transaction.type === "ADD"
                        ? "Add Funds"
                        : "Withdraw"}
                    </td>

                    <td
                      style={{
                        padding: "16px 12px",
                        textAlign: "right",
                        fontWeight: "500",
                        color:
                          transaction.type === "ADD"
                            ? colors.green
                            : colors.red,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.type === "ADD" ? "+" : "-"}₹
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td
                      style={{
                        padding: "16px 12px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          color: colors.green,
                          background: "#edf8f1",
                          padding: "5px 10px",
                          borderRadius: "3px",
                          fontSize: "12px",
                        }}
                      >
                        Successful
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Funds;
