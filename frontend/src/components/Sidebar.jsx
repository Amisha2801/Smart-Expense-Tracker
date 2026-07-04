import { NavLink, useNavigate } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  ChartPie,
  Landmark,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { NavItem } from "../design-system/components";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
            <NavItem icon={<LogOut />} label="Logout" onClick={handleLogout} />
          </>
        ) : (
          <>
            <NavItem as={NavLink} to="/login" icon={<LogIn />} label="Login" />
            <NavItem as={NavLink} to="/signup" icon={<UserPlus />} label="Signup" />
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <Wallet size={16} />
        <p>Stay on track and achieve your goals.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
