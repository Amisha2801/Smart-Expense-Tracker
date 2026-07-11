import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { TextField, Button, StatusBanner } from "../design-system/components";
import "./Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await registerUser(name, email, password);

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Account created successfully. You can now log in.");
    } catch (err) {
      console.error("Signup failed:", err);
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
            Start with<br />a clear month.
          </h2>
          <p className="auth-brand__sub">
            Set up in under a minute. Add your accounts, sketch a few
            envelopes, and you&apos;re tracking.
          </p>
        </div>

        <div className="auth-brand__testimonial">
          <p className="auth-brand__quote">
            &ldquo;Finally a budget I actually keep open. The envelopes just make sense.&rdquo;
          </p>
          <p className="auth-brand__quote-attr">— A very organized beta user</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h1 className="auth-form__title">Create your account</h1>
          <p className="auth-form__sub">Free while in development.</p>

          <StatusBanner error={error} message={message} />

          <form className="stacked-form" onSubmit={handleSignup}>
            <TextField
              label="Full name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit">Create account</Button>
          </form>

          <p className="auth-footnote">
            Already have an account?{" "}
            <Link to="/login" className="auth-footnote__link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
