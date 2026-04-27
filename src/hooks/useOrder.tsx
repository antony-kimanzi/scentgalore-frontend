/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type {
  Order,
  IdParams,
  OrderData,
  PaymentOrder,
  PaymentResponse,
  CreateOrderResponse,
  CallbackResponse,
  QueryResponse,
} from "../utils/types";
import { orderService } from "../services/orderService";

// In useOrder.tsx, update the createOrder return type and implementation
export const useOrder = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const createOrder = async (
    id: IdParams,
    orderData: OrderData
  ): Promise<CreateOrderResponse> => {
    try {
      setIsLoading(true);
      const response = await orderService.createOrder(id, orderData);
      console.log("Order creation response:", response); // Add logging

      if (response.success) {
        // Get orderId from response.orderId OR response.order.id
        const orderId = response.orderId || response.order?.id;

        if (!orderId) {
          console.error("No order ID in response:", response);
          throw new Error("Order created but no order ID returned");
        }

        return {
          success: true,
          orderId: orderId,
          cartCleared: response.cartCleared || false,
        };
      }

      return {
        success: false,
        message: response.message || "Failed to create order",
      };
    } catch (err: any) {
      console.error("Order creation error:", err);
      setError(`Error creating order for cart number ${id}: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.orders);
    } catch (err) {
      setError("Error fetching orders");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completePayment = async (
    paymentOrder: PaymentOrder
  ): Promise<PaymentResponse> => {
    try {
      setIsLoading(true);
      const result = await orderService.makePayment(paymentOrder);
      return result;
    } catch (err) {
      setError("Failed to initiate payment");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const paymentCallback = async (): Promise<CallbackResponse> => {
    try {
      setIsLoading(true);
      const result = await orderService.mpesaCallback();
      return result;
    } catch (err) {
      setError("Failed to initiate payment");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to clear cart for successful M-Pesa payment
  const clearCartForMpesa = async (
    orderId: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await orderService.clearCartForMpesa(orderId);
      return {
        success: response.success,
        message: response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || "Failed to clear cart",
      };
    }
  };

  // Add function to verify payment status
  const verifyPayment = async (
    orderId: number
  ): Promise<{
    isPaid: boolean;
    status: string;
  }> => {
    try {
      const response = await orderService.verifyPayment(orderId);
      return {
        isPaid: response.isPaid || false,
        status: response.status || "pending",
      };
    } catch (err) {
      setError("Failed to verify payment");
      throw err;
    }
  };

  const queryStatus = async (
    checkoutRequestID: string
  ): Promise<QueryResponse> => {
    try {
      setIsLoading(true);
      const result = await orderService.queryStatus(checkoutRequestID);
      return result;
    } catch (err) {
      setError("Failed to initiate payment");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    error,
    createOrder,
    fetchOrders,
    completePayment,
    paymentCallback,
    clearCartForMpesa, // Add this to the return object
    verifyPayment,
    queryStatus,
  };
};

export type useOrderReturn = ReturnType<typeof useOrder>;
