import { ReactElement } from "react";
import moment from "moment";

export interface ListProduct {
  _id: string;
  photos: string[];
  name: string;
  price: number;
  rating: number;
  totalReviews: number;
}
export interface ListProductAdmin {
  _id: string;
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}
export interface ShopFiltersAndProduct {
  success: boolean;
  products: ListProduct[];
  totalPage: number;
}
export interface createProductResponse {
  success: boolean;
  message: string;
  product: object;
}

export interface getProductById {
  _id: string;
  photos: string[];
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  rating: number;
  totalReviews: number;
}

//----------------------------------------------------------------
export interface ShippingInfo {
  name: string;
  phone: number;
  country: string;
  pincode: number;
  address: string;
  city: string;
  state: string;
}

export interface CartItem {
  id: any;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  stock: number;
}

export interface CartState {
  error: string | null;
  isLoading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  fetchAllCosts: () => void;
  addDiscount: (discount: number) => void;
}

// features
export const getLastMonths = () => {
  const currentDate = moment();

  currentDate.date(1);

  const lastSixMonths: string[] = [];
  const lastTwelveMonths: string[] = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");

    lastSixMonths.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");

    lastTwelveMonths.unshift(monthName);
  }

  return { lastSixMonths, lastTwelveMonths };
};
