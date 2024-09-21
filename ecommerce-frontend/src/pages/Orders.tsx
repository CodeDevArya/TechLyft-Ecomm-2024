import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import { useAuthStore } from "../store/authStore";

type DataType = {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const { myOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchMyOrder = async () => {
      const res: any = await myOrder(user?._id!);
      res.map((orders: any) => {
        setRows((prev) => [
          ...prev,
          {
            _id: orders._id,
            quantity: orders.orderItems.length,
            discount: Math.round((orders.discount / 100) * orders.subtotal),
            amount: Math.round(orders.total),
            status: (
              <div
                className={
                  orders.status === "Processing"
                    ? "red"
                    : orders.status === "Shipped"
                    ? "green"
                    : "purple"
                }
              >{`${orders.status}`}</div>
            ),
            action: <Link to={`/orders/${orders._id}`}>Manage</Link>,
          },
        ]);
      });
    };
    fetchMyOrder();
  }, []);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>

      {Table}
    </div>
  );
};

export default Orders;
