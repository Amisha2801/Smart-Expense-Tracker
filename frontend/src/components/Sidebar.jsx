import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  ChartPie,
  Landmark,
  Tags,
  LogIn,
  UserPlus,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { NavItem } from "../design-system/components";
import "./Sidebar.css";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("");
}

function Sidebar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getUserFromToken();

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const initials = getInitials(user?.name || displayName);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || document.documentElement.dataset.theme || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo__mark">
          <Wallet />
        </div>
        <div className="sidebar-logo__text">
          <div className="sidebar-logo__name">Ledger</div>
          <div className="sidebar-logo__tagline">Expense tracker</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {token ? (
          <>
            <NavItem as={NavLink} to="/" end icon={<LayoutDashboard />} label="Dashboard" />
            <NavItem as={NavLink} to="/transactions" icon={<ReceiptText />} label="Transactions" />
            <NavItem as={NavLink} to="/budget" icon={<PiggyBank />} label="Budget" />
            <NavItem as={NavLink} to="/reports" icon={<ChartPie />} label="Reports" />
            <NavItem as={NavLink} to="/accounts" icon={<Landmark />} label="Accounts" />
            <NavItem as={NavLink} to="/categories" icon={<Tags />} label="Categories" />
          </>
        ) : (
          <>
            <NavItem as={NavLink} to="/login" icon={<LogIn />} label="Login" />
            <NavItem as={NavLink} to="/signup" icon={<UserPlus />} label="Signup" />
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-theme-toggle" onClick={toggleTheme}>
          <span className="sidebar-theme-toggle__left">
            {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
            Theme
          </span>
          <span className="sidebar-theme-toggle__right">
            {theme === "light" ? "Light" : "Dark"}
          </span>
        </button>

        {token && (
          <div className="sidebar-profile">
            <div className="sidebar-profile__avatar">{initials || "U"}</div>
            <div className="sidebar-profile__info">
              <div className="sidebar-profile__name">{displayName}</div>
              {displayEmail && (
                <div className="sidebar-profile__email">{displayEmail}</div>
              )}
            </div>
            <button
              className="sidebar-profile__logout"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
