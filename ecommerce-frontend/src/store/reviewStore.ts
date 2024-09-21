import { create } from "zustand";
import axios, { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_SERVER}/api/v1/review`;

axios.defaults.withCredentials = true;

interface ReviewState {
  error: string | null;
  isLoading: boolean;

  // Fetch reviews with pagination
  fetchReviews: (productId: string, page?: number) => Promise<void>;

  // Add review
  addReview: (
    productId: string,
    title: string,
    text: string,
    rating: number,
    name: string,
    userId: string
  ) => Promise<void>;

  // Delete review
  deleteReview: (
    productId: string,
    reviewId: string,
    userId: string
  ) => Promise<void>;

  // Get user reviews
  getUserReviews: (productId: string, userId: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  error: null,
  isLoading: false,

  // Fetch reviews with pagination
  fetchReviews: async (productId, page = 1) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/all-reviews/${productId}?page=${page}`
      );

      set({
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching reviews",
        isLoading: false,
      });
      throw error;
    }
  },

  // Add review function
  addReview: async (productId, title, text, rating, name, userId) => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/add-review`, {
        productId,
        title,
        text,
        rating,
        name,
        userId,
      });

      // Optionally refetch the reviews after adding
      set({ isLoading: false, error: null });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({
        error: error.response?.data?.message || "Error adding review",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete review function
  deleteReview: async (productId, reviewId, userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(
        `${API_URL}/delete-review/${productId}/${reviewId}/${userId}`
      );

      // Optionally refetch the reviews after deleting
      set({ isLoading: false, error: null });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error deleting review",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get user reviews function
  getUserReviews: async (productId, userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/user-reviews/${productId}/${userId}`
      );

      set({
        isLoading: false,
        error: null,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching user reviews",
        isLoading: false,
      });
      throw error;
    }
  },
}));
