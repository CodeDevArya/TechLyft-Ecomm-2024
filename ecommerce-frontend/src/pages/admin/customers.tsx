import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useUserStrore } from "../../store/userStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Loader from "../../components/admin/Loader";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { getAllAdminUsers, deleteUser, isLoading } = useUserStrore();
  const { user } = useAuthStore();
  const [rows, setRows] = useState<DataType[]>([]);
  const [rowsTwo, setRowsTwo] = useState<DataType[]>([
    {
      avatar: (
        <img
          style={{
            borderRadius: "50%",
          }}
          src="https://cdn-icons-png.flaticon.com/256/6997/6997674.png"
          alt="user"
        />
      ),
      name: "John Doe",
      email: "johndoe@example.com",
      gender: "male",
      role: "admin",
      action: (
        <button onClick={() => OnDeleteHandler("John Doe")}>
          <FaTrash />
        </button>
      ),
    },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users: any = await getAllAdminUsers(user?._id!);
      setRows(
        users.data!.map((user: any) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={
                user.gender === "male"
                  ? "https://cdn-icons-png.flaticon.com/256/6997/6997674.png"
                  : "https://cdn-icons-png.flaticon.com/256/6998/6998126.png"
              }
              alt="user"
            />
          ),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={() => OnDeleteHandler(user._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    };
    fetchUsers();
  }, [rowsTwo]);

  const OnDeleteHandler = async (userId: string) => {
    const confirmAns = confirm("Are you sure you want to delete this user?");
    if (confirmAns) {
      await deleteUser(userId, user?._id!);
      setRowsTwo([]);
      toast.success("User deleted successfully");
    }
  };

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container container">
      <AdminSidebar />
      <main>{isLoading ? <Loader /> : Table}</main>
    </div>
  );
};

export default Customers;
