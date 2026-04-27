/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CreateOrderResponse,
  DeleteResponse,
  IdParams,
  OrderData,
  OrderResponse,
  OrdersResponse,
  PaymentOrder,
  UpdateOrderData,
  PaymentResponse,
  CallbackResponse,
  QueryResponse,
} from "../utils/types";
import { api } from "./api";

class OrderService {
  private readonly basePath = "/order";

  async createOrder(
    id: IdParams,
    createdOrder: OrderData
  ): Promise<CreateOrderResponse> {
    try {
      const response = await api.post<CreateOrderResponse>(
        `${this.basePath}/${id}`,
        createdOrder
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error creating order");
    }
  }

  async getAllOrders(): Promise<OrdersResponse> {
    try {
      const response = await api.get<OrdersResponse>(`${this.basePath}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error fetching user orders"
      );
    }
  }

  async getOrder(id: IdParams): Promise<OrderResponse> {
    try {
      const response = await api.get<OrderResponse>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || `Error fetching order number: ${id}`
      );
    }
  }

  async updateOrder(
    id: IdParams,
    updatedData: UpdateOrderData
  ): Promise<OrderResponse> {
    try {
      const response = await api.patch<OrderResponse>(
        `${this.basePath}/${id}`,
        updatedData
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error updating order");
    }
  }

  async deleteOrder(id: IdParams): Promise<DeleteResponse> {
    try {
      const response = await api.delete<DeleteResponse>(
        `${this.basePath}/${id}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error updating order");
    }
  }

  // Add this method to orderService.ts
  async verifyPaymentByOrderId(orderId: number): Promise<{
    isPaid: boolean;
    status: string;
    hasPayment: boolean;
    payment?: {
      paymentStatus: string;
      checkoutRequestID?: string;
      mpesaReceipt?: string;
    };
  }> {
    try {
      const response = await api.get(`/payment/order/${orderId}/verify`);
      return {
        isPaid: response.data.isPaid,
        status: response.data.status,
        hasPayment: response.data.hasPayment,
        payment: response.data.payment,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error verifying payment"
      );
    }
  }

  async makePayment(paymentOrder: PaymentOrder): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>(
        "/payment/stkpush",
        paymentOrder
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  }

  // In orderService.ts, update verifyPayment method
  async verifyPayment(orderId: number): Promise<{
    isPaid: boolean;
    status: string;
    hasPayment: boolean;
    payment?: any;
    error?: string;
  }> {
    try {
      console.log(`🔍 Verifying payment for order ${orderId}`);

      // Try the order-specific endpoint first
      try {
        const response = await api.get(`/order/${orderId}/payment/verify`);
        console.log(`✅ Order verification response:`, response.data);

        return {
          isPaid: response.data.isPaid || false,
          status: response.data.status || "pending",
          hasPayment: !!response.data.payment,
          payment: response.data.payment,
        };
      } catch (orderError: any) {
        console.log(
          `⚠️ Order endpoint failed:`,
          orderError.response?.data || orderError.message
        );
      }

      // Try the payment endpoint
      try {
        const response = await api.get(`/payment/order/${orderId}/verify`);
        console.log(`✅ Payment verification response:`, response.data);

        return {
          isPaid: response.data.isPaid || false,
          status: response.data.status || "pending",
          hasPayment: !!response.data.payment,
          payment: response.data.payment,
        };
      } catch (paymentError: any) {
        console.log(
          `⚠️ Payment endpoint failed:`,
          paymentError.response?.data || paymentError.message
        );

        // Return the actual error for debugging
        return {
          isPaid: false,
          status: "error",
          hasPayment: false,
          error: paymentError.response?.data?.message || "Verification failed",
        };
      }
    } catch (error: any) {
      console.error("❌ Payment verification error:", error);

      return {
        isPaid: false,
        status: "error",
        hasPayment: false,
        error: error.message,
      };
    }
  }

  async mpesaCallback(): Promise<CallbackResponse> {
    try {
      const response = await api.post<CallbackResponse>("/payment/callback");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  }

  async clearCartForMpesa(
    orderId: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post(
        `${this.basePath}/${orderId}/clear-cart-mpesa`
      );
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error clearing cart");
    }
  }

  async queryStatus(checkoutRequestID: string): Promise<QueryResponse> {
    try {
      const response = await api.post<QueryResponse>("payment/query-status", {
        checkoutRequestID,
      });

      return response.data;
    } catch (error) {
      console.error("Query M-Pesa status error:", error);
      return {
        success: false,
        isPaid: false,
        message: "Failed to query payment status",
      };
    }
  }
}

export const orderService = new OrderService();
