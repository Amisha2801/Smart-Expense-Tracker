import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link className="nav-card active" to="/">
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>

        <Link className="nav-card" to="/transactions">
          <span className="nav-icon blue">💳</span>
          <span>Transactions</span>
        </Link>

        <Link className="nav-card" to="/budget">
          <span className="nav-icon green">💰</span>
          <span>Budget</span>
        </Link>

        <Link className="nav-card" to="/reports">
          <span className="nav-icon pink">📊</span>
          <span>Reports</span>
        </Link>

        <Link className="nav-card" to="/login">
          <span className="nav-icon purple">🔐</span>
          <span>Login</span>
        </Link>

        <Link className="nav-card" to="/signup">
          <span className="nav-icon orange">👤</span>
          <span>Signup</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <span className="footer-icon">💸</span>
        <p>Stay on track and achieve your goals!</p>
      </div>
    </aside>
  );
}

export default Sidebar;