import { useEffect, useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";
import { NavItem } from "../design-system/components";
import "./Sidebar.css";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

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
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = getUserFromToken();

  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const displayEmail = user?.email || "";
  const initials = getInitials(user?.name || displayName);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("theme") ||
      document.documentElement.dataset.theme ||
      "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  /*
   * Close the mobile drawer whenever the route changes.
   */
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  /*
   * Prevent the page behind the drawer from scrolling.
   */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  /*
   * Allow the Escape key to close the mobile drawer.
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  const handleNavigation = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    setIsMobileOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <div className="mobile-topbar__brand">
          <div className="mobile-topbar__mark">
            <Wallet size={18} />
          </div>

          <div className="mobile-topbar__text">
            <div className="mobile-topbar__name">Ledger</div>
            <div className="mobile-topbar__tagline">
              Expense tracker
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mobile-topbar__menu"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isMobileOpen}
          aria-controls="main-sidebar"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile backdrop */}
      <button
        type="button"
        className={`sidebar-backdrop${
          isMobileOpen ? " sidebar-backdrop--visible" : ""
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-label="Close navigation menu"
        tabIndex={isMobileOpen ? 0 : -1}
      />

      {/* Desktop sidebar and mobile drawer */}
      <aside
        id="main-sidebar"
        className={`sidebar${
          isMobileOpen ? " sidebar--open" : ""
        }`}
        aria-label="Main navigation"
      >
        <div className="sidebar-mobile-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo__mark">
              <Wallet />
            </div>

            <div className="sidebar-logo__text">
              <div className="sidebar-logo__name">Ledger</div>
              <div className="sidebar-logo__tagline">
                Expense tracker
              </div>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {token ? (
            <>
              <NavItem
                as={NavLink}
                to="/"
                end
                icon={<LayoutDashboard />}
                label="Dashboard"
                onClick={handleNavigation}
              />

              <NavItem
                as={NavLink}
                to="/transactions"
                icon={<ReceiptText />}
                label="Transactions"
                onClick={handleNavigation}
              />

              <NavItem
                as={NavLink}
                to="/budget"
                icon={<PiggyBank />}
                label="Budget"
                onClick={handleNavigation}
              />

              <NavItem
                as={NavLink}
                to="/reports"
                icon={<ChartPie />}
                label="Reports"
                onClick={handleNavigation}
              />

              <NavItem
                as={NavLink}
                to="/accounts"
                icon={<Landmark />}
                label="Accounts"
                onClick={handleNavigation}
              />

              <NavItem
                as={NavLink}
                to="/categories"
                icon={<Tags />}
                label="Categories"
                onClick={handleNavigation}
              />
            </>
          ) : (
            <>
              <NavItem
                as={NavLink}
                to="/login"
                icon={<LogIn />}
                label="Login"
                onClick={handleNavigation}
              />

              <NavItem
                as={NavLink}
                to="/signup"
                icon={<UserPlus />}
                label="Signup"
                onClick={handleNavigation}
              />
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
          >
            <span className="sidebar-theme-toggle__left">
              {theme === "light" ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}

              Theme
            </span>

            <span className="sidebar-theme-toggle__right">
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>

          {token && (
            <div className="sidebar-profile">
              <div className="sidebar-profile__avatar">
                {initials || "U"}
              </div>

              <div className="sidebar-profile__info">
                <div className="sidebar-profile__name">
                  {displayName}
                </div>

                {displayEmail && (
                  <div className="sidebar-profile__email">
                    {displayEmail}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="sidebar-profile__logout"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
