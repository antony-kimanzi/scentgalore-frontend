/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../../styles/Account.scss";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";
import type { UpdateUserData, Order } from "../../utils/types";

export default function Account() {
  const [isEdit, setIsEdit] = useState(false);
  const { user, updateAccount } = useAuth();
  const { fetchCart } = useCart();
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrder();

  const isMobile = window.innerWidth <= 800;

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [activeTab, setActiveTab] = useState<"account" | "orders">("account");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [, setSelectedOrder] = useState<Order | null>(null);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const cleanUserData = (data: UpdateUserData): UpdateUserData => {
    const cleanedData: UpdateUserData = { ...data };

    Object.keys(cleanedData).forEach((key) => {
      const value = (cleanedData as any)[key];

      if (!value || value.trim() === "") {
        delete (cleanedData as any)[key];
      }
    });

    return cleanedData;
  };

  const handleUpdateBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    const cleanedUserData = cleanUserData(form);
    await updateAccount(cleanedUserData);
    setIsEdit(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number): string => {
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

  const calculatePrice = (price: any, quantity: number): string => {
    try {
      if (typeof price === "number") {
        const amount = price * quantity;
        return formatCurrency(amount);
      } else {
        const amount = parseFloat(price) * quantity;
        return formatCurrency(amount);
      }
    } catch {
      return "Invalid amount";
    }
  };

  const calculateItemTotal = (price: any, quantity: number): number => {
    try {
      if (typeof price === "number") {
        return price * quantity;
      } else {
        return parseFloat(price) * quantity;
      }
    } catch {
      return 0;
    }
  };

  const calculateTotalSpent = (): string => {
    const amount = orders.reduce(
      (sum, order) =>
        sum +
        (typeof order.totalAmount === "number"
          ? order.totalAmount
          : parseFloat(order.totalAmount)),
      0,
    );

    return formatCurrency(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "#4CAF50";
      case "pending":
      case "pending_payment":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      case "shipped":
        return "#2196F3";
      default:
        return "#666";
    }
  };

  const toggleOrderDetails = (order: Order) => {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
      setSelectedOrder(null);
    } else {
      setExpandedOrderId(order.id);
      setSelectedOrder(order);
    }
  };

  const renderOrderItem = (order: Order) => (
    <div key={order.id} className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h4>Order #{order.id}</h4>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-status">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status.replace("_", " ").toUpperCase()}
          </span>
          {order.isPaid && <span className="payment-badge paid">PAID</span>}
        </div>
      </div>

      <div className="order-details">
        <div className="order-meta">
          <div className="meta-item">
            <span className="meta-label">Total Amount:</span>
            <span className="meta-value">
              {typeof order.totalAmount === "number"
                ? formatCurrency(order.totalAmount)
                : formatCurrency(parseFloat(order.totalAmount))}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Payment Method:</span>
            <span className="meta-value">{order.paymentMethod}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Shipping Method:</span>
            <span className="meta-value">{order.shippingMethod}</span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="order-items">
            <h5>Items ({order.items.length})</h5>
            <div className="items-list">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="order-item">
                  {item.product?.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="item-image"
                    />
                  )}
                  <div className="item-info">
                    <span className="item-name">{item.product?.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">
                      {calculatePrice(item.price, item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="more-items">
                  +{order.items.length - 2} more items
                </div>
              )}
            </div>
          </div>
        )}

        <div className="order-actions">
          <button
            className="view-order-btn"
            onClick={() => toggleOrderDetails(order)}
          >
            {expandedOrderId === order.id ? "Hide Details" : "View Details"}
          </button>
        </div>

        {/* Expanded Order Details */}
        {expandedOrderId === order.id && order.items && (
          <div className="expanded-order-details">
            <div className="details-header">
              <h4>Order #{order.id} - All Items</h4>
              <span
                className="close-details"
                onClick={() => toggleOrderDetails(order)}
              >
                &times;
              </span>
            </div>

            <div className="all-items-list">
              {order.items.map((item, index: number) => (
                <div
                  key={`${order.id}-${index}`}
                  className="detailed-order-item"
                >
                  {item.product?.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="detailed-item-image"
                    />
                  )}
                  <div className="detailed-item-info">
                    <div className="item-main-info">
                      <span className="detailed-item-name">
                        {item.product?.name}
                      </span>
                      <span className="detailed-item-quantity">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                    <div className="item-price-info">
                      <span className="detailed-item-price">
                        {calculatePrice(item.price, item.quantity)}
                      </span>
                      <span className="item-unit-price">
                        {formatCurrency(
                          typeof item.price === "number"
                            ? item.price
                            : parseFloat(item.price),
                        )}{" "}
                        each
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">
                  {formatCurrency(
                    order.items.reduce(
                      (sum, item) =>
                        sum + calculateItemTotal(item.price, item.quantity),
                      0,
                    ),
                  )}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value">
                  {order.shippingMethod === "delivery"
                    ? "Delivery Fee"
                    : "Free Pickup"}
                </span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">Total:</span>
                <span className="summary-value">
                  {typeof order.totalAmount === "number"
                    ? formatCurrency(order.totalAmount)
                    : formatCurrency(parseFloat(order.totalAmount))}
                </span>
              </div>
            </div>

            <div className="order-contact-info">
              {order.shipping && (
                <div className="contact-section">
                  <h5>Shipping Address</h5>
                  <p>
                    {order.shipping.firstName} {order.shipping.lastName}
                  </p>
                  {order.shipping.email && <p>Email: {order.shipping.email}</p>}
                  {order.shipping.phoneNumber && (
                    <p>Phone: {order.shipping.phoneNumber}</p>
                  )}
                  {order.shipping.city && <p>City: {order.shipping.city}</p>}
                  {order.shipping.apartment && (
                    <p>Apartment: {order.shipping.apartment}</p>
                  )}
                  {order.shipping.postalCode && (
                    <p>Postal Code: {order.shipping.postalCode}</p>
                  )}
                </div>
              )}

              {order.billing && (
                <div className="contact-section">
                  <h5>Billing Information</h5>
                  <p>
                    {order.billing.firstName} {order.billing.lastName}
                  </p>
                  {order.billing.email && <p>Email: {order.billing.email}</p>}
                  {order.billing.phoneNumber && (
                    <p>Phone: {order.billing.phoneNumber}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    const checkCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Error fetching cart: ", error);
      }
    };

    checkCart();
  }, [fetchCart]);

  return (
    <>
      {isMobile ? (
        <div className="account-mobile">
          <h1>My Account</h1>

          <div className="account-tabs">
            <button
              className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              Account Details
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Order History
            </button>
          </div>

          {activeTab === "account" ? (
            <div className="left-section-mobile">
              <div className="details-hdr-mobile">
                <h2>Account Details</h2>
                {!isEdit && (
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setIsEdit(true);
                    }}
                  >
                    Edit Account
                  </button>
                )}
              </div>

              {isEdit ? (
                <form>
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange("username")}
                    required
                  />
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange("firstName")}
                    required
                  />
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange("lastName")}
                    required
                  />
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange("email")}
                    required
                  />
                  <div className="btn-section">
                    <button
                      className="cancel-btn-mobile"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setIsEdit(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-btn-mobile"
                      type="submit"
                      onClick={handleUpdateBtn}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="details-mobile">
                  <div className="info-mobile">
                    <div className="account-info-mobile">
                      <h5>Username</h5>
                      <span>{user?.username || "No username set"}</span>
                    </div>
                    <div className="account-info-mobile">
                      <h5>First Name</h5>
                      <span>{user?.firstName || "No first name set"}</span>
                    </div>
                  </div>
                  <div className="info-mobile">
                    <div className="account-info-mobile">
                      <h5>Last Name</h5>
                      <span>{user?.lastName || "No last name set"}</span>
                    </div>
                    <div className="account-info-mobile">
                      <h5>Email</h5>
                      <span>{user?.email || "No email set"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="right-section-mobile">
              <h2>Order History</h2>

              {ordersLoading ? (
                <div className="loading-orders">
                  <div className="spinner"></div>
                  <p>Loading orders...</p>
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="orders-list">{orders.map(renderOrderItem)}</div>
              ) : (
                <div className="no-orders">
                  <div className="empty-state">
                    <svg className="empty-icon" viewBox="0 0 24 24">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. Start shopping!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="account">
          <h1>My Account</h1>

          <div className="account-tabs">
            <button
              className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              Account Details
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Order History ({orders.length})
            </button>
          </div>

          <div className="account-details">
            <div className="left-section">
              {activeTab === "account" ? (
                <>
                  <div className="details-hdr">
                    <h2>Account Details</h2>
                    {!isEdit && (
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          setIsEdit(true);
                        }}
                      >
                        Edit Account
                      </button>
                    )}
                  </div>

                  {isEdit ? (
                    <form>
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="username">Username *</label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleInputChange("username")}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="firstName">First Name *</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleInputChange("firstName")}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name *</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleInputChange("lastName")}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange("email")}
                            required
                          />
                        </div>
                      </div>
                      <div className="btn-section">
                        <button
                          className="cancel-btn"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            setIsEdit(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="save-btn"
                          type="submit"
                          onClick={handleUpdateBtn}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="details">
                      <div className="info">
                        <div className="account-info">
                          <h5>Username</h5>
                          <span>{user?.username || "No username set"}</span>
                        </div>
                        <div className="account-info">
                          <h5>First Name</h5>
                          <span>{user?.firstName || "No first name set"}</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="account-info">
                          <h5>Last Name</h5>
                          <span>{user?.lastName || "No last name set"}</span>
                        </div>
                        <div className="account-info">
                          <h5>Email</h5>
                          <span>{user?.email || "No email set"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="account-info-section">
                  <h2>Account Information</h2>
                  <div className="account-summary">
                    <div className="summary-item">
                      <span className="summary-label">Member Since</span>
                      <span className="summary-value">
                        {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Orders</span>
                      <span className="summary-value">{orders.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="right-section">
              {activeTab === "account" ? (
                <div className="account-stats">
                  <h2>Account Overview</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-content">
                        <h3>{orders.length}</h3>
                        <p>Total Orders</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <h3>{calculateTotalSpent()}</h3>
                        <p>Total Spent</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <h3>{orders.filter((o) => o.isPaid).length}</h3>
                        <p>Paid Orders</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <h3>
                          {orders.filter((o) => o.status === "pending").length}
                        </h3>
                        <p>Pending Orders</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="section-header">
                    <h2>Order History</h2>
                    <div className="order-filters">
                      <select className="filter-select">
                        <option value="all">All Orders</option>
                        <option value="paid">Paid Orders</option>
                        <option value="pending">Pending Orders</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="loading-orders">
                      <div className="spinner"></div>
                      <p>Loading orders...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="orders-list">
                      {orders.map(renderOrderItem)}
                    </div>
                  ) : (
                    <div className="no-orders">
                      <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24">
                          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                          <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                        <h3>No Orders Yet</h3>
                        <p>
                          You haven't placed any orders yet. Start shopping!
                        </p>
                        <button className="shop-now-btn">Start Shopping</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
