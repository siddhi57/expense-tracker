import { useState } from "react";
import api from "./api";
import "./App.css";

function Register({ onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/register/", {
        username,
        password,
      });

      setSuccess("Account created! Please login.");
      setUsername("");
      setPassword("");

      // ⏳ small delay then go back
      setTimeout(() => {
        onBackToLogin();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass">
        <h1 className="login-title">💸 Expense Tracker</h1>
        <p className="login-subtitle">
          Create your account to get started
        </p>

        <div className="login-card">
          <h2>Register</h2>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <form onSubmit={handleRegister} className="login-form">
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
              Create Account
            </button>
          </form>

          <div className="login-footer">
            Already have an account?
            <button
              className="register-link"
              onClick={onBackToLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
