import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

import { registerUser } from "../api/authApi";
import {
  TextField,
  Button,
  StatusBanner,
} from "../design-system/components";

import "./Auth.css";

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.accountDeleted) {
      setMessage("Your account has been deleted successfully.");

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.pathname, location.state, navigate]);

  const passwordRules = {
    minimumLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!passwordIsValid) {
      setError("Please make sure your password meets all requirements.");
      setMessage("");
      return;
    }

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

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "Unable to create account. Please try again.");
      setMessage("");
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
            Start with
            <br />
            a clear month.
          </h2>

          <p className="auth-brand__sub">
            Set up in under a minute. Add your accounts, sketch a few
            envelopes, and you&apos;re tracking.
          </p>
        </div>

        <div className="auth-brand__testimonial">
          <p className="auth-brand__quote">
            &ldquo;Finally a budget I actually keep open. The envelopes just
            make sense.&rdquo;
          </p>

          <p className="auth-brand__quote-attr">
            — A very organized beta user
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h1 className="auth-form__title">Create your account</h1>

          <p className="auth-form__sub">
            Free while in development.
          </p>

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="password-rules">
              <p className="password-rules__title">
                Your password must contain:
              </p>

              <p
                className={`password-rule ${
                  passwordRules.minimumLength ? "password-rule--met" : ""
                }`}
              >
                {passwordRules.minimumLength ? "✓" : "○"} At least 8 characters
              </p>

              <p
                className={`password-rule ${
                  passwordRules.uppercase ? "password-rule--met" : ""
                }`}
              >
                {passwordRules.uppercase ? "✓" : "○"} One uppercase letter
              </p>

              <p
                className={`password-rule ${
                  passwordRules.lowercase ? "password-rule--met" : ""
                }`}
              >
                {passwordRules.lowercase ? "✓" : "○"} One lowercase letter
              </p>

              <p
                className={`password-rule ${
                  passwordRules.number ? "password-rule--met" : ""
                }`}
              >
                {passwordRules.number ? "✓" : "○"} One number
              </p>

              <p
                className={`password-rule ${
                  passwordRules.specialCharacter
                    ? "password-rule--met"
                    : ""
                }`}
              >
                {passwordRules.specialCharacter ? "✓" : "○"} One special
                character
              </p>
            </div>

            <TextField
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit">
              Create account
            </Button>
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
