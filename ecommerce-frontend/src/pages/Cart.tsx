import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import Product from "../components/Product";
import { useCartStore } from "../store/cartStore";
import axios from "axios";
import { server } from "../App";
import toast from "react-hot-toast";
import { useProductStore } from "../store/productStore";

const Checkout: React.FC = () => {
  const {
    fetchAllCosts,
    cartItems,
    addDiscount,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  } = useCartStore(); // Get values from Zustand store
  const { getProductById } = useProductStore();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCosts();
  }, []);

  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();

    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          setIsValidCouponCode(true);
          addDiscount(res.data.discount);
          fetchAllCosts();
        })
        .catch(() => {
          setIsValidCouponCode(false);
          addDiscount(0);
          fetchAllCosts();
        });
    }, 200);
    return () => {
      clearTimeout(timeOutId);
      cancel();
      fetchAllCosts();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    cartItems.map((items) => {
      const checkSubmit = async (items: any) => {
        const product: any = await getProductById(items.id);
        if (items.stock !== product.stock) {
          items.stock = product.stock;
        }
      };
      checkSubmit(items);
    });
  }, []);

  const onSubmitHandler = async () => {
    const hasStockIssue = cartItems.some((item) => {
      if (item.quantity > item.stock) {
        toast.error(`Stock for ${item.name} is less than the quantity`);
        return true; // Breaks out of some() when stock issue is found
      }
      return false;
    });

    if (!hasStockIssue) {
      navigate("/shipping");
    }
  };

  return (
    <div className="cart">
      {/* Coupon code */}
      <div className="promo-code-card">
        <h2 className="cart-title">Promo code</h2>
        <div className="Coupon-code-flex">
          <input
            value={couponCode}
            type="text"
            placeholder="Coupon code"
            className="promo-code-input"
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className="black-button coupon-btn">Apply</button>
        </div>
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              You got {discount}% off using the code <code>"{couponCode}"</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
      </div>
      {/* Cart price detail */}
      <div className="cart-container">
        <h2 className="cart-title">Checkout</h2>
        <div className="cart-item">
          <span className="cart-item-label">Subtotal:</span>
          <span className="cart-item-value">₹{subtotal}</span>
        </div>
        <div className="cart-item">
          <span className="cart-item-label">Tax:</span>
          <span className="cart-item-value">₹{tax}</span>
        </div>
        <div className="cart-item">
          <span className="cart-item-label">Shipping:</span>
          <span className="cart-item-value">₹{shippingCharges}</span>
        </div>
        <div className="cart-item">
          <span className="cart-item-label">Discount:</span>
          <em className="cart-item-value red">
            - ₹{Math.round((discount / 100) * subtotal)}
          </em>
        </div>
        <div className="cart-item">
          <span className="cart-item-label">Total:</span>
          <span className="cart-total">₹{Math.round(total)}</span>
        </div>
        <button
          className="black-button w-full"
          onClick={() => onSubmitHandler()}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const { cartItems } = useCartStore(); // Get cart items from Zustand store

  return (
    <div className="shopping-cart container">
      <div className="shopping-cart-main">
        {cartItems.length > 0 ? (
          cartItems.map((item: any) => (
            <Product
              key={item.id}
              imageSrc={item.imageSrc}
              productName={item.name}
              price={item.price}
              quantity={item.quantity}
              productId={item.id}
              stock={item.stock}
            />
          ))
        ) : (
          <span>Cart is empty</span>
        )}
      </div>
      <Checkout />
    </div>
  );
};

export default Cart;
