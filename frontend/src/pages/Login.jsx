import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Card, TextField, Button, StatusBanner } from "../design-system/components";

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
    <div className="page--centered">
      <Card elevated padding="42px" style={{ width: "100%", maxWidth: 420 }}>
        <div className="auth-card-header">
          <h1 style={{ font: "var(--text-h1-hero)" }}>Welcome back</h1>
          <p>Login to your Ledger account</p>
        </div>

        <StatusBanner error={error} message={message} />

        <form className="stacked-form" onSubmit={handleLogin}>
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

          <Button type="submit">Login</Button>
        </form>

        <p className="auth-footnote">
          Forgot password? This feature will be added later.
        </p>
      </Card>
    </div>
  );
}

export default Login;
