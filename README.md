# Zerodha Clone – Full-Stack Stock Trading Platform

A full-stack stock trading simulation platform inspired by Zerodha, built using the MERN stack. The application provides user authentication, portfolio tracking, order management, and simulated stock trading through an interactive dashboard.

## Features

- **User Authentication:** Secure signup, login, logout, and session verification using JWT and HTTP-only cookies.
- **Trading Dashboard:** Interactive dashboard for monitoring trading activity.
- **Holdings:** View stock holdings, quantities, average prices, and portfolio performance.
- **Positions:** Track current trading positions.
- **Order Management:** Place simulated BUY and SELL orders.
- **Funds Management:** Add and withdraw virtual funds and view transaction history.
- **Portfolio Overview:** Monitor account balance and investment information.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, Bootstrap, CSS |
| Dashboard | React.js, Vite, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt, HTTP-only cookies |
| Testing | Jest, React Testing Library |
| Version Control | Git, GitHub |

## Project Structure

```text
zerodha-clone/
│
├── frontend/                 # Landing page and authentication
│   ├── src/
│   ├── test/
│   └── package.json
│
├── dashboard/                # Trading dashboard
│   ├── src/
│   └── package.json
│
├── backend/                  # REST API and database operations
│   ├── middleware/
│   ├── model/
│   ├── schemas/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/devyani-wadile/zerodha-clone.git
cd zerodha-clone
```

### 2. Install dependencies

Install dependencies separately in each folder:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../dashboard
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3002
```

Replace the placeholder values with your own credentials. Never upload your actual `.env` file to GitHub.

### 4. Run the application

Open three separate terminals from the project root.

**Terminal 1 – Backend**

```bash
cd backend
npm start
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm run dev
```

**Terminal 3 – Dashboard**

```bash
cd dashboard
npm run dev
```

### 5. Local URLs

| Application | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Dashboard | http://localhost:5174 |
| Backend API | http://localhost:3002 |

## Testing

Run the frontend test suite:

```bash
cd frontend
npm test
```

## Important Note

This project is an educational stock trading simulation inspired by Zerodha. It does not connect to a real stock exchange, execute actual trades, or provide financial services. All trading activities and funds are simulated.

## Author

**Devyani Wadile**

GitHub: [@devyani-wadile](https://github.com/devyani-wadile)

---

*Built as a full-stack development project to explore frontend development, backend API design, database integration, authentication, and simulated trading workflows.*