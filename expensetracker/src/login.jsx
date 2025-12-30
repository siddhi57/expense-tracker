import { useState } from "react";
import axios from 'axios';
import "./App.css";

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
  "http://127.0.0.1:8000/api/token/",
  {
    username,
    password,
  }
);


      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      onLogin();
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass">
        <h1 className="login-title">💸 Expense Tracker</h1>
        <p className="login-subtitle">
          Track. Analyze. Predict your expenses.
        </p>

        <div className="login-card">
          <h2>Login</h2>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="login-footer">
            New here?
            <button
              className="register-link"
              onClick={onShowRegister}
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
