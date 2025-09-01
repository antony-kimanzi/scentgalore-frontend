import React from "react";
import type { Product } from "../utils/types";
import { cart } from "../data/products";
import "../styles/CartList.scss";
import { useNavigate } from "react-router-dom";

export default function CartList() {
  const navigate = useNavigate();
  const handleGoToProduct = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    navigate(`/product/${id}`);
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
  return (
    <div>
      {cart.map((product: Product) => (
        <div key={product.id} className="cart-item">
          <div className="horizontal-line"></div>
          <div className="cart-item-details">
            <div
              style={{
                backgroundImage: `url(${product.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100px",
                height: "100px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
              onClick={(e) => handleGoToProduct(e, product.id)}
            ></div>
            <div className="cart-item-info">
              <div className="info-section">
                <h3
                  className="cart-item-name"
                  onClick={(e) => handleGoToProduct(e, product.id)}
                >
                  {product.name}
                </h3>
                <p className="cart-item-price">
                  {formatCurrency(product.price)}
                </p>
                <div className="cart-item-tone">
                  <span>Tone: {product.tone}</span>
                  <svg
                    version="1.1"
                    id="Chevron-Sort-Down--Streamline-Carbon"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 16 16"
                    xmlSpace="preserve"
                    enableBackground="new 0 0 32 32"
                    height="16"
                    width="16"
                  >
                    <desc>
                      Chevron Sort Down Streamline Icon:
                      https://streamlinehq.com
                    </desc>
                    <title>chevron--sort</title>
                    <path
                      d="m8 14 -3.5 -3.5 0.7 -0.7 2.8 2.8 2.8 -2.8L11.5 10.5z"
                      fill="#000000"
                      strokeWidth="0.5"
                    ></path>
                    <path
                      id="_Transparent_Rectangle_"
                      d="M0 0h16v16H0Z"
                      fill="none"
                      strokeWidth="0.5"
                    ></path>
                  </svg>
                </div>

                <div className="cart-item-quantity">
                  <span>Quantity: {product.quantity}</span>
                  <div className="quantity-controls">
                    <button>-</button>
                    <span className="quantity-value">
                      {product.quantity || 1}
                    </span>
                    <button>+</button>
                  </div>
                </div>
              </div>

              <div className="total-section">
                <span className="cart-item-total">
                  {formatCurrency(product.price * (product.quantity || 1))}
                </span>
                <div className="remove-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    id="Bin-1--Streamline-Ultimate"
                    height="24"
                    width="24"
                  >
                    <desc>Bin 1 Streamline Icon: https://streamlinehq.com</desc>
                    <g id="Bin-1--Streamline-Ultimate.svg">
                      <path
                        d="M19.45 7.5H4.55a0.5 0.5 0 0 0 -0.5 0.54l1.28 14.14a2 2 0 0 0 2 1.82h9.34a2 2 0 0 0 2 -1.82L20 8a0.5 0.5 0 0 0 -0.5 -0.54Zm-9.2 13a0.75 0.75 0 0 1 -1.5 0v-9a0.75 0.75 0 0 1 1.5 0Zm5 0a0.75 0.75 0 0 1 -1.5 0v-9a0.75 0.75 0 0 1 1.5 0Z"
                        fill="#000000"
                        strokeWidth="1"
                      ></path>
                      <path
                        d="M22 4h-4.75a0.25 0.25 0 0 1 -0.25 -0.25V2.5A2.5 2.5 0 0 0 14.5 0h-5A2.5 2.5 0 0 0 7 2.5v1.25a0.25 0.25 0 0 1 -0.25 0.25H2a1 1 0 0 0 0 2h20a1 1 0 0 0 0 -2ZM9 3.75V2.5a0.5 0.5 0 0 1 0.5 -0.5h5a0.5 0.5 0 0 1 0.5 0.5v1.25a0.25 0.25 0 0 1 -0.25 0.25h-5.5A0.25 0.25 0 0 1 9 3.75Z"
                        fill="#000000"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
