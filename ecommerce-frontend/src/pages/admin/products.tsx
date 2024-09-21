import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useProductStore } from "../../store/productStore";
import { ListProductAdmin } from "../../types/types";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/admin/Loader";
import { server } from "../../App";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { AdminAllProducts, isLoading, error } = useProductStore();
  const { user } = useAuthStore();
  const [allProducts, setAllProducts] = useState<ListProductAdmin[]>([]);
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    const getAllProducts = async () => {
      if (user) {
        try {
          const res = await AdminAllProducts(user._id);
          setAllProducts(res!);
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch products.");
        }
      }
    };

    getAllProducts();
  }, [AdminAllProducts, user]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setRows(
        allProducts.map((product: any) => ({
          key: product._id,
          photo: (
            <img src={`${server}/${product.photos[0]}`} alt={product.name} />
          ),
          name: product.name,
          price: product.price,
          stock: product.stock,
          action: <Link to={`/admin/product/${product._id}`}>Manage</Link>,
        }))
      );
    }
  }, [allProducts]);

  if (error) {
    toast.error(error);
    console.log(error);
  }

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container container">
      <AdminSidebar />
      <main>{isLoading ? <Loader /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
