import { create } from "zustand";
import axios, { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon`;

axios.defaults.withCredentials = true;

interface ProductState {
  error: string | null;
  isLoading: boolean;

  createCoupon: (
    adminId: string,
    couponText: string,
    couponValue: number
  ) => Promise<void>; // Define the return type

  getCoupon: (adminId: string) => Promise<void>; // Define the return type

  deleteCoupon: (adminId: string, CouponId: string) => Promise<void>; // Define the return type
}

export const useCouponStore = create<ProductState>((set) => ({
  error: null,
  isLoading: false,

  createCoupon: async (adminId, couponText, couponValue) => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/new?id=${adminId}`, {
        coupon: couponText,
        amount: couponValue,
      });

      set({
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error creating coupon",
        isLoading: false,
      });
      throw error;
    }
  },

  getCoupon: async (adminId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/all?id=${adminId}`);

      set({
        isLoading: false,
        error: null,
      });

      return res.data.coupons;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching coupon",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCoupon: async (adminId, CouponId) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/${CouponId}?id=${adminId}`);

      set({
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error deleting coupon",
        isLoading: false,
      });
      throw error;
    }
  },
}));
