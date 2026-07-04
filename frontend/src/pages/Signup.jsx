import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Card, TextField, Button, StatusBanner } from "../design-system/components";

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

      setMessage("Account created successfully.");
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="page--centered">
      <Card elevated padding="42px" style={{ width: "100%", maxWidth: 420 }}>
        <div className="auth-card-header">
          <h1 style={{ font: "var(--text-h1-hero)" }}>Create account</h1>
          <p>Sign up to start tracking your expenses</p>
        </div>

        <StatusBanner error={error} message={message} />

        <form className="stacked-form" onSubmit={handleSignup}>
          <TextField
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit">Sign up</Button>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
