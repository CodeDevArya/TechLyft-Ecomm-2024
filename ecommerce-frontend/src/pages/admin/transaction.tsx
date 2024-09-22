import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Loader from "../../components/admin/Loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const { allAdminOrders, error, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  const [allTransactions, setAllTransactions] = useState<string[]>([]);
  const [rows, setRows] = useState<DataType[]>([]);
  const [secondLoading, setSecondLoading] = useState(false);

  useEffect(() => {
    setSecondLoading(true);
    const getAllProducts = async () => {
      if (user) {
        try {
          const res: any = await allAdminOrders(user._id);
          setAllTransactions(res!.orders);
          setSecondLoading(false);
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch products.");
          setSecondLoading(false);
        }
      }
    };

    getAllProducts();
  }, [allAdminOrders, user]);

  useEffect(() => {
    if (allTransactions.length > 0) {
      setRows(
        allTransactions?.map((transaction: any) => ({
          key: transaction._id,
          user: transaction.shippingInfo.name,
          discount: Math.round(
            (transaction.discount / 100) * transaction.subtotal
          ),
          amount: Math.round(transaction.total),
          quantity: transaction.orderItems.length,
          status: (
            <div
              className={
                transaction.status === "Processing"
                  ? "red"
                  : transaction.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >{`${transaction.status}`}</div>
          ),
          action: (
            <Link to={`/admin/transaction/${transaction._id}`}>Manage</Link>
          ),
        }))
      );
    }
  }, [allTransactions]);
  if (error) {
    toast.error(error);
    console.log(error);
  }

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container container">
      <AdminSidebar />
      <main>{isLoading || secondLoading ? <Loader /> : Table}</main>
    </div>
  );
};

export default Transaction;
