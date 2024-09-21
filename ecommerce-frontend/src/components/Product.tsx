import React from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

type ProductFormProps = {
  imageSrc: string;
  price: number;
  productName: string;
  quantity: number;
  productId: string;
  stock: number;
};

const Product: React.FC<ProductFormProps> = ({
  imageSrc,
  productName,
  price,
  quantity,
  productId,
  stock,
}) => {
  // Access Zustand store functions
  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    fetchAllCosts,
    cartItems,
  } = useCartStore();

  // Handle increasing the product quantity
  const handleIncreaseQuantity = () => {
    const product = cartItems.find((item) => item.id === productId);

    if (product && product.quantity < product.stock) {
      addToCart(product);
      fetchAllCosts();
    } else {
      toast.error("No more products available");
    }
  };

  // Handle decreasing the product quantity
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    } else {
      // If quantity is 1, remove the item from the cart
      removeFromCart(productId);
    }
    fetchAllCosts();
  };

  // Handle removing the product from the cart
  const handleRemoveFromCart = () => {
    removeFromCart(productId);
    fetchAllCosts();
  };

  return (
    <div className="product">
      <span className="cart-product-info">
        <Link to={`/shop/product/visit/${productId}`}>
          <img src={imageSrc} alt="Product Image" className="product-img" />
        </Link>
        <div>
          <h3 className="product-name">{productName}</h3>
          <p className="product-price">Price: ₹{price}</p>
          <p className="product-price">{stock} units in stock</p>
        </div>
      </span>

      <span className="trash">
        <div className="product-buttons">
          <button
            className="black-button plus-minus-btn"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <span className="shared-input">{quantity}</span>
          <button
            className="black-button plus-minus-btn"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
        <FaTrash className="trash-can" onClick={handleRemoveFromCart} />
      </span>
    </div>
  );
};

export default Product;
