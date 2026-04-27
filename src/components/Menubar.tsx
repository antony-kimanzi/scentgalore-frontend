/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "../styles/Menubar.scss";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface MenubarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated?: boolean;
  user?: any; // Use proper User type from your auth hook
  onLogout?: () => void;
  onAccountClick?: () => void;
  onSignInClick?: () => void;
}

const Menubar: React.FC<MenubarProps> = ({
  setOpen,
  isAuthenticated,
  user,
  onLogout,
  onAccountClick,
  onSignInClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoutBtn = async () => {
    try {
      await logout();
      setOpen(false);
      if (onLogout) onLogout();
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };

  const handleClickLink = () => {
    setOpen(false);
  };

  const handleAccountBtn = () => {
    setOpen(false);
    if (onAccountClick) {
      onAccountClick();
    } else {
      navigate("/account");
    }
  };

  const handleSignInBtn = () => {
    setOpen(false);
    if (onSignInClick) {
      onSignInClick();
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="menubar">
      <div className="menu">
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
          onClick={handleClickLink}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={`nav-link ${isActive("/shop") ? "active" : ""}`}
          onClick={handleClickLink}
        >
          Shop
        </Link>
        <Link
          to="/contact"
          className={`nav-link ${isActive("/contact") ? "active" : ""}`}
          onClick={handleClickLink}
        >
          Contact
        </Link>

        {/* Authentication Section */}
        <div className="auth-section">
          {isAuthenticated && user ? (
            <>
              <div className="user-info-mobile">
                <span className="welcome-text-mobile">
                  Hello, {user.username}
                </span>
              </div>
              <div className="btn-section">
                <button
                  className={`account-btn ${isActive("/account") ? "active" : ""}`}
                  onClick={handleAccountBtn}
                >
                  Account
                </button>
                <button className="logout-btn" onClick={handleLogoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button className="signin-btn" onClick={handleSignInBtn}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menubar;
