// AuthStore.ts
import { create } from "zustand";
import axios, { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_SERVER}/api/v1/admin-panel/stats`;

axios.defaults.withCredentials = true;

interface AuthState {
  error: string | null;
  isLoading: boolean;

  dashboardStats: (id: string) => void;
  PieChartStats: (id: string) => void;
  BarChartStats: (id: string) => void;
  LineChartStats: (id: string) => void;
}

export const useDashboardStats = create<AuthState>((set) => ({
  error: null,
  isLoading: false,

  dashboardStats: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/dashboard?id=${id}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  PieChartStats: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/pie?id=${id}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  BarChartStats: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/bar?id=${id}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  LineChartStats: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/line?id=${id}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

}));
