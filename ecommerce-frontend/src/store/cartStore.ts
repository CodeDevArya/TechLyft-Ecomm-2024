import axios from "axios";
import { create } from "zustand";
import { CartItem, CartState } from "../types/types";

axios.defaults.withCredentials = true;

export const useCartStore = create<CartState>((set: any) => {
  // Initialize the cart from localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

  return {
    error: null,
    isLoading: false,
    cartItems: storedCart, // Initialize with stored cart
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: [],

    // Helper function to update localStorage
    updateLocalStorage: (cartItems: CartItem[]) => {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    },

    // Add an item to the cart
    addToCart: (item: CartItem) =>
      set((state: CartState) => {
        const existingItem = state.cartItems.find(
          (cartItem: CartItem) => cartItem.id === item.id
        );
        let updatedCartItems;
        if (existingItem) {
          // Update quantity if the item already exists in the cart and stock allows
          updatedCartItems = state.cartItems.map((cartItem: CartItem) =>
            cartItem.id === item.id && cartItem.quantity < cartItem.stock
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          // Add new item to the cart
          updatedCartItems = [
            ...state.cartItems,
            {
              ...item,
              quantity: item.quantity,
              imageSrc: item.imageSrc, // Ensure imageSrc is included
            },
          ];
        }

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));

        return { cartItems: updatedCartItems };
      }),

    // Remove an item from the cart
    removeFromCart: (id: string) =>
      set((state: CartState) => {
        const updatedCartItems = state.cartItems.filter(
          (item: CartItem) => item.id !== id
        );

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));

        return { cartItems: updatedCartItems };
      }),

    // Clear the entire cart
    clearCart: () =>
      set(() => {
        localStorage.removeItem("cart");
        return { cartItems: [] };
      }),

    // Update the quantity of a specific item
    updateQuantity: (id: string, quantity: number) =>
      set((state: CartState) => {
        const updatedCartItems = state.cartItems.map((item: CartItem) =>
          item.id === id
            ? { ...item, quantity: Math.min(quantity, item.stock) } // Cap quantity to stock
            : item
        );
    
        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    
        return { cartItems: updatedCartItems };
      }),

    // Calculate all costs and update state
    fetchAllCosts: () =>
      set((state: CartState) => {
        const subtotal = state.cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        const shippingCharges =
          subtotal > 5000 ? 0 : Math.round(subtotal * 0.25);
        const tax = Math.round(subtotal * 0.18);
        const discountTwo = (state.discount / 100) * subtotal;
        const discount = state.discount;
        const total = subtotal + shippingCharges + tax - discountTwo;

        return {
          subtotal,
          shippingCharges,
          tax,
          total,
          discount,
        };
      }),

    // Add discount in state
    addDiscount: (discount) =>
      set(() => ({
        discount,
      })),
  };
});
