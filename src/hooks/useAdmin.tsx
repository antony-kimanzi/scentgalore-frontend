/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAdmin.tsx
import React from "react";
import { api } from "../services/api";

export const useAdmin = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [products, setProducts] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [payments, setPayments] = React.useState<any[]>([]);
  const [carts, setCarts] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>({});
  // Add these state variables at the beginning of the hook:
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [recentPayments, setRecentPayments] = React.useState<any[]>([]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/product");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/account/admin/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/order");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/payment/admin/payments");
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarts = async () => {
    setIsLoading(true);
    try {
      // You'll need to create a cart admin endpoint
      // For now, we'll fetch all users and their carts
      const response = await api.get("/account/admin/users");
      const usersWithCarts = response.data.users || [];
      const allCarts = [];

      for (const user of usersWithCarts) {
        try {
          const cartResponse = await api.get(`/cart/user/${user.id}`);
          if (cartResponse.data.cart) {
            allCarts.push(cartResponse.data.cart);
          }
        } catch (error) {
          console.error(`Error fetching cart for user ${user.id}:`, error);
        }
      }

      setCarts(allCarts);
    } catch (error) {
      console.error("Error fetching carts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard stats from the new endpoint
      const statsResponse = await api.get("/payment/admin/stats");

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);

        // Set recent activity data
        if (statsResponse.data.recentActivity) {
          setRecentOrders(statsResponse.data.recentActivity.orders || []);
          setRecentPayments(statsResponse.data.recentActivity.payments || []);
        }
      } else {
        console.error("Failed to fetch stats:", statsResponse.data.error);

        // Fallback to individual API calls if stats endpoint fails
        const [productsRes, usersRes, ordersRes, paymentsRes] =
          await Promise.all([
            api.get("/product"),
            api.get("/account/admin/users"),
            api.get("/order"),
            api.get("/payment/admin/payments?limit=5"),
          ]);

        const today = new Date();
        const todayStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );

        const todayOrders =
          ordersRes.data.orders?.filter(
            (order: any) => new Date(order.createdAt) >= todayStart,
          ) || [];

        const todayRevenue = todayOrders.reduce(
          (sum: number, order: any) => sum + (order.totalAmount || 0),
          0,
        );

        const pendingOrders =
          ordersRes.data.orders?.filter((o: any) =>
            ["pending", "pending_payment"].includes(o.status),
          ).length || 0;

        setStats({
          totalRevenue: 0, // We don't have this in fallback
          totalOrders: ordersRes.data.orders?.length || 0,
          totalUsers: usersRes.data.users?.length || 0,
          totalProducts: productsRes.data.products?.length || 0,
          pendingOrders,
          todayRevenue,
        });

        // Set recent orders and payments from fallback data
        setRecentOrders(ordersRes.data.orders?.slice(0, 10) || []);
        setRecentPayments(paymentsRes.data.payments?.slice(0, 10) || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default empty stats
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        pendingOrders: 0,
        todayRevenue: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: number | null, data: any) => {
    try {
      const response = await api.patch(`/product/${id}`, data);
      console.log("data:", data);
      await fetchProducts(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const addProduct = async (data: any) => {
    try {
      const response = await api.post("/product", data);
      await fetchProducts(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/product/${id}`);
      await fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const updateUser = async (id: number, data: any) => {
    try {
      const response = await api.patch(`/account/admin/users/${id}`, data);
      await fetchUsers(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/account/admin/users/${id}`);
      await fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const updateOrder = async (id: number, data: any) => {
    try {
      const response = await api.patch(`/order/${id}`, data);
      await fetchOrders(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const updatePayment = async (id: number, data: any) => {
    try {
      const response = await api.put(
        `/payment/admin/payments/${id}/process`,
        data,
      );
      await fetchPayments(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  };

  const deleteCart = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);
      await fetchCarts(); // Refresh list
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  };

  return {
    isLoading,
    products,
    users,
    orders,
    payments,
    carts,
    stats,
    recentOrders, // Add this
    recentPayments, // Add this
    fetchProducts,
    fetchUsers,
    fetchOrders,
    fetchPayments,
    fetchCarts,
    fetchStats,
    updateProduct,
    addProduct,
    deleteProduct,
    updateUser,
    deleteUser,
    updateOrder,
    updatePayment,
    deleteCart,
  };
};
