import React from "react";
import { useCart } from "../hooks/useCart";
import { Navigate } from "react-router-dom";
import Checkout from "../pages/client/Checkout"; // Your original Checkout component

const ProtectedCheckout: React.FC = () => {
  const { cartItems, isLoading, fetchCart } = useCart();
  const [hasChecked, setHasChecked] = React.useState(false);

  React.useEffect(() => {
    const verifyCart = async () => {
      await fetchCart();
      setHasChecked(true);
    };

    verifyCart();
  }, [fetchCart]);

  if (isLoading || !hasChecked) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  // Check if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  return <Checkout />;
};

export default ProtectedCheckout;
