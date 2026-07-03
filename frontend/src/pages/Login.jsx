import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";

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

      console.log("Login response:", data);

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
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your Smart Expense Tracker account</p>

        <StatusMessage error={error} message={message} />

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-link-text">
          Forgot password? This feature will be added later.
        </p>
      </div>
    </div>
  );
}

export default Login;