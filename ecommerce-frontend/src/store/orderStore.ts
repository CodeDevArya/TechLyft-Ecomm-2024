import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { CartItem } from "../types/types";

const ORDER_API_URL = `${import.meta.env.VITE_SERVER}/api/v1/orders`;

axios.defaults.withCredentials = true;

interface OrderState {
  error: string | null;
  isLoading: boolean;

  createOrder: (
    userId: string,
    orderItems: CartItem[],
    shippingInfo: Record<string, string | number>,
    subtotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number
  ) => Promise<void>;

  allAdminOrders: (AdminId: string) => Promise<void>;
  getOrderDetailsById: (id: string) => Promise<void>;
  myOrder: (id: string) => Promise<void>;
  processOrder: (orderId: string, adminId: string) => Promise<void>;
  deleteOrder: (orderId: string, adminId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  error: null,
  isLoading: false,

  createOrder: async (
    userId,
    cartItems,
    shippingInfo,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total
  ) => {
    set({ isLoading: true, error: null });

    try {
      // Prepare the order data
      const orderData = {
        shippingInfo,
        cartItems,
        user: userId,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
      };

      // Make the API call to create a new order
      await axios.post(`${ORDER_API_URL}/new`, orderData);
      set({ isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error creating order",
        isLoading: false,
      });
      throw error;
    }
  },

  allAdminOrders: async (AdminId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${ORDER_API_URL}/all-orders?id=${AdminId}`);
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error getting Admin order",
        isLoading: false,
      });
      throw error;
    }
  },

  getOrderDetailsById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${ORDER_API_URL}/${id}`);
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error getting order by id",
        isLoading: false,
      });
      throw error;
    }
  },

  processOrder: async (orderId, adminId) => {
    set({ isLoading: true, error: null });

    try {
      axios.put(`${ORDER_API_URL}/${orderId}?id=${adminId}`);
      set({ isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error getting order by id",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOrder: async (orderId, adminId) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${ORDER_API_URL}/${orderId}?id=${adminId}`);
      set({ isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error getting order by id",
        isLoading: false,
      });
      throw error;
    }
  },

  myOrder: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${ORDER_API_URL}/my-orders?id=${id}`);
      set({ isLoading: false });
      return res.data.orders;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error getting order by id",
        isLoading: false,
      });
      throw error;
    }
  },
}));
