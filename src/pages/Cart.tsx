import React from "react";
import "../styles/Cart.scss";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/shop");
  };
  return (
    <div className="cart">
      <h2>Your cart is empty</h2>
      <button onClick={e => handleContinueShopping(e)}>
        Continue Shopping
      </button>
      <div className="login-section">
        <h3>Have an account?</h3>
        <p>
          <Link to={"/signin"} className="login-link">
            Login
          </Link>{" "}
          to check out faster
        </p>
      </div>
    </div>
  );
}
