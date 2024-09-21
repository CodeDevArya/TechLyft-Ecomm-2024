import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";
import { useDashboardStats } from "../../store/DashboardStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/admin/Loader";
import { getLastMonths } from "../../types/types";

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Dashboard = () => {
  const { dashboardStats, isLoading } = useDashboardStats();
  const { user } = useAuthStore();
  const { lastSixMonths } = getLastMonths();

  const [DashboardRes, setDashboardRes] = useState<any>();

  useEffect(() => {
    const FetchdashboardStats = async () => {
      try {
        const res: any = await dashboardStats(user?._id!);
        setDashboardRes(res.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    FetchdashboardStats();
  }, [user, dashboardStats]); // Add dependencies here

  return (
    <div className="admin-container container">
      <AdminSidebar />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <main className="dashboard">
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={userImg} alt="User" />
            </div>

            <section className="widget-container">
              <WidgetItem
                percent={DashboardRes?.ChangePercentage?.revenue || 0}
                amount={true}
                value={DashboardRes?.counts?.revenue || 0}
                heading="Revenue"
                color="rgb(0, 115, 255)"
              />
              <WidgetItem
                percent={DashboardRes?.ChangePercentage?.user || 0}
                value={DashboardRes?.counts?.user || 0}
                color="rgb(0 198 202)"
                heading="Users"
              />
              <WidgetItem
                percent={DashboardRes?.ChangePercentage?.order || 0}
                value={DashboardRes?.counts?.orders || 0}
                color="rgb(255 196 0)"
                heading="Transactions"
              />

              <WidgetItem
                percent={DashboardRes?.ChangePercentage?.product || 0}
                value={DashboardRes?.counts?.product || 0}
                color="rgb(76 0 255)"
                heading="Products"
              />
            </section>

            <section className="graph-container">
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>
                <BarChart
                  data_2={DashboardRes?.chart?.order}
                  data_1={DashboardRes?.chart?.revenue}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0, 115, 255)"
                  bgColor_2="rgba(53, 162, 235, 0.8)"
                  labels={lastSixMonths}
                />
              </div>

              <div className="dashboard-categories">
                <h2>Inventory</h2>

                <div>
                  {DashboardRes?.categoryCountWithName.map((i: any) => {
                    const [heading, value]: any = Object.entries(i)[0];
                    return (
                      <CategoryItem
                        key={heading}
                        value={value}
                        heading={heading}
                        color={`hsl(${value * 4}, ${Math.random() * 89}%, 50%)`}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="transaction-container">
              <div className="gender-chart">
                <h2>Gender Ratio</h2>
                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[
                    DashboardRes?.userRatio?.female,
                    DashboardRes?.userRatio?.male,
                  ]}
                  backgroundColor={[
                    "hsl(340, 82%, 56%)",
                    "rgba(53, 162, 235, 0.8)",
                  ]}
                  cutout={90}
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>
              <Table data={DashboardRes?.latestFourTransaction} />
            </section>
          </main>
        </>
      )}
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const formatPercent = (percent: number) => {
  const absPercent = Math.abs(percent);
  return absPercent > 999
    ? `${absPercent.toString().slice(0, 4)}...`
    : `${percent}%`;
};

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {formatPercent(percent)}
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
