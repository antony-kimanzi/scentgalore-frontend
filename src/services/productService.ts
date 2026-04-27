/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ProductsResponse,
  IdParams,
  ProductResponse,
} from "../utils/types";
import { api } from "./api";

class ProductService {
  private readonly basePath = "/product";
  async getProduct(id: IdParams): Promise<ProductResponse> {
    try {
      const response = await api.get<ProductResponse>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || `Error fetching product number: ${id}`
      );
    }
  }

  async getAllProduct(): Promise<ProductsResponse> {
    try {
      const response = await api.get<ProductsResponse>(`${this.basePath}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error fetching all products"
      );
    }
  }
}

export const productService = new ProductService();
