/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CartItemResponse,
  CartResponse,
  DeleteResponse,
  IdParams,
} from "../utils/types";
import { api } from "./api";

class CartService {
  private readonly basePath = "/cart";

  async getCart(): Promise<CartResponse> {
    try {
      const response = await api.get<CartResponse>(`${this.basePath}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error fetching user cart",
      );
    }
  }

  async deleteCart(): Promise<DeleteResponse> {
    try {
      const response = await api.delete<DeleteResponse>(`${this.basePath}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error deleting user cart",
      );
    }
  }

  async addCartItem(id: IdParams): Promise<CartItemResponse> {
    try {
      const response = await api.post<CartItemResponse>(
        `${this.basePath}/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error adding item to cart",
      );
    }
  }

  async addCartItemQuantity(id: IdParams): Promise<CartItemResponse> {
    try {
      const response = await api.patch<CartItemResponse>(
        `${this.basePath}/add/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error updating cart item",
      );
    }
  }

  async subtractCartItemQuantity(id: IdParams): Promise<CartItemResponse> {
    try {
      const response = await api.patch<CartItemResponse>(
        `${this.basePath}/subtract/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error updating cart item",
      );
    }
  }

  async deleteCartItem(id: IdParams): Promise<DeleteResponse> {
    try {
      const response = await api.delete<DeleteResponse>(
        `${this.basePath}/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error deleting cart item",
      );
    }
  }
}

export const cartService = new CartService();
