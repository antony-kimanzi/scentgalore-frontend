import React from "react";
import "../styles/CartList.scss";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import type { CartItem, IdParams } from "../utils/types";

export default function CartList() {
  const {
    cartItems,
    addItemQuantity,
    subtractItemQuantity,
    deleteCartItem,
    refreshCart,
  } = useCart();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = React.useState<Set<string>>(
    new Set()
  );
  const isMobile: boolean = window.innerWidth <= 800;

  const handleGoToProduct = (e: React.MouseEvent, id: number, name: string) => {
    e.preventDefault();
    navigate(`/product/${id}/${name}`);
  };

  const handleAddQuantity = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: IdParams
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setUpdatingItems((prev) => new Set(prev).add(id.toString()));
    try {
      await addItemQuantity(id);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  const handleSubtractQuantity = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: IdParams
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setUpdatingItems((prev) => new Set(prev).add(id.toString()));
    try {
      await subtractItemQuantity(id);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  const handleRemoveCartItem = async (id: IdParams) => {
    await deleteCartItem(id);
    await refreshCart();
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
    <>
      {isMobile ? (
        <div>
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="cart-item-mobile">
              {" "}
              {/* Use item.id instead of product.id */}
              <div className="horizontal-line-mobile"></div>
              <div className="cart-item-details-mobile">
                <div className="cart-item-image-info">
                  <h3
                    className="cart-item-name-mobile"
                    onClick={(e) =>
                      handleGoToProduct(e, item.product.id, item.product.name)
                    }
                  >
                    {item.product.name}
                  </h3>
                  <div
                    style={{
                      backgroundImage: `url(${item.product.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "90px",
                      height: "90px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    }}
                    onClick={(e) =>
                      handleGoToProduct(e, item.product.id, item.product.name)
                    }
                  ></div>
                </div>
                <div className="cart-item-info-mobile">
                  <div className="info-section-mobile">
                    <div className="total-section-mobile">
                      <span className="cart-item-total-mobile">
                        {formatCurrency(item.price)}
                      </span>
                      <div
                        className="remove-btn-mobile"
                        onClick={() => handleRemoveCartItem(item.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          id="Bin-1--Streamline-Ultimate"
                          height="24"
                          width="24"
                        >
                          <desc>
                            Bin 1 Streamline Icon: https://streamlinehq.com
                          </desc>
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

                    <div className="cart-item-quantity-mobile">
                      <span>Quantity: {item.quantity}</span>
                      <div className="quantity-controls-mobile">
                        <button
                          onClick={(e) => handleSubtractQuantity(e, item.id)}
                          disabled={updatingItems.has(item.id.toString())}
                        >
                          {updatingItems.has(item.id.toString()) ? "..." : "-"}
                        </button>
                        <span className="quantity-value-mobile">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={(e) => handleAddQuantity(e, item.id)}
                          disabled={updatingItems.has(item.id.toString())}
                        >
                          {updatingItems.has(item.id.toString()) ? "..." : "+"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              {" "}
              {/* Use item.id instead of product.id */}
              <div className="horizontal-line"></div>
              <div className="cart-item-details">
                <div
                  style={{
                    backgroundImage: `url(${item.product.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100px",
                    height: "100px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                  onClick={(e) =>
                    handleGoToProduct(e, item.product.id, item.product.name)
                  }
                ></div>
                <div className="cart-item-info">
                  <div className="info-section">
                    <h3
                      className="cart-item-name"
                      onClick={(e) =>
                        handleGoToProduct(e, item.product.id, item.product.name)
                      }
                    >
                      {item.product.name}
                    </h3>
                    <p className="cart-item-price">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="cart-item-tone">
                      <span>Tone: {item.product.category}</span>
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
                      <span>Quantity: {item.quantity}</span>
                      <div className="quantity-controls">
                        <button
                          onClick={(e) => handleSubtractQuantity(e, item.id)}
                          disabled={updatingItems.has(item.id.toString())}
                        >
                          {updatingItems.has(item.id.toString()) ? "..." : "-"}
                        </button>
                        <span className="quantity-value">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={(e) => handleAddQuantity(e, item.id)}
                          disabled={updatingItems.has(item.id.toString())}
                        >
                          {updatingItems.has(item.id.toString()) ? "..." : "+"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="total-section">
                    <span className="cart-item-total">
                      {formatCurrency(item.price)}
                    </span>
                    <div
                      className="remove-btn"
                      onClick={() => handleRemoveCartItem(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="Bin-1--Streamline-Ultimate"
                        height="24"
                        width="24"
                      >
                        <desc>
                          Bin 1 Streamline Icon: https://streamlinehq.com
                        </desc>
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
      )}
    </>
  );
}
