import { create } from "zustand";
import axios, { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_SERVER}/api/v1/user`;

axios.defaults.withCredentials = true;

interface ProductState {
  error: string | null;
  isLoading: boolean;

  getAllAdminUsers: (id: string) => Promise<void>; // Define the return type
  deleteUser: (userId: string, adminId: string) => Promise<void>; // Define the return type

  sendMail: (name: string, email: string, message: string) => Promise<void>;
}

export const useUserStrore = create<ProductState>((set) => ({
  error: null,
  isLoading: false,

  getAllAdminUsers: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/all-users?id=${id}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data; // Return the fetched users
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (userId, adminId) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/${userId}?id=${adminId}`);

      set({
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false,
      });
      throw error;
    }
  },

  sendMail: async (name, email, message) => {
    set({ isLoading: true, error: null });

    try {
     const res = await axios.post(`${API_URL}/send-email`, {
        name,
        email,
        message,
      });

      set({
        isLoading: false,
        error: null,
      });

      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false,
      });
      throw error;
    }
  },
}));
