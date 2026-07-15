import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";

import { TextField, Button, StatusBanner } from "../design-system/components";
import { API_BASE_URL } from "../api/config";

import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to process request.");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand__logo">
          <div className="auth-brand__mark">
            <Wallet size={20} />
          </div>

          <span className="auth-brand__name">Ledger</span>
        </div>

        <div className="auth-brand__body">
          <h2 className="auth-brand__headline">
            Forgot your password?
          </h2>

          <p className="auth-brand__sub">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h1 className="auth-form__title">
            Reset Password
          </h1>

          <StatusBanner error={error} message={message} />

          <form className="stacked-form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit">
              Send Reset Link
            </Button>
          </form>

          <p className="auth-footnote">
            <Link to="/login" className="auth-footnote__link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;