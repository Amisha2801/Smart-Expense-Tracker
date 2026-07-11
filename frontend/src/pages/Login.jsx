import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { Wallet, PiggyBank, ChartPie, Zap } from "lucide-react";
import { TextField, Button, StatusBanner } from "../design-system/components";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const data = await loginUser(email, password);

      if (data.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      setMessage("Login successful.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="auth-page">
      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand__logo">
          <div className="auth-brand__mark">
            <Wallet size={20} />
          </div>
          <span className="auth-brand__name">Ledger</span>
        </div>

        <div className="auth-brand__body">
          <h2 className="auth-brand__headline">
            Money,<br />minus the anxiety.
          </h2>
          <p className="auth-brand__sub">
            Give every dollar a job, watch your envelopes fill, and always know
            what&apos;s safe to spend.
          </p>
        </div>

        <ul className="auth-brand__features">
          <li>
            <span className="auth-brand__feature-icon">
              <PiggyBank size={15} style={{ color: "var(--pos)" }} />
            </span>
            Envelope budgeting that rolls over
          </li>
          <li>
            <span className="auth-brand__feature-icon">
              <ChartPie size={15} style={{ color: "var(--cat-trans)" }} />
            </span>
            Reports that read like a story
          </li>
          <li>
            <span className="auth-brand__feature-icon">
              <Zap size={15} style={{ color: "var(--cat-dine)" }} />
            </span>
            Two-tap expense logging
          </li>
        </ul>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h1 className="auth-form__title">Welcome back</h1>
          <p className="auth-form__sub">Sign in to pick up where you left off.</p>

          <StatusBanner error={error} message={message} />

          <form className="stacked-form" onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Log in</Button>
          </form>

          <p className="auth-footnote">
            New to Ledger?{" "}
            <Link to="/signup" className="auth-footnote__link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
