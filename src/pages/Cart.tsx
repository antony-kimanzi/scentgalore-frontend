import React from "react";
import "../styles/Cart.scss";
import { Link, useNavigate } from "react-router-dom";
import { cart } from "../data/products";
import type { Product } from "../types/product";
import CartList from "../components/CartList";

export default function Cart() {
  const navigate = useNavigate();
  const shippingCost: number = 0;

  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/shop");
  };

  const handleGoToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/checkout");
  };

  const formatCurrency = (amount: number): string | number => {
    try {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return "Invalid amount";
    }
  };

  const cost = cart.reduce((acc: number, product: Product) => {
    return acc + (product.price * (product.quantity || 1));
  }, 0);

  const total = (cost: number, shippingCost: number) :number => {
    return cost + shippingCost;
  }
  return (
    <div className="cart-page">
      {cart.length > 0 ? (
        <>
          <h2>
            <span>1.</span> Cart
          </h2>
          <div className="cart">
            <div className="cart-items">
              <CartList />
            </div>
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>
              <div className="hz-line"></div>
              <div className="cost-section"><span>Cost</span><span className="cost">{formatCurrency(cost)}</span></div>
              <div className="cost-section"><span>Shipping</span><span className="cost">{formatCurrency(0)}</span></div>
              <div className="hz-line"></div>
              <div className="ttl-section"><span>Estimated total</span><span>{formatCurrency(total(cost, shippingCost))}</span></div>
              <p>Taxes included. Discounts and shipping calculated at checkout.</p>
              <button onClick={handleGoToCheckout}>Checkout</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2>Your cart is empty</h2>
          <button onClick={(e) => handleContinueShopping(e)}>
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
        </>
      )}
    </div>
  );
}
