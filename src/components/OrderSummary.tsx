import React from "react";
import type { CartItem, OrderSummaryProps, IdParams } from "../utils/types";
import { useCart } from "../hooks/useCart";
import "../styles/OrderSummary.scss";
import { useNavigate } from "react-router-dom";

const OrderSummary: React.FC<OrderSummaryProps> = ({
  billingData,
  shippingCost,
  buttonText,
  handleCompleteCheckoutBtn,
}) => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const isMobile: boolean = window.innerWidth <= 800;

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

  const handleGoToProduct = (
    e: React.MouseEvent<HTMLDivElement>,
    id: IdParams
  ) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };

  const total = (cost: number, shippingCost: number): number => {
    return cost + shippingCost;
  };
  return (
    <div>
      {/* Order summary remains the same */}
      {isMobile ? (
        <div className="order-summary-mobile">
          <h2>Order summary</h2>
          <div className="divider-hdr-mobile"></div>
          <div className="cart-items-mobile">
            {cartItems.map((item: CartItem) => (
              <div key={item.product.id} className="cart-item-mobile">
                <div className="product-section-mobile">
                  <div
                    style={{
                      backgroundImage: `url(${item.product.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "50px",
                      height: "50px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    }}
                    onClick={(e) => handleGoToProduct(e, item.product.id)}
                  ></div>

                  <div className="product-details-mobile">
                    <div>
                      <p className="product-name-mobile">{item.product.name}</p>
                    </div>
                    <div className="price-quantity-mobile">
                      <p>{formatCurrency(item.price)}</p>
                      <p>Quantity {item.quantity}</p>
                    </div>
                  </div>
                </div>
                <div className="divider-product-mobile"></div>
              </div>
            ))}
          </div>

          <div className="divider-mobile"></div>

          <div className="summary-details-mobile">
            <div className="summary-row-mobile">
              <span>Subtotal</span>
              <span className="cost-mobile">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="summary-row-mobile">
              <span>Shipping</span>
              <span className="cost-mobile">
                {formatCurrency(shippingCost)}
              </span>
            </div>
            <p>
              Taxes included. Additional shipping cost will be settled upon
              delivery and will be addressed after checkout.
            </p>
          </div>

          <div className="total-row-mobile">
            <span>Total</span>
            <span>{formatCurrency(total(cartTotal, shippingCost))}</span>
          </div>
          <div className="button-section-mobile">
            <button
              className="checkout-btn-mobile"
              onClick={(e) => {
                const calculatedTotal: number = total(cartTotal, shippingCost);
                const paymentOrder = {
                  phone: billingData.phoneNumber,
                  amount: calculatedTotal,
                };
                handleCompleteCheckoutBtn(e, paymentOrder, calculatedTotal);
              }}
            >
              {buttonText}
            </button>
            <button
              className="cart-btn-mobile"
              onClick={() => {
                navigate("/cart");
              }}
            >
              Go to Cart
            </button>
          </div>
        </div>
      ) : (
        <div className="order-summary">
          <h2>Order summary</h2>
          <div className="divider-hdr"></div>
          <div className="cart-items">
            {cartItems.map((item: CartItem) => (
              <div key={item.product.id} className="cart-item">
                <div className="product-section">
                  <div
                    style={{
                      backgroundImage: `url(${item.product.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "50px",
                      height: "50px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    }}
                    onClick={(e) => handleGoToProduct(e, item.product.id)}
                  ></div>

                  <div className="product-details">
                    <div>
                      <p className="product-name">{item.product.name}</p>
                    </div>
                    <div className="price-quantity">
                      <p>{formatCurrency(item.price)}</p>
                      <p>Quantity {item.quantity}</p>
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
              <span className="cost">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="cost">{formatCurrency(shippingCost)}</span>
            </div>
            <p>
              Taxes included. Additional shipping cost will be settled upon
              delivery and will be addressed after checkout.
            </p>
          </div>

          <div className="total-row">
            <span>Total</span>
            <span>{formatCurrency(total(cartTotal, shippingCost))}</span>
          </div>
          <div className="button-section">
            <button
              className="checkout-btn"
              onClick={(e) => {
                const calculatedTotal: number = total(cartTotal, shippingCost);
                const paymentOrder = {
                  phone: billingData.phoneNumber,
                  amount: calculatedTotal,
                };
                handleCompleteCheckoutBtn(e, paymentOrder, calculatedTotal);
              }}
            >
              {buttonText}
            </button>
            <button
              className="cart-btn"
              onClick={() => {
                navigate("/cart");
              }}
            >
              Go to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
