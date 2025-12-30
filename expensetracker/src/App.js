import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseChart from "./components/ExpenseChart";
import Login from "./login";
import Register from "./Register";
import api from "./api";
import "./App.css";
import jsPDF from "jspdf";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState("login");
  const [selectedMonth, setSelectedMonth] = useState("");
  


  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
      fetchExpenses();
    }
  }, []);

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = async () => {
    try {
      const res = await api.get("expenses/");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- LOGIN SUCCESS ----------------
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchExpenses();
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setAuthPage("login");
  };

  // ---------------- AUTH PAGES ----------------
  if (!isAuthenticated) {
    if (authPage === "register") {
      return <Register onBackToLogin={() => setAuthPage("login")} />;
    }
    return (
    <Login
      onLogin={handleLoginSuccess}
      onShowRegister={() => setAuthPage("register")}
    />
  );
    
  }

  // ---------------- MONTH FILTER ----------------
  const filteredExpenses =
    selectedMonth === ""
      ? expenses
      : expenses.filter(
          (e) => new Date(e.date).getMonth() === Number(selectedMonth)
        );

  // ---------------- TOTAL ----------------
  const totalSpent = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // ---------------- CATEGORY TOTALS ----------------
  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    const cat = e.category.toLowerCase();
    categoryTotals[cat] =
      (categoryTotals[cat] || 0) + Number(e.amount);
  });

  // ---------------- ML PREDICTION ----------------
  const growthFactor = 1.1;
  const predictedExpenses = {};

  Object.keys(categoryTotals).forEach((cat) => {
    predictedExpenses[cat] =
      cat === "rent"
        ? categoryTotals[cat].toFixed(2)
        : (categoryTotals[cat] * growthFactor).toFixed(2);
  });

  const predictedTotal = Object.values(predictedExpenses)
    .reduce((s, v) => s + Number(v), 0)
    .toFixed(2);

  // ---------------- PDF ----------------
  const downloadMonthlySummary = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Expense Summary", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Total Spent: Rs. ${totalSpent}`, 20, y);
    y += 10;

    filteredExpenses.forEach((e) => {
      doc.text(`${e.date} | ${e.title} | Rs. ${e.amount}`, 20, y);
      y += 7;
    });

    doc.save("Expense_Report.pdf");
  };

  return (
    <div className="app-container">
      <h1 className="app-title">💸 Expense Tracker</h1>

      <div className="logout-bar">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <select
          className="form-input"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(2025, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-top">
        <div className="card dashboard-box">
          <ExpenseChart expenses={filteredExpenses} />
        </div>

        <div className="card dashboard-box total-card">
          <p>Total Expenses</p>
          <h2>Rs. {totalSpent}</h2>
        </div>
      </div>

      <div className="card">
        <button className="download-btn" onClick={downloadMonthlySummary}>
          📄 Download Report
        </button>
      </div>

      <div className="card">
        <ExpenseForm onExpenseAdded={fetchExpenses} />
      </div>

      <div className="card">
        <div className="history-header" onClick={() => setShowHistory(!showHistory)}>
          <h2>Expense History</h2>
          <span>{showHistory ? "▲" : "▼"}</span>
        </div>

        {showHistory &&
          filteredExpenses.map((e) => (
            <div className="expense-item" key={e.id}>
              <div>
                <div className="expense-title">{e.title}</div>
                <div className="expense-meta">
                  <span className="category-badge">{e.category}</span>
                  <span>{e.date}</span>
                </div>
              </div>

              <div className="expense-amount">Rs. {e.amount}</div>
            </div>
          ))}
      </div>

      <div className="card prediction-card">
        <h2>📈 Next Month Prediction</h2>
        <strong>Total Predicted: Rs. {predictedTotal}</strong>
      </div>
    </div>
  );
}

export default App;
