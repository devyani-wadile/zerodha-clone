
import React from "react";

const apps = [
  {
    name: "TradingView",
    category: "Charts & Analysis",
    description:
      "Explore advanced stock charts, technical indicators and market trends.",
    initials: "TV",
    color: "#2962ff",
    url: "https://www.tradingview.com/",
  },
  {
    name: "Sensibull",
    category: "Options Trading",
    description:
      "Explore options strategies, analyze positions and understand option chains.",
    initials: "S",
    color: "#6c63ff",
    url: "https://sensibull.com/",
  },
  {
    name: "Smallcase",
    category: "Investing",
    description:
      "Discover professionally managed thematic portfolios and investment ideas.",
    initials: "SC",
    color: "#00a878",
    url: "https://www.smallcase.com/",
  },
  {
    name: "Streak",
    category: "Strategy & Backtesting",
    description:
      "Explore trading strategies, technical indicators and backtesting tools.",
    initials: "ST",
    color: "#ff5722",
    url: "https://streak.tech/",
  },
];

const Apps = () => {
  return (
    <div style={styles.container}>
      {/* Page Heading */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Apps</h1>
          <p style={styles.subtitle}>
            Discover tools to enhance your trading and investing experience.
          </p>
        </div>

        <span style={styles.count}>
          {apps.length} Apps
        </span>
      </div>

      {/* Marketplace Heading */}

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Explore Applications</h2>
        <p style={styles.sectionSubtitle}>
          Tools and platforms for market research, analysis and investing.
        </p>
      </div>

      {/* App Cards */}

      <div style={styles.grid}>
        {apps.map((app) => (
          <div key={app.name} style={styles.card}>
            <div style={styles.cardTop}>
              <div
                style={{
                  ...styles.appIcon,
                  backgroundColor: app.color,
                }}
              >
                {app.initials}
              </div>

              <span style={styles.category}>
                {app.category}
              </span>
            </div>

            <h3 style={styles.appName}>{app.name}</h3>

            <p style={styles.description}>
              {app.description}
            </p>

            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Visit Website
              <span style={styles.arrow}>↗</span>
            </a>
          </div>
        ))}
      </div>

      {/* Disclaimer */}

      <p style={styles.disclaimer}>
        These are external platforms. Accessing them does not connect
        them to your Zerodha Clone account.
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: "35px",
    minHeight: "100vh",
    background: "#ffffff",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "45px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#424242",
    margin: 0,
  },

  subtitle: {
    fontSize: "14px",
    color: "#888888",
    marginTop: "10px",
  },

  count: {
    fontSize: "12px",
    color: "#ff5722",
    background: "#fff3ed",
    padding: "7px 13px",
    borderRadius: "20px",
  },

  sectionHeader: {
    marginBottom: "22px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#424242",
    margin: 0,
  },

  sectionSubtitle: {
    fontSize: "13px",
    color: "#999999",
    marginTop: "7px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  card: {
    border: "1px solid #eeeeee",
    borderRadius: "6px",
    padding: "22px",
    background: "#ffffff",
    transition: "box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: "215px",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "22px",
  },

  appIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
  },

  category: {
    fontSize: "11px",
    color: "#888888",
    background: "#f7f7f7",
    padding: "6px 9px",
    borderRadius: "3px",
  },

  appName: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#424242",
    margin: "0 0 10px",
  },

  description: {
    fontSize: "13px",
    lineHeight: "1.7",
    color: "#888888",
    margin: "0 0 20px",
    flex: 1,
  },

  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: "#ff5722",
    fontSize: "13px",
    fontWeight: "500",
    textDecoration: "none",
    alignSelf: "flex-start",
  },

  arrow: {
    fontSize: "16px",
  },

  disclaimer: {
    fontSize: "12px",
    color: "#aaaaaa",
    marginTop: "30px",
    lineHeight: "1.6",
  },
};

export default Apps;
