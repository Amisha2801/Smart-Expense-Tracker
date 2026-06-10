import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink className={({ isActive }) => isActive ? "nav-card active" : "nav-card"} to="/">
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink className={({ isActive }) => isActive ? "nav-card active" : "nav-card"} to="/transactions">
          <span className="nav-icon blue">💳</span>
          <span>Transactions</span>
        </NavLink>

        <NavLink className={({ isActive }) => isActive ? "nav-card active" : "nav-card"} to="/budget">
          <span className="nav-icon green">💰</span>
          <span>Budget</span>
        </NavLink>

        <NavLink className={({ isActive }) => isActive ? "nav-card active" : "nav-card"} to="/reports">
          <span className="nav-icon pink">📊</span>
          <span>Reports</span>
        </NavLink>

        <NavLink className={({ isActive }) => isActive ? "nav-card active" : "nav-card"} to="/login">
          <span className="nav-icon purple">🔐</span>
          <span>Login</span>
        </NavLink>

        <NavLink className={({ isActive }) => isActive ? "nav-card active" : "nav-card"} to="/signup">
          <span className="nav-icon orange">👤</span>
          <span>Signup</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span className="footer-icon">💸</span>
        <p>Stay on track and achieve your goals!</p>
      </div>
    </aside>
  );
}

export default Sidebar;