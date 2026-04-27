/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";

interface PaymentSuccessInfo {
  orderId: number;
  amount: number;
  mpesaReceipt?: string;
}

interface NotificationContextType {
  showPaymentSuccess: (info: PaymentSuccessInfo) => void;
  hidePaymentSuccess: () => void;
  paymentSuccessInfo: PaymentSuccessInfo | null;
  isPaymentSuccessVisible: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [paymentSuccessInfo, setPaymentSuccessInfo] =
    useState<PaymentSuccessInfo | null>(null);
  const [isPaymentSuccessVisible, setIsPaymentSuccessVisible] = useState(false);

  const showPaymentSuccess = useCallback((info: PaymentSuccessInfo) => {
    setPaymentSuccessInfo(info);
    setIsPaymentSuccessVisible(true);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      setIsPaymentSuccessVisible(false);
    }, 10000);
  }, []);

  const hidePaymentSuccess = useCallback(() => {
    setIsPaymentSuccessVisible(false);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showPaymentSuccess,
        hidePaymentSuccess,
        paymentSuccessInfo,
        isPaymentSuccessVisible,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
