import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { useAuthStore } from "../store/authStore";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
  const {
    cartItems,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
    fetchAllCosts,
  } = useCartStore();

  useEffect(() => {
    fetchAllCosts();
  }, []);

  const shippingInfo: Record<string, string | number> = JSON.parse(
    localStorage.getItem("shippingInfo") || "{}"
  );

  const { createOrder } = useOrderStore(); // Use createOrder from AuthStore
  const { user } = useAuthStore(); // Use createOrder from AuthStore

  ///-------------------------------------------------------------------
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const SubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent.status === "succeeded") {
      try {
        // Call createOrder with the required data
        await createOrder(
          user?._id!,
          cartItems,
          shippingInfo,
          subtotal,
          tax,
          shippingCharges,
          discount,
          total
        );
        toast.success("Order created successfully!");
        localStorage.removeItem("cart");
      } catch (error) {
        toast.error("Failed to create order. Please try again.");
        console.log(error);
      }
      toast.success("Order placed successfully");
      navigate("/orders");
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={SubmitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Chechout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) {
    return <Navigate to={"/shipping"} />;
  }

  return (
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckOutForm />
    </Elements>
  );
};

export default Chechout;
