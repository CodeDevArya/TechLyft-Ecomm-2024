import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface baseQuery {
  name?: {
    $regex: string;
    $options: string;
  };

  price?: { $lte: number };
  category?: string;
}

export type invalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userID?: string;
  orderId?: string;
  productId?: string | string[];
};

export type OrderItemsType = {
  id: any;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  stock: number;
};

export type shippingInfoTypes = {
  name: string;
  phone: number;
  country: string;
  pincode: number;
  address: string;
  city: string;
  state: string;
};

export interface NewOrderRequestBody {
  shippingInfo: shippingInfoTypes;
  user: string;
  subtotal: number;
  tax: Number;
  shippingCharges: Number;
  discount: Number;
  total: Number;
  cartItems: OrderItemsType[];
}
