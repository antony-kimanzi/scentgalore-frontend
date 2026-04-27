/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type {
  InputProps,
  PaymentOrder,
  OrderData,
  QueryResponse,
} from "../../utils/types";
import "../../styles/Checkout.scss";
import OrderSummary from "../../components/OrderSummary";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useOrder, type useOrderReturn } from "../../hooks/useOrder";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// Import order service directly for additional functionality
import { orderService } from "../../services/orderService";
import { useNotification } from "../../contexts/NotificationContext";

const FloatingInput: React.FC<InputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
}) => {
  const [hasValue, setHasvalue] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasvalue(!!e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="floating-input">
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        className={`form-input ${hasValue && "has-value"}`}
      />
      <label htmlFor={id} className="form-label">
        {label}
      </label>
    </div>
  );
};

interface RadioInputProps extends InputProps {
  name: string;
  checked?: boolean;
}

const FloatingRadioInput: React.FC<RadioInputProps> = ({
  id,
  label,
  name,
  value,
  checked,
  onChange,
}) => {
  return (
    <div>
      <div className={`options ${checked && "is-checked"}`}>
        <label htmlFor={id} className="radio-label">
          {label}
        </label>
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="radio-input"
        />
      </div>
    </div>
  );
};

// Add to your PaymentProcessingModal component in Checkout.tsx
// Update the ManualVerifyButton component
const ManualVerifyButton: React.FC<{
  orderId?: number;
  checkoutRequestID?: string;
  onVerify: () => void; // This should just trigger the parent's onVerify
}> = ({ orderId, checkoutRequestID, onVerify }) => {
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleManualVerify = async () => {
    if (!orderId || !checkoutRequestID) return;

    setIsVerifying(true);
    try {
      const response = await fetch("/api/payment/manual-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderId,
          checkoutRequestID,
        }),
      });

      const data = await response.json();

      if (data.success && data.isPaid) {
        // Call the parent's onVerify callback instead
        onVerify();
      } else {
        toast.error("Payment not found. Please wait or contact support.");
      }
    } catch (error) {
      console.error("Manual verify error:", error);
      toast.error("Failed to verify payment");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <button
      className="manual-verify-btn"
      onClick={handleManualVerify}
      disabled={isVerifying || !orderId || !checkoutRequestID}
    >
      {isVerifying ? "Verifying..." : "Manually Verify Payment"}
    </button>
  );
};

const PaymentProcessingModal: React.FC<{
  isOpen: boolean;
  paymentStatus: "idle" | "processing" | "success" | "error" | "pending";
  checkoutRequestID?: string;
  orderId?: number;
  errorMessage?: string;
  paymentDetails?: any;
  calculatedTotal?: number;
  orderData?: OrderData;
  createdOrderId?: number;
  onClose: () => void;
  onRetry?: () => void;
  onVerify?: () => void;
}> = ({
  isOpen,
  paymentStatus,
  checkoutRequestID,
  orderId,
  errorMessage,
  paymentDetails,
  calculatedTotal = 0,
  orderData,
  createdOrderId,
  onClose,
  onRetry,
  onVerify,
}) => {
  if (!isOpen) return null;

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "processing":
        return "Waiting for you to complete payment on your phone...";
      case "pending":
        return "Payment is being processed. You can check back later.";
      case "success":
        return "Payment completed! Your order is being processed.";
      case "error":
        return "Payment failed. Please try again.";
      default:
        return "Processing payment...";
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-content">
          {paymentStatus === "processing" && (
            <div className="payment-loader">
              <div className="spinner"></div>
              <p className="payment-status-message">{getStatusMessage()}</p>
              <p className="payment-instructions">
                Please check your phone for the M-Pesa prompt. Enter your PIN to
                complete the payment.
              </p>
              {checkoutRequestID && (
                <p className="payment-reference">
                  Reference: {checkoutRequestID}
                </p>
              )}
              <ManualVerifyButton
                orderId={createdOrderId || orderId}
                checkoutRequestID={checkoutRequestID}
                onVerify={onVerify || (() => {})}
              />
            </div>
          )}

          {paymentStatus === "pending" && (
            <div className="payment-pending">
              <div className="pending-icon">⏳</div>
              <h3>Payment Pending</h3>
              <p className="payment-status-message">{getStatusMessage()}</p>
              <p className="payment-next-steps">
                We're processing your payment. You can check your order status
                in your account.
              </p>
              <button className="payment-close-btn" onClick={onClose}>
                View Order
              </button>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h3>Payment Successful!</h3>

              {paymentDetails && (
                <div className="payment-details">
                  <p>
                    <strong>M-Pesa Receipt:</strong>{" "}
                    {paymentDetails.mpesaReceipt || "Pending"}
                  </p>
                  <p>
                    <strong>Amount:</strong> KSh{" "}
                    {paymentDetails.paymentAmount || calculatedTotal}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {paymentDetails.paymentPhone ||
                      orderData?.billing?.phoneNumber}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {paymentDetails.paymentDate
                      ? new Date(paymentDetails.paymentDate).toLocaleString()
                      : "Just now"}
                  </p>
                </div>
              )}

              <p className="payment-status-message">
                Your order #{createdOrderId || orderId} has been confirmed!
              </p>

              <button className="payment-close-btn" onClick={onClose}>
                View Order Details
              </button>
            </div>
          )}

          {paymentStatus === "error" && (
            <div className="payment-error">
              <div className="error-icon">✗</div>
              <h3>Payment Failed</h3>
              <p className="payment-status-message">{getStatusMessage()}</p>
              {errorMessage && <p className="error-details">{errorMessage}</p>}
              <div className="payment-error-buttons">
                <button className="payment-close-btn error" onClick={onClose}>
                  Cancel
                </button>
                {onRetry && (
                  <button className="payment-retry-btn" onClick={onRetry}>
                    Retry Payment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const {
    createOrder,
    completePayment,
    clearCartForMpesa,
    queryStatus,
  }: useOrderReturn = useOrder();
  const { fetchCart } = useCart();
  const { user } = useAuth();
  const { showPaymentSuccess } = useNotification(); // Add this line
  const [shippingAddress, setShippingAddress] = React.useState<string>("");
  const [paymentDetails, setPaymentDetails] = React.useState<any>(null);
  const [buttonText, setButtonText] =
    React.useState<string>("Complete Checkout");
  const isMobile: boolean = window.innerWidth <= 800;
  const [paymentOrder, setPaymentOrder] = React.useState<PaymentOrder | null>(
    null,
  );

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState<
    "idle" | "processing" | "success" | "error" | "pending"
  >("idle");
  const [checkoutRequestID, setCheckoutRequestID] = React.useState<string>("");
  const [createdOrderId, setCreatedOrderId] = React.useState<number | null>(
    null,
  );
  const [paymentErrorMessage, setPaymentErrorMessage] =
    React.useState<string>("");

  // Add refs for polling control
  const isPollingRef = React.useRef(false);
  const pollingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [orderData, setOrderData] = React.useState<OrderData>({
    contact: "",
    paymentMethod: "",
    shippingMethod: "",
    totalAmount: 0,
    isPaid: false,
    billing: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      apartment: "",
      postalCode: "",
    },
  });
  const shippingCost = orderData.shippingMethod === "delivery" ? 500 : 0;

  const billingData = orderData.billing ?? {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };

  const shippingData = orderData.shipping ?? {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    apartment: "",
    postalCode: "",
  };

  const { id } = useParams<{ id: string }>();
  const cartId = id ? parseInt(id, 10) : NaN;
  const navigate = useNavigate();

  // Clean up polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
      isPollingRef.current = false;
    };
  }, []);

  const handleOrderInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setOrderData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === "paymentMethod") {
        if (value === "pay now with mpesa") setButtonText("Proceed to Payment");
        else setButtonText("Complete Checkout");
      }
    };

  const handleBillingInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setOrderData((prev) => ({
        ...prev,
        billing: {
          ...prev.billing!,
          [field]: value,
        },
      }));
    };

  const handleShippingInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setOrderData((prev) => ({
        ...prev,
        shipping: {
          ...prev.shipping!,
          [field]: value,
        },
      }));
    };

  const handleShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShippingAddress(e.target.value);
  };

  const cleanOrderData = (data: OrderData): OrderData => {
    const cleanedData: OrderData = { ...data };

    if (!cleanedData.contact) {
      cleanedData.contact = "";
    }

    Object.keys(cleanedData).forEach((key) => {
      const value = (cleanedData as any)[key];
      if (
        typeof value !== "string" ||
        key === "paymentMethod" ||
        key === "shippingMethod"
      ) {
        return;
      }

      if (!value || value.trim() === "") {
        delete (cleanedData as any)[key];
      }
    });

    if (cleanedData.billing) {
      const cleanedBilling: any = {};
      Object.keys(cleanedData.billing).forEach((key) => {
        const value = (cleanedData.billing as any)[key];
        if (value && value.trim() !== "") {
          cleanedBilling[key] = value;
        } else {
          if (
            key === "firstName" ||
            key === "lastName" ||
            key === "phoneNumber"
          ) {
            cleanedBilling[key] = "";
          }
        }
      });
      cleanedData.billing = cleanedBilling;
    } else {
      cleanedData.billing = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      };
    }

    if (cleanedData.shippingMethod === "delivery" && cleanedData.shipping) {
      const cleanedShipping: any = {};
      let hasShippingData = false;

      Object.keys(cleanedData.shipping).forEach((key) => {
        const value = (cleanedData.shipping as any)[key];
        if (value && value.trim() !== "") {
          cleanedShipping[key] = value;
          hasShippingData = true;
        }
      });

      if (hasShippingData) {
        cleanedData.shipping = cleanedShipping;
      } else {
        delete cleanedData.shipping;
      }
    } else {
      delete cleanedData.shipping;
    }

    return cleanedData;
  };

  const validateOrderData = (
    data: OrderData,
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.contact || data.contact.trim() === "") {
      errors.push("Contact information is required");
    }

    if (!data.paymentMethod) {
      errors.push("Payment method is required");
    }

    if (!data.shippingMethod) {
      errors.push("Shipping method is required");
    }

    if (
      data.paymentMethod === "pay now with mpesa" &&
      (!data.billing || !data.billing.phoneNumber)
    ) {
      errors.push("Phone number is required for M-Pesa payment");
    }

    if (
      data.shippingMethod === "delivery" &&
      (!data.shipping || !data.shipping.phoneNumber)
    ) {
      errors.push("Phone number is required for delivery");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Add this function to your Checkout component
  const queryMpesaStatus = async (
    checkoutRequestID: string,
  ): Promise<QueryResponse> => {
    try {
      const response = await queryStatus(checkoutRequestID);
      return response;
    } catch (error) {
      console.error("Query M-Pesa status error:", error);
      return {
        success: false,
        isPaid: false,
        message: "Failed to query payment status",
      };
    }
  };

  // Replace your pollPaymentStatus function with this BETTER version
  const pollPaymentStatus = async (
    orderId: number,
    checkoutRequestID: string,
  ): Promise<{ success: boolean; status: string; isPaid: boolean }> => {
    console.log(`🔍 Starting ACTIVE payment polling for order ${orderId}`);

    let attempts = 0;
    const maxAttempts = 12; // 1 minutes max (12 * 5 seconds)

    try {
      // Wait 10 seconds first to give user time to enter PIN
      await new Promise((resolve) => setTimeout(resolve, 10000));

      while (attempts < maxAttempts) {
        attempts++;

        console.log(
          `🔍 Poll attempt ${attempts}/${maxAttempts} for ${checkoutRequestID}`,
        );

        try {
          // Option 1: Query M-Pesa API directly (MOST RELIABLE)
          const mpesaResult = await queryMpesaStatus(checkoutRequestID);

          if (mpesaResult.isPaid) {
            console.log("✅ M-Pesa API confirms payment SUCCESS!");

            // Get payment details for notification
            const verifiedPayment = await orderService.verifyPayment(orderId);

            // Show global success notification
            showPaymentSuccess({
              orderId: orderId,
              amount: verifiedPayment.payment?.paymentAmount || 0,
              mpesaReceipt: verifiedPayment.payment?.mpesaReceipt,
            });

            // Clear cart
            try {
              await clearCartForMpesa(orderId);
              console.log(`✅ Cart cleared for order ${orderId}`);
            } catch (cartError) {
              console.error("Cart clearing error:", cartError);
            }

            return {
              success: true,
              status: "paid",
              isPaid: true,
            };
          }

          console.log(`⏳ M-Pesa says: ${mpesaResult.message}`);

          // Option 2: Also check our database
          const orderResponse = await orderService.verifyPayment(orderId);

          if (orderResponse.isPaid) {
            console.log("✅ Database shows payment SUCCESS!");

            // Show global success notification
            showPaymentSuccess({
              orderId: orderId,
              amount: orderResponse.payment?.paymentAmount || 0,
              mpesaReceipt: orderResponse.payment?.mpesaReceipt,
            });

            return {
              success: true,
              status: orderResponse.status,
              isPaid: true,
            };
          }

          // If both methods say not paid, wait and try again
          const waitTime = 5000; // Check every 5 seconds
          console.log(
            `⏳ Waiting ${waitTime / 1000} seconds before next check...`,
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } catch (error: any) {
          console.log(`⚠️ Poll error: ${error.message}`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      console.log("⏰ Polling timeout - payment not confirmed");
      return {
        success: false,
        status: "timeout",
        isPaid: false,
      };
    } catch (error) {
      console.error("❌ Polling system error:", error);
      return {
        success: false,
        status: "error",
        isPaid: false,
      };
    }
  };

  const handleCompleteCheckoutBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    paymentOrder: PaymentOrder,
    calculatedTotal: number,
  ) => {
    console.log("🔄 Checkout button clicked!");
    console.log("Payment method:", orderData.paymentMethod);
    console.log("Button text:", buttonText);
    console.log("Calculated total:", calculatedTotal);
    console.log("Cart ID:", cartId);
    console.log("Order data:", orderData);

    e.preventDefault();

    // Clean the data first
    const cleanedOrderData = cleanOrderData(orderData);

    // Then validate
    const validation = validateOrderData(cleanedOrderData);
    if (!validation.isValid) {
      toast.error(
        `Please fix the following errors:\n${validation.errors.join("\n")}`,
        { duration: 5000 },
      );
      return;
    }

    if (buttonText === "Proceed to Payment") {
      // For "pay now with mpesa" - Create order first, then pay
      let orderId: number | null = null;
      let cartCleared = false;

      try {
        // Show payment modal
        setIsPaymentModalOpen(true);
        setPaymentStatus("processing");

        // Step 1: Create order first with pending_payment status
        console.log("Step 1: Creating order for cart ID:", cartId);

        // Validate cartId
        if (isNaN(cartId) || cartId <= 0) {
          throw new Error(
            "Invalid cart ID. Please go back to cart and try again.",
          );
        }

        const result = await createOrder(cartId, {
          ...cleanedOrderData,
          totalAmount: calculatedTotal,
          paymentMethod: "pay now with mpesa",
          isPaid: false,
          status: "pending_payment",
        });

        console.log("Create order result:", result);

        if (!result.success) {
          console.error("Order creation failed:", result);
          throw new Error(result.message || "Failed to create order");
        }

        // Get orderId from either result.orderId or result.order?.id
        orderId = result.orderId || result.order?.id || null;
        if (!orderId) {
          throw new Error("Order was created but no order ID was returned.");
        }

        // IMPORTANT: Store the order ID in state
        setCreatedOrderId(orderId);

        // IMPORTANT: Get cartCleared from the result!
        cartCleared = result.cartCleared || false;
        console.log(`Order ${orderId} created. Cart cleared: ${cartCleared}`);

        // Step 2: Make payment with the order ID
        console.log("Step 2: Making payment with order ID:", orderId);

        // Validate phone number
        const phoneNumber = orderData.billing?.phoneNumber || "";
        if (!phoneNumber || phoneNumber.trim() === "") {
          throw new Error("Phone number is required for M-Pesa payment");
        }

        console.log("Payment details:", {
          orderId: orderId,
          phone: phoneNumber,
          amount: Math.round(calculatedTotal),
        });

        const paymentOrderData: PaymentOrder = {
          orderId: orderId,
          phone: phoneNumber,
          amount: Math.round(calculatedTotal),
        };

        // Store it in state
        setPaymentOrder(paymentOrderData);

        const paymentResponse = await completePayment(paymentOrderData);

        console.log(
          "Payment response:",
          JSON.stringify(paymentResponse, null, 2),
        );

        // Handle payment response
        if (paymentResponse.success) {
          const checkoutID = paymentResponse.checkoutRequestID;
          setCheckoutRequestID(checkoutID || "");

          console.log("✅ Payment initiated successfully!");
          console.log("Please check your phone and enter your M-Pesa PIN...");

          // Update modal to show "Enter PIN" message
          setPaymentStatus("processing");

          // Start polling with better timing
          pollingTimeoutRef.current = setTimeout(async () => {
            console.log("Starting payment polling...");
            const paymentResult = await pollPaymentStatus(
              orderId!,
              checkoutID!,
            );

            if (paymentResult.isPaid) {
              // Get updated payment details
              const verifiedPayment = await orderService.verifyPayment(
                orderId!,
              );

              setPaymentStatus("success");
              // Store payment details for display
              setPaymentDetails(verifiedPayment.payment);

              toast.success("Payment completed successfully!", {
                duration: 5000,
              });

              await fetchCart();

              // Navigate after showing success
              pollingTimeoutRef.current = setTimeout(() => {
                navigate(`/orders/${orderId}`);
              }, 4000);
            } else {
              // Handle failure
              setPaymentStatus("error");
              let errorMsg = "Payment ";

              if (paymentResult.status === "timeout") {
                errorMsg +=
                  "timed out. Please check if you received and completed the M-Pesa prompt on your phone.";
              } else if (paymentResult.status === "cancelled") {
                errorMsg +=
                  "was cancelled. You can retry or choose another payment method.";
              } else {
                errorMsg += "failed. Please try again.";
              }

              setPaymentErrorMessage(errorMsg);
              toast.error(errorMsg, { duration: 6000 });

              // Only delete if cart wasn't already cleared
              if (!cartCleared) {
                await deletePendingOrder(orderId!);
              }
            }
          }, 30000); // Wait 30 seconds before starting to poll
        } else {
          // Payment initiation failed
          console.error("❌ Payment initiation failed:", paymentResponse);
          setPaymentStatus("error");

          const errorMessage =
            paymentResponse.message || "Failed to initiate payment";

          setPaymentErrorMessage(errorMessage);
          toast.error(errorMessage, { duration: 6000 });

          // Delete the pending order if cart wasn't cleared
          if (orderId && !cartCleared) {
            await deletePendingOrder(orderId);
          }
        }
      } catch (error: any) {
        console.error("❌ Error in checkout flow:", error);
        setPaymentStatus("error");

        let errorMsg = "Checkout failed. Please try again.";
        if (error.message) {
          errorMsg = error.message;
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        }

        setPaymentErrorMessage(errorMsg);
        toast.error(errorMsg, { duration: 6000 });

        // Clean up if order was created but payment failed
        if (orderId && !cartCleared) {
          try {
            await deletePendingOrder(orderId);
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }
        }
      }
    } else {
      // For non-payment checkout
      try {
        console.log("Creating non-payment order for cart:", cartId);
        const result = await createOrder(cartId, {
          ...cleanedOrderData,
          totalAmount: calculatedTotal,
        });

        console.log("Non-payment order result:", result);

        if (result.success) {
          toast.success("Order placed successfully!", { duration: 4000 });
          navigate("/orders");
        } else {
          throw new Error("Failed to create order");
        }
      } catch (error: any) {
        console.error("Non-payment checkout error:", error);
        toast.error(
          error.message || "Failed to place order. Please try again.",
        );
      }
    }
  };

  // Update deletePendingOrder to be more selective
  const deletePendingOrder = async (orderId: number) => {
    try {
      console.log(`Attempting to delete pending order ${orderId}...`);
      const order = await orderService.getOrder(orderId);

      if (
        order.order &&
        order.order.paymentMethod === "pay now with mpesa" &&
        !order.order.isPaid
      ) {
        await orderService.deleteOrder(orderId);
        console.log(
          `✅ Deleted pending M-Pesa order ${orderId} due to payment failure`,
        );

        toast.success("Cart has been restored. You can retry payment.", {
          duration: 5000,
        });
      } else {
        console.log(
          `Order ${orderId} is not a pending M-Pesa order, not deleting`,
        );
      }
    } catch (deleteError) {
      console.error(`Failed to delete pending order ${orderId}:`, deleteError);
    }
  };

  // Update handleRetryPayment
  const handleRetryPayment = async () => {
    console.log("Retrying payment for order:", createdOrderId);
    if (!createdOrderId) return;

    setPaymentStatus("processing");
    setPaymentErrorMessage("");

    try {
      const order = await orderService.getOrder(createdOrderId);

      if (!order.order) {
        throw new Error("Order not found");
      }

      const paymentOrder: PaymentOrder = {
        orderId: createdOrderId,
        phone: orderData.billing?.phoneNumber || "",
        amount: Math.round(order.order.totalAmount),
      };

      console.log("Retry payment details:", paymentOrder);

      const response = await completePayment(paymentOrder);

      console.log("Retry payment response:", response);

      if (response.success) {
        const checkoutID = response.checkoutRequestID;
        setCheckoutRequestID(checkoutID || "");

        console.log("✅ Retry payment initiated successfully!");

        pollingTimeoutRef.current = setTimeout(async () => {
          if (checkoutID && !isPollingRef.current) {
            const paymentResult = await pollPaymentStatus(
              createdOrderId,
              checkoutID,
            );

            if (paymentResult.isPaid) {
              setPaymentStatus("success");
              toast.success("Payment completed successfully!");
            } else {
              setPaymentStatus("error");
              setPaymentErrorMessage(
                paymentResult.status === "timeout"
                  ? "Payment timed out. Please check your M-Pesa."
                  : "Payment failed. Please try again.",
              );

              toast.error("Payment failed. Your order is still pending.", {
                duration: 6000,
              });
            }
          }
        }, 10000);
      } else {
        setPaymentStatus("error");
        setPaymentErrorMessage(response.message || "Payment failed");

        toast.error("Payment initiation failed. Your order is still pending.", {
          duration: 6000,
        });
      }
    } catch (error: any) {
      console.error("Error in retry payment:", error);
      setPaymentStatus("error");
      setPaymentErrorMessage(error.message || "An error occurred");

      toast.error("An error occurred. Your order is still pending.", {
        duration: 6000,
      });
    }
  };

  const closePaymentModal = () => {
    console.log("Closing payment modal, current status:", paymentStatus);
    setIsPaymentModalOpen(false);

    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    if (paymentStatus === "success" || paymentStatus === "pending") {
      navigate("/home");
    }
  };

  const handleManualVerify = () => {
    setPaymentStatus("success");

    // Get payment details if available
    if (createdOrderId) {
      orderService
        .verifyPayment(createdOrderId)
        .then((verifiedPayment) => {
          showPaymentSuccess({
            orderId: createdOrderId,
            amount: verifiedPayment.payment?.paymentAmount || 0,
            mpesaReceipt: verifiedPayment.payment?.mpesaReceipt,
          });
        })
        .catch((error) => {
          console.error("Error fetching payment details:", error);
          // Show basic success notification even without details
          showPaymentSuccess({
            orderId: createdOrderId,
            amount: 0,
          });
        });
    }

    toast.success(
      "Payment verified! You can track your order in your account.",
      {
        duration: 6000,
      },
    );
  };

  React.useEffect(() => {
    if (user) {
      setOrderData((prev) => ({
        ...prev,
        contact: user.email,
      }));
    }
  }, [user]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <PaymentProcessingModal
        isOpen={isPaymentModalOpen}
        paymentStatus={paymentStatus}
        checkoutRequestID={checkoutRequestID}
        orderId={createdOrderId || undefined}
        paymentDetails={paymentDetails}
        calculatedTotal={shippingCost + (paymentOrder?.amount || 0)}
        orderData={orderData}
        createdOrderId={createdOrderId || undefined}
        errorMessage={paymentErrorMessage}
        onClose={closePaymentModal}
        onRetry={handleRetryPayment}
        onVerify={handleManualVerify}
      />

      {/* Rest of your checkout UI remains the same */}
      {isMobile ? (
        <div className="checkout-page-mobile">
          {/* Mobile checkout UI */}
          <div className="checkout-container-mobile">
            <div className="form-section-mobile">
              <h2>Checkout</h2>

              <div className="checkout-form-mobile">
                <div className="contact-mobile">
                  <h3>Contact</h3>
                  <FloatingInput
                    id="email"
                    type="email"
                    value={orderData.contact}
                    label="Email"
                    onChange={handleOrderInputChange("contact")}
                    required
                  />
                </div>
                <div className="delivery-mobile">
                  <h3>Billing</h3>
                  <div className="billing-details-mobile">
                    <h4>Billing Address</h4>
                    <div className="name-section-mobile">
                      <div>
                        <FloatingInput
                          id="first name"
                          type="text"
                          value={billingData.firstName || ""}
                          label="First Name"
                          onChange={handleBillingInputChange("firstName")}
                          required
                        />
                      </div>
                      <div>
                        <FloatingInput
                          id="last name"
                          type="text"
                          value={billingData.lastName || ""}
                          label="Last Name"
                          onChange={handleBillingInputChange("lastName")}
                          required
                        />
                      </div>
                    </div>
                    <FloatingInput
                      id="phone number"
                      type="text"
                      value={billingData.phoneNumber || ""}
                      label="Phone number"
                      onChange={handleBillingInputChange("phoneNumber")}
                      required
                    />
                    <FloatingInput
                      id="email address"
                      type="email"
                      value={billingData.email || ""}
                      label="Email address (optional)"
                      onChange={handleBillingInputChange("email")}
                    />
                  </div>
                  <div className="payment-mobile">
                    <h4>Payment method</h4>
                    <div className="payment-options-mobile">
                      <FloatingRadioInput
                        id="pay now with mpesa"
                        name="paymentMethod"
                        value="pay now with mpesa"
                        label="Pay now with M-Pesa"
                        onChange={handleOrderInputChange("paymentMethod")}
                        checked={
                          orderData.paymentMethod === "pay now with mpesa"
                        }
                      />
                      <FloatingRadioInput
                        id="pay upon delivery"
                        name="paymentMethod"
                        value="pay upon delivery"
                        label="Pay upon delivery with M-Pesa or Cash"
                        onChange={handleOrderInputChange("paymentMethod")}
                        checked={
                          orderData.paymentMethod === "pay upon delivery"
                        }
                      />
                      <FloatingRadioInput
                        id="pay in store"
                        name="paymentMethod"
                        value="pay in store"
                        label="Pay in Store"
                        onChange={handleOrderInputChange("paymentMethod")}
                        checked={orderData.paymentMethod === "pay in store"}
                      />
                    </div>
                  </div>

                  <div className="shipping-mobile">
                    <h3>Shipping</h3>
                    <div className="shipping-method-mobile">
                      <h4>Shipping Method</h4>
                      <div className="shipping-options-mobile">
                        <FloatingRadioInput
                          id="pickup"
                          name="shippingMethod"
                          value="pickup"
                          label="In store pickup - Free"
                          onChange={handleOrderInputChange("shippingMethod")}
                          checked={orderData.shippingMethod === "pickup"}
                        />
                        <FloatingRadioInput
                          id="delivery"
                          name="shippingMethod"
                          value="delivery"
                          label="Local delivery - $5.00"
                          onChange={handleOrderInputChange("shippingMethod")}
                          checked={orderData.shippingMethod === "delivery"}
                        />
                      </div>
                    </div>
                    {orderData.shippingMethod === "delivery" && (
                      <div className="address-options-mobile">
                        <h4>Shipping address</h4>
                        <div>
                          <FloatingRadioInput
                            id="shippingDetails"
                            name="shippingAddress"
                            value="shippingDetails"
                            label="Enter shipping details"
                            onChange={handleShippingAddressChange}
                            checked={shippingAddress === "shippingDetails"}
                          />
                          {shippingAddress === "shippingDetails" && (
                            <div>
                              <div className="shipping-details-mobile">
                                <div className="name-section-mobile">
                                  <div>
                                    <FloatingInput
                                      id="first name"
                                      type="text"
                                      value={shippingData.firstName || ""}
                                      label="First Name"
                                      onChange={handleShippingInputChange(
                                        "firstName",
                                      )}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <FloatingInput
                                      id="last name"
                                      type="text"
                                      value={shippingData.lastName || ""}
                                      label="Last Name"
                                      onChange={handleShippingInputChange(
                                        "lastName",
                                      )}
                                      required
                                    />
                                  </div>
                                </div>
                                <FloatingInput
                                  id="email address"
                                  type="email"
                                  value={shippingData.email || ""}
                                  label="Email address"
                                  onChange={handleShippingInputChange("email")}
                                  required
                                />
                                <FloatingInput
                                  id="apartment"
                                  type="text"
                                  value={shippingData.apartment || ""}
                                  label="Apartment, suite, etc. (optional)"
                                  onChange={handleShippingInputChange(
                                    "apartment",
                                  )}
                                />
                                <div className="city-section-mobile">
                                  <FloatingInput
                                    id="city"
                                    type="text"
                                    value={shippingData.city || ""}
                                    label="City (optional)"
                                    onChange={handleShippingInputChange("city")}
                                  />
                                  <FloatingInput
                                    id="postal code"
                                    type="text"
                                    value={shippingData.postalCode || ""}
                                    label="Postal code (optional)"
                                    onChange={handleShippingInputChange(
                                      "postalCode",
                                    )}
                                    required
                                  />
                                </div>
                                <FloatingInput
                                  id="phone number"
                                  type="text"
                                  value={shippingData.phoneNumber || ""}
                                  label="Phone number"
                                  onChange={handleShippingInputChange(
                                    "phoneNumber",
                                  )}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="summary-section-mobile">
              <OrderSummary
                billingData={billingData}
                shippingCost={shippingCost}
                buttonText={buttonText}
                handleCompleteCheckoutBtn={handleCompleteCheckoutBtn}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="checkout-page">
          {/* Desktop checkout UI */}
          <div className="checkout-container">
            <div className="form-section">
              <h2>Checkout</h2>

              <div className="checkout-form">
                <div className="contact">
                  <h3>Contact</h3>
                  <FloatingInput
                    id="email"
                    type="email"
                    value={orderData.contact || ""}
                    label="Email or mobile phone number"
                    onChange={handleOrderInputChange("contact")}
                    required
                  />
                </div>
                <div className="billing">
                  <h3>Billing</h3>
                  <div className="billing-details">
                    <h4>Billing Address</h4>
                    <div className="name-section">
                      <div>
                        <FloatingInput
                          id="first name"
                          type="text"
                          value={billingData.firstName || ""}
                          label="First Name"
                          onChange={handleBillingInputChange("firstName")}
                          required
                        />
                      </div>
                      <div>
                        <FloatingInput
                          id="last name"
                          type="text"
                          value={billingData.lastName || ""}
                          label="Last Name"
                          onChange={handleBillingInputChange("lastName")}
                          required
                        />
                      </div>
                    </div>
                    <FloatingInput
                      id="phone number"
                      type="text"
                      value={billingData.phoneNumber || ""}
                      label="Phone number"
                      onChange={handleBillingInputChange("phoneNumber")}
                      required
                    />
                    <FloatingInput
                      id="email address"
                      type="email"
                      value={billingData.email || ""}
                      label="Email address"
                      onChange={handleBillingInputChange("email")}
                      required
                    />
                  </div>
                  <div className="payment">
                    <h4>Payment method</h4>
                    <div className="payment-options">
                      <FloatingRadioInput
                        id="pay now with mpesa"
                        name="paymentMethod"
                        value="pay now with mpesa"
                        label="Pay now with M-Pesa"
                        onChange={handleOrderInputChange("paymentMethod")}
                        checked={
                          orderData.paymentMethod === "pay now with mpesa"
                        }
                      />
                      <FloatingRadioInput
                        id="pay upon delivery"
                        name="paymentMethod"
                        value="pay upon delivery"
                        label="Pay upon delivery with M-Pesa or Cash"
                        onChange={handleOrderInputChange("paymentMethod")}
                        checked={
                          orderData.paymentMethod === "pay upon delivery"
                        }
                      />
                      <FloatingRadioInput
                        id="pay in store"
                        name="paymentMethod"
                        value="pay in store"
                        label="Pay in Store"
                        onChange={handleOrderInputChange("paymentMethod")}
                        checked={orderData.paymentMethod === "pay in store"}
                      />
                    </div>
                  </div>

                  <div className="shipping">
                    <h3>Shipping</h3>
                    <div className="shipping-method">
                      <h4>Shipping Method</h4>
                      <div className="shipping-options">
                        <FloatingRadioInput
                          id="pickup"
                          name="shippingMethod"
                          value="pickup"
                          label="In store pickup - Free"
                          onChange={handleOrderInputChange("shippingMethod")}
                          checked={orderData.shippingMethod === "pickup"}
                        />
                        <FloatingRadioInput
                          id="delivery"
                          name="shippingMethod"
                          value="delivery"
                          label="Local delivery - $5.00"
                          onChange={handleOrderInputChange("shippingMethod")}
                          checked={orderData.shippingMethod === "delivery"}
                        />
                      </div>
                    </div>
                    {orderData.shippingMethod === "delivery" && (
                      <div className="address-options">
                        <h4>Shipping address</h4>
                        <div>
                          <FloatingRadioInput
                            id="shippingDetails"
                            name="shippingAddress"
                            value="shippingDetails"
                            label="Enter shipping details"
                            onChange={handleShippingAddressChange}
                            checked={shippingAddress === "shippingDetails"}
                          />
                          {shippingAddress === "shippingDetails" && (
                            <div>
                              <div className="shipping-details">
                                <div className="name-section">
                                  <div>
                                    <FloatingInput
                                      id="first name"
                                      type="text"
                                      value={shippingData.firstName || ""}
                                      label="First Name"
                                      onChange={handleShippingInputChange(
                                        "firstName",
                                      )}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <FloatingInput
                                      id="last name"
                                      type="text"
                                      value={shippingData.lastName || ""}
                                      label="Last Name"
                                      onChange={handleShippingInputChange(
                                        "lastName",
                                      )}
                                      required
                                    />
                                  </div>
                                </div>
                                <FloatingInput
                                  id="email address"
                                  type="email"
                                  value={shippingData.email || ""}
                                  label="Email address"
                                  onChange={handleShippingInputChange("email")}
                                  required
                                />
                                <FloatingInput
                                  id="apartment"
                                  type="text"
                                  value={shippingData.apartment || ""}
                                  label="Apartment, suite, etc. (optional)"
                                  onChange={handleShippingInputChange(
                                    "apartment",
                                  )}
                                />
                                <div className="city-section">
                                  <FloatingInput
                                    id="city"
                                    type="text"
                                    value={shippingData.city || ""}
                                    label="City (optional)"
                                    onChange={handleShippingInputChange("city")}
                                  />
                                  <FloatingInput
                                    id="postal code"
                                    type="text"
                                    value={shippingData.postalCode || ""}
                                    label="Postal code (optional)"
                                    onChange={handleShippingInputChange(
                                      "postalCode",
                                    )}
                                    required
                                  />
                                </div>
                                <FloatingInput
                                  id="phone number"
                                  type="text"
                                  value={shippingData.phoneNumber || ""}
                                  label="Phone number"
                                  onChange={handleShippingInputChange(
                                    "phoneNumber",
                                  )}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="summary-section">
              <OrderSummary
                billingData={billingData}
                shippingCost={shippingCost}
                buttonText={buttonText}
                handleCompleteCheckoutBtn={handleCompleteCheckoutBtn}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
