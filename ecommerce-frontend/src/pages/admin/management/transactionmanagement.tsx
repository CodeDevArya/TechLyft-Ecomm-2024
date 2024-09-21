import { FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { useOrderStore } from "../../../store/orderStore";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";

const TransactionManagement = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { getOrderDetailsById, processOrder, deleteOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>({
    name: "",
    phone: 0,
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: 0,
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: [],
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const res: any = await getOrderDetailsById(id!);
      if (res && res.success) {
        const { order }: { order: any } = res;
        setOrder({
          name: order.shippingInfo.name,
          phone: order.shippingInfo.phone,
          address: order.shippingInfo.address,
          city: order.shippingInfo.city,
          state: order.shippingInfo.state,
          country: order.shippingInfo.country,
          pinCode: order.shippingInfo.pincode,
          status: order.status,
          subtotal: order.subtotal,
          discount: order.discount,
          shippingCharges: order.shippingCharges,
          tax: order.tax,
          total: order.total,
          orderItems: order.orderItems,
        });
      }
    };
    fetchOrderDetails();
  }, [id, getOrderDetailsById]);

  const updateHandler = async () => {
    const isProcessing = status === "Processing";
    const isShipped = status === "Shipped";

    if (status === "Delivered") {
      toast.error("Order already Delivered");
    }

    try {
      await processOrder(id!, user?._id!);

      if (isProcessing) {
        setOrder((prev: any) => ({
          ...prev,
          status: "Shipped",
        }));
        toast.success("Order status updated to Shipped");
      } else if (isShipped) {
        setOrder((prev: any) => ({
          ...prev,
          status: "Delivered",
        }));
        toast.success("Order status updated to Delivered");
      }
    } catch (error) {
      toast.error("Failed to update order status");
      throw error;
    }
  };

  const DeleteOrderHandler = async () => {
    try {
      await deleteOrder(id!, user?._id!);
      toast.success("Order deleted successfully");
      navigate("/admin/transaction");
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  const {
    name,
    phone,
    address,
    city,
    country,
    state,
    pinCode,
    subtotal,
    shippingCharges,
    tax,
    discount,
    total,
    status,
    orderItems,
  } = order;

  return (
    <div className="admin-container container">
      <AdminSidebar />
      <main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderItems.map(
            (i: {
              _id: string;
              name: string;
              price: number;
              quantity: number;
              imageSrc: string;
            }) => (
              <ProductCard
                key={i._id}
                name={i.name}
                photo={i.imageSrc}
                productId={i._id}
                quantity={i.quantity}
                price={i.price}
              />
            )
          )}
        </section>

        <article className="shipping-info-card">
          {status === "Delivered" && (
            <button className="product-delete-btn" onClick={DeleteOrderHandler}>
              <FaTrash />
            </button>
          )}
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
          </p>
          <p>Phone no: {phone}</p>
          <h5>Amount Info</h5>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping Charges: ₹{shippingCharges}</p>
          <p>Tax: ₹{tax}</p>
          <p>Discount: ₹{Math.round((discount / 100) * subtotal)} ({discount}%)</p>
          <p>Total: ₹{Math.round(total)}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          {status !== "Delivered" && (
            <div>( status must be Delivered before deleting the order )</div>
          )}
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>
    </div>
  );
};

const ProductCard = ({ name, photo, price, quantity, productId }: any) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/shop/product/visit/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
