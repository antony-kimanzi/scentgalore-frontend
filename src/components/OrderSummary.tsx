import React from "react";
import { cart } from "../data/products";
import type { OrderSummaryProps, Product } from "../utils/types";
import "../styles/OrderSummary.scss";

const OrderSummary: React.FC<OrderSummaryProps> = ({ shippingCost, buttonText }) => {
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
    return acc + product.price * (product.quantity || 1);
  }, 0);

  const total = (cost: number, shippingCost: number): number => {
    return cost + shippingCost;
  };
  return (
    <div>
      {/* Order summary remains the same */}
      <div className="order-summary">
        <h2>Order summary</h2>
        <div className="divider-hdr"></div>
        <div className="cart-items">
          {cart.map((product: Product) => (
            <div key={product.id} className="cart-item">
              <div className="product-section">
                <div
                  style={{
                    backgroundImage: `url(${product.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "50px",
                    height: "50px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                  //   onClick={(e) => handleGoToProduct(e, product.id)}
                ></div>

                <div className="product-details">
                  <div>
                    <p className="product-name">{product.name}</p>
                  </div>
                  <div className="price-quantity">
                    <p>{formatCurrency(product.price)}</p>
                    <p>Quantity {product.quantity}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="divider"></div>

        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal</span>
            <span className="cost">{formatCurrency(cost)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="cost">{formatCurrency(shippingCost)}</span>
          </div>
          <p>
                Taxes included. Additional shipping cost will be settled upon delivery and will be addressed after checkout.
              </p>
        </div>


        <div className="total-row">
          <span>Total</span>
          <span>{formatCurrency(total(cost, shippingCost))}</span>
        </div>
        <button>{buttonText}</button>
      </div>
    </div>
  );
};

export default OrderSummary;
