import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";

const OrderDetails = () => {
  const { id } = useParams();
  const { getOrderDetailsById } = useOrderStore();
  const [order, setOrder] = useState<any>({
    name: "",
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
  const {
    name,
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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const res: any = await getOrderDetailsById(id!);
      if (res && res.success) {
        const { order }: { order: any } = res;
        setOrder({
          name: order.shippingInfo.name,
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

  return (
    <div className="container">
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
          <h1>Order Info</h1>
          <h5>Your Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
          </p>
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

export default OrderDetails;
