import React from "react";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentSuccessNotification.scss";

export const PaymentSuccessNotification: React.FC = () => {
  const { isPaymentSuccessVisible, paymentSuccessInfo, hidePaymentSuccess } =
    useNotification();
  const navigate = useNavigate();

  if (!isPaymentSuccessVisible || !paymentSuccessInfo) return null;

  const handleViewOrder = () => {
    hidePaymentSuccess();
    navigate(`/orders/${paymentSuccessInfo.orderId}`);
  };

  const handleViewAccount = () => {
    hidePaymentSuccess();
    navigate("/account/orders");
  };

  return (
    <div className="payment-success-notification">
      <div className="notification-content">
        <button className="close-btn" onClick={hidePaymentSuccess}>
          ×
        </button>

        <div className="success-icon">✓</div>

        <h3>Payment Successful!</h3>

        <p className="success-message">
          Thank you for your purchase! Your payment has been processed
          successfully.
        </p>

        <div className="order-details">
          <p>
            <strong>Order #{paymentSuccessInfo.orderId}</strong>
          </p>
          {paymentSuccessInfo.mpesaReceipt && (
            <p>
              <small>M-Pesa Receipt: {paymentSuccessInfo.mpesaReceipt}</small>
            </p>
          )}
          <p>
            <strong>
              Amount: KSh {paymentSuccessInfo.amount.toLocaleString()}
            </strong>
          </p>
        </div>

        <p className="follow-up-message">
          You can track your order status in your account dashboard.
        </p>

        <div className="action-buttons">
          <button className="view-order-btn" onClick={handleViewOrder}>
            View This Order
          </button>
          <button className="view-account-btn" onClick={handleViewAccount}>
            Go to My Orders
          </button>
        </div>
      </div>
    </div>
  );
};
