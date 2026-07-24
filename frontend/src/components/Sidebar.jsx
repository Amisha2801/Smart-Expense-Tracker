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
  Trash2,
} from "lucide-react";

import {
  NavItem,
  Dialog,
  TextField,
  StatusBanner,
  Button,
} from "../design-system/components";

import { deleteUserAccount } from "../api/authApi";
import "./Sidebar.css";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    return JSON.parse(atob(token.split(".")[1]));
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

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);
  const [deletePassword, setDeletePassword] =
    useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

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

  const openDeleteDialog = () => {
    setIsMobileOpen(false);
    setDeletePassword("");
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();

    if (!deletePassword) {
      setDeleteError(
        "Enter your current password to continue."
      );
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteUserAccount(deletePassword);

      localStorage.removeItem("token");
      setDeleteDialogOpen(false);

      sessionStorage.setItem(
        "accountDeletedMessage",
        "Your account has been deleted successfully."
      );

      navigate("/signup", {
        replace: true,
      });
      
    } catch (error) {
      setDeleteError(
        error.message ||
          "Unable to delete your account."
      );
    } finally {
      setIsDeleting(false);
    }
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
            <div className="mobile-topbar__name">
              Ledger
            </div>

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
          isMobileOpen
            ? " sidebar-backdrop--visible"
            : ""
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
              <div className="sidebar-logo__name">
                Ledger
              </div>

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
            <>
              <button
                type="button"
                className="sidebar-delete-account"
                onClick={openDeleteDialog}
              >
                <Trash2 size={16} />
                Delete account
              </button>

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
            </>
          )}
        </div>
      </aside>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        title="Delete your account?"
      >
        <form
          className="stacked-form"
          onSubmit={handleDeleteAccount}
        >
          <div className="delete-account-warning">
            <Trash2 size={20} />

            <div>
              <strong>This action is permanent.</strong>

              <p>
                Your login, financial accounts,
                transactions, budgets, categories and
                password-reset records will all be deleted.
                This cannot be undone.
              </p>
            </div>
          </div>

          <TextField
            label="Current password"
            type="password"
            value={deletePassword}
            onChange={(event) =>
              setDeletePassword(event.target.value)
            }
            placeholder="Enter your current password"
            autoComplete="current-password"
            disabled={isDeleting}
          />

          <StatusBanner error={deleteError} />

          <div className="ds-dialog__footer">
            <Button
              type="button"
              variant="secondary"
              onClick={closeDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <button
              type="submit"
              className="delete-account-confirm"
              disabled={isDeleting}
            >
              {isDeleting
                ? "Deleting…"
                : "Permanently delete account"}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default Sidebar;
