import { create } from "zustand";
import axios, { AxiosError } from "axios";
import {
  createProductResponse,
  getProductById,
  ListProduct,
  ListProductAdmin,
  ShopFiltersAndProduct,
} from "../types/types";

const API_URL = `${import.meta.env.VITE_SERVER}/api/v1/products`;

axios.defaults.withCredentials = true;

interface ProductState {
  error: string | null;
  isLoading: boolean;

  latestProducts: () => Promise<ListProduct[]>; // Define the return type

  shopAllProducts: (
    search?: string,
    sort?: string,
    category?: string,
    price?: number,
    page?: number
  ) => Promise<ShopFiltersAndProduct>; // Define the return type

  AdminAllProducts: (id: string) => Promise<ListProductAdmin[]>; // Define the return type

  categoriesOfProducts: () => Promise<string[]>; // Define the return type

  addProduct: (
    _id: string,
    formData: FormData
  ) => Promise<createProductResponse>; // Define the return type

  getProductById: (ProductId: string) => Promise<getProductById>; // Define the return type
  updateProduct: (
    ProductId: string,
    adminId: string,
    formData: FormData
  ) => Promise<ShopFiltersAndProduct>; // Define the return type
  deleteProduct: ({
    ProductId,
    adminId,
  }: {
    ProductId: string;
    adminId: string;
  }) => Promise<ShopFiltersAndProduct>; // Define the return type
}

export const useProductStore = create<ProductState>((set) => ({
  error: null,
  isLoading: false,

  latestProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/latest-products`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data.products; // Return the fetched products
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },

  shopAllProducts: async (search, sort, category, price, page) => {
    set({ isLoading: true, error: null });

    try {
      // Construct query parameters
      const params: Record<string, string | number> = {};
      if (search) params.search = search;
      if (sort) params.sort = sort;
      if (category) params.category = category;
      if (price) params.price = price;
      if (page !== undefined) params.page = page;

      // Construct the URL with query parameters
      const response = await axios.get(`${API_URL}/shop-all`, { params });

      set({
        isLoading: false,
        error: null,
      });

      return response.data; // Return the fetched products
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },

  AdminAllProducts: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/admin-products?id=${id}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data.products; // Return the fetched products
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },

  categoriesOfProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/categories`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data.categories; // Return the fetched categories
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching categories",
        isLoading: false,
      });
      throw error;
    }
  },

  addProduct: async (_id, formData) => {
    set({ isLoading: true, error: null });

    try {
      // Send a POST request with the FormData containing the product details and photos
      const response = await axios.post(`${API_URL}/new?id=${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the header is set for file uploads
        },
      });

      // Handle success
      set({ isLoading: false, error: null });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error adding products",
        isLoading: false,
      });
      throw error;
    }
  },

  getProductById: async (ProductId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/${ProductId}`);

      set({
        isLoading: false,
        error: null,
      });

      return response.data.product; // Return the fetched products
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProduct: async (ProductId, adminId, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/${ProductId}?id=${adminId}`,
        formData
      );

      set({
        isLoading: false,
        error: null,
      });

      return response.data; // Return the fetched products
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProduct: async ({ ProductId, adminId }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(
        `${API_URL}/${ProductId}?id=${adminId}`
      );

      set({
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },
}));
