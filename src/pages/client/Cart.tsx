// In Cart.tsx
import React from "react";
import "../../styles/Cart.scss";
import { Link, useNavigate } from "react-router-dom";
import CartList from "../../components/CartList";
import { useCart } from "../../hooks/useCart";

export default function Cart() {
  const { cart, cartItems, cartTotal, isLoading, fetchCart } = useCart();
  const isMobile: boolean = window.innerWidth <= 800;
  const navigate = useNavigate();
  const shippingCost: number = 0;

  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/shop");
  };

  const handleGoToCheckout = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    navigate(`/checkout/${id}`);
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

  const total = (cost: number, shippingCost: number): number => {
    return cost + shippingCost;
  };

  // Fetch cart on mount
  React.useEffect(() => {
    const checkCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Error fetching cart: ", error);
      }
    };

    checkCart();
  }, [fetchCart]);
  // Remove the useEffect since cart loads automatically now
  // The provider handles initial loading

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="cart-page-mobile">
          {cart && cartItems.length > 0 ? (
            <>
              <h2>Cart</h2>
              <div className="cart-mobile">
                <div className="cart-items-mobile">
                  <CartList />
                </div>
                <div className="order-summary-mobile">
                  <h2 className="summary-title-mobile">Order Summary</h2>
                  <div className="hz-line-mobile"></div>
                  <div className="cost-section-mobile">
                    <span>Cost</span>
                    <span className="cost-mobile">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <div className="cost-section-mobile">
                    <span>Shipping</span>
                    <span className="cost-mobile">{formatCurrency(0)}</span>
                  </div>
                  <div className="hz-line-mobile"></div>
                  <div className="ttl-section-mobile">
                    <span>Estimated total</span>
                    <span>
                      {formatCurrency(total(cartTotal, shippingCost))}
                    </span>
                  </div>
                  <p>
                    Taxes included. Discounts and shipping calculated at
                    checkout.
                  </p>
                  <button
                    onClick={(e) => {
                      handleGoToCheckout(e, cart.id);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-cart-mobile">
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
            </div>
          )}
        </div>
      ) : (
        <div className="cart-page">
          {cart && cartItems.length > 0 ? (
            <>
              <h2>Cart</h2>
              <div className="cart">
                <div className="cart-items">
                  <CartList />
                </div>
                <div className="order-summary">
                  <h2 className="summary-title">Order Summary</h2>
                  <div className="hz-line"></div>
                  <div className="cost-section">
                    <span>Cost</span>
                    <span className="cost">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="cost-section">
                    <span>Shipping</span>
                    <span className="cost">{formatCurrency(0)}</span>
                  </div>
                  <div className="hz-line"></div>
                  <div className="ttl-section">
                    <span>Estimated total</span>
                    <span>
                      {formatCurrency(total(cartTotal, shippingCost))}
                    </span>
                  </div>
                  <p>
                    Taxes included. Discounts and shipping calculated at
                    checkout.
                  </p>
                  <button
                    onClick={(e) => {
                      handleGoToCheckout(e, cart.id);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-cart">
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
            </div>
          )}
        </div>
      )}
    </>
  );
}
