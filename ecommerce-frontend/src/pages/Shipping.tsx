import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../App";
import ShippingImage from "../assets/ShippingImage.png";

const inputClasses = "ShippingAddressForm-input";
const labelClasses = "ShippingAddressForm-label";
const formContainerClasses = "ShippingAddressForm-form-container";
const formContentClasses = "ShippingAddressForm-form-content";
const formHeaderClasses = "ShippingAddressForm-form-header";
const formGroupClasses = "ShippingAddressForm-form-group";
const formGridClasses = "ShippingAddressForm-form-grid";
const primaryButtonClasses = "ShippingAddressForm-primary-button";
const imageContainerClasses = "ShippingAddressForm-image-container";
const imageClasses = "ShippingAddressForm-image";

const Shipping = () => {
  const { cartItems, total, fetchAllCosts } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => fetchAllCosts(), []);
  const checkStockBeforeNavigate = () => {
    if (cartItems.length === 0) {
      toast.error("Please add something in the cart");
      return navigate("/shop");
    } // Ensure there are items in the cart

    const hasStockIssue = cartItems.some((item) => {
      if (item.quantity > item.stock) {
        toast.error(`Stock for ${item.name} is less than the quantity`);
        return true;
      }
      return false;
    });

    if (hasStockIssue) {
      navigate("/cart"); // Redirect to cart if stock issue
    }
  };

  checkStockBeforeNavigate();

  const options = [
    { value: "India", label: "India" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Nepal", label: "Nepal" },
  ];

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: 0,
    country: "",
    pincode: 0,
    address: "",
    city: "",
    state: "",
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement> | any) => {
    const { id, value } = e.target
      ? e.target
      : { id: "country", value: e.value };

    // Convert phone and pincode to number if they are the target input
    const updatedValue =
      id === "phone" || id === "pincode" ? Number(value) : value;

    setShippingInfo({ ...shippingInfo, [id]: updatedValue });
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
      const { data } = await axios.post(
        `${server}/api/v1/payment/create-payment`,
        {
          amount: Math.round(total),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/payment", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      throw error;
    }
  };

  return (
    <div className={`${formContainerClasses} container`}>
      <div className={formContentClasses}>
        <h2 className={formHeaderClasses}>Enter Shipping Address</h2>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className={labelClasses} htmlFor="name">
              Name
            </label>
            <input
              className={inputClasses}
              type="text"
              id="name"
              placeholder="Your Name"
              required
              onChange={onChangeHandler}
            />
          </div>
          <div className={formGridClasses}>
            <div>
              <label className={labelClasses} htmlFor="phone">
                Phone Number
              </label>
              <input
                className={inputClasses}
                type="tel"
                id="phone"
                placeholder="Your Phone Number"
                required
                onChange={onChangeHandler}
              />
            </div>
            <div>
              <label className={labelClasses}>Country</label>
              <Select
                options={options}
                id="country"
                placeholder="Choose Country"
                onChange={onChangeHandler}
              />
            </div>
          </div>
          <div>
            <label className={labelClasses} htmlFor="pincode">
              Pin Code
            </label>
            <input
              className={inputClasses}
              type="number"
              id="pincode"
              placeholder="Enter your Pin Code"
              required
              onChange={onChangeHandler}
            />
          </div>
          <div className={formGroupClasses}>
            <label className={labelClasses} htmlFor="address">
              Address (Area and Street)
            </label>
            <input
              className={inputClasses}
              type="text"
              id="address"
              placeholder="Address"
              required
              onChange={onChangeHandler}
            />
          </div>
          <div className={formGridClasses}>
            <div>
              <label className={labelClasses} htmlFor="city">
                City/District/Town
              </label>
              <input
                className={inputClasses}
                type="text"
                id="city"
                placeholder="City/District/Town"
                required
                onChange={onChangeHandler}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="state">
                State
              </label>
              <input
                className={inputClasses}
                type="text"
                id="state"
                placeholder="State"
                required
                onChange={onChangeHandler}
              />
            </div>
          </div>
          <button type="submit" className={primaryButtonClasses}>
            PAY NOW
          </button>
        </form>
      </div>
      <div className={imageContainerClasses}>
        <img
          src={ShippingImage}
          alt="Shipping Illustration"
          className={imageClasses}
        />
      </div>
    </div>
  );
};
export default Shipping;
