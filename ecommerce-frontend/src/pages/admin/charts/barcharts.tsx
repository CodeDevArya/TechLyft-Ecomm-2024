import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { useDashboardStats } from "../../../store/DashboardStore";
import { useAuthStore } from "../../../store/authStore";
import Loader from "../../../components/admin/Loader";
import { getLastMonths } from "../../../types/types";

const { lastSixMonths, lastTwelveMonths } = getLastMonths();

const Barcharts = () => {
  const { BarChartStats, isLoading } = useDashboardStats();
  const { user } = useAuthStore();

  const [BartChartStatsRes, setBartChartStatsRes] = useState<any>();

  useEffect(() => {
    const FetchdashboardStats = async () => {
      try {
        const res: any = await BarChartStats(user?._id!);
        setBartChartStatsRes(res.BarChart);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    FetchdashboardStats();
  }, []);

  return (
    <div className="admin-container container">
      <AdminSidebar />
      {isLoading ? (
        <Loader />
      ) : (
        <main className="chart-container">
          <h1>Bar Charts</h1>
          <section>
            <BarChart
              data_2={BartChartStatsRes?.users}
              data_1={BartChartStatsRes?.products}
              title_1="Products"
              title_2="Users"
              bgColor_1={`hsl(260, 50%, 30%)`}
              bgColor_2={`hsl(360, 90%, 90%)`}
              labels={lastSixMonths}
            />
            <h2>Top Products & Top Customers</h2>
          </section>

          <section>
            <BarChart
              horizontal={true}
              data_1={BartChartStatsRes?.orders}
              data_2={[]}
              title_1="Orders"
              title_2=""
              bgColor_1={`hsl(180, 40%, 50%)`}
              bgColor_2=""
              labels={lastTwelveMonths}
            />
            <h2>Orders throughout the year</h2>
          </section>
        </main>
      )}
    </div>
  );
};

export default Barcharts;
