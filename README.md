# 🧠 Personal Finance Tracker – Backend(Deployed on Render and added an Uptime Robot monitor for preventing cold start)

This is the **Node.js + Express.js** backend API for the **Personal Finance Tracker** app. It handles income, expenses, budgets, and dashboard analytics, and connects to a MongoDB database.

> 🔗 **Tech Stack:** Node.js, Express.js, MongoDB, Mongoose
> 📦 Supports full CRUD operations and insightful analytics

---

## 🚀 Features

* 📥 Create, Read, Update, Delete for:

  * Income sources
  * Expense transactions
  * Monthly Budgets
* 📊 Dashboard API:

  * Total balance
  * Income vs Expenses
  * Budget vs Actual chart data
  * Spending insights (category-wise)
* 📁 Download income/expense data as Excel files
* 🌐 Built as a RESTful API for frontend integration

---

## 🛠️ Built With

| Tech       | Purpose                       |
| ---------- | ----------------------------- |
| Express.js | Backend framework             |
| MongoDB    | NoSQL database                |
| Mongoose   | MongoDB ORM                   |
| CORS       | Cross-origin resource sharing |
| dotenv     | Environment config            |
| XLSX       | Excel export support          |
| Node.js    | JavaScript runtime            |

---

## 📁 Project Structure

```
backend/
│
├── controllers/
│   ├── incomeController.js
│   ├── expenseController.js
│   ├── budgetController.js
│   └── dashboardController.js
│
├── models/
│   ├── Income.js
│   ├── Expense.js
│   └── Budget.js
│
├── routes/
│   ├── incomeRoutes.js
│   ├── expenseRoutes.js
│   ├── budgetRoutes.js
│   └── dashboardRoutes.js
│
├── utils/
│   └── exportToExcel.js
│
├── .env
├── server.js
└── config/
    └── db.js
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/personal-finance-tracker-backend.git
cd personal-finance-tracker-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/financeTracker
```

### 4. Start the server

```bash
npm run dev
```

> The backend server will start at `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable      | Description               |
| ------------- | ------------------------- |
| `PORT`        | Port number (e.g. 5000)   |
| `MONGODB_URI` | MongoDB connection string |

---

## 🧩 Future Improvements

* Add JWT-based user authentication
* Add user-based data separation
* Enable monthly recurring budgets
* Setup Swagger API documentation

---

Deployed Link : https://yardsticks-backend.onrender.com

## 🤝 Contributing

We welcome contributions! Feel free to fork, raise issues, or open pull requests.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

