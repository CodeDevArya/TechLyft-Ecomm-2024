// AuthStore.ts
import { create } from "zustand";
import axios, { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_SERVER}/api/v1/auth`;

axios.defaults.withCredentials = true;

interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  gender: string;
  dob: Date;
  userImg: string;
  isVerified: boolean;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;

  signup: (
    email: string,
    password: string,
    name: string,
    gender: string,
    dob: any
  ) => void;

  verifyEmail: (code: string) => void;

  checkAuth: () => void;

  login: (email: string, password: string) => void;

  logout: () => void;

  forgotPassword: (email: string) => void;

  resetPassword: (token: string, password: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name, gender, dob) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/sign-up`, {
        email,
        password,
        name,
        gender,
        dob,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/check-auth?token`
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: null,
        isLoading: false,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      document.cookie = "";
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: null,
        isLoading: false,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error in forgot password",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },
}));
