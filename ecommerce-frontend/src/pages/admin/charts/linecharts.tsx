import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useDashboardStats } from "../../../store/DashboardStore";
import { getLastMonths } from "../../../types/types";
import { useAuthStore } from "../../../store/authStore";
import Loader from "../../../components/admin/Loader";

const { lastTwelveMonths } = getLastMonths();

const Linecharts = () => {
  const { LineChartStats, isLoading } = useDashboardStats();
  const { user } = useAuthStore();

  const [LineChartStatsRes, setLineChartStatsRes] = useState<any>();

  useEffect(() => {
    const FetchdashboardStats = async () => {
      try {
        const res: any = await LineChartStats(user?._id!);
        setLineChartStatsRes(res.LineChart);
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
          <h1>Line Charts</h1>
          <section>
            <LineChart
              data={LineChartStatsRes?.users || []}
              label="Users"
              borderColor="rgb(53, 162, 255)"
              labels={lastTwelveMonths}
              backgroundColor="rgba(53, 162, 255, 0.5)"
            />
            <h2>Active Users</h2>
          </section>

          <section>
            <LineChart
              data={LineChartStatsRes?.products || []}
              backgroundColor={"hsla(269,80%,40%,0.4)"}
              borderColor={"hsl(269,80%,40%)"}
              labels={lastTwelveMonths}
              label="Products"
            />
            <h2>Total Products (SKU)</h2>
          </section>

          <section>
            <LineChart
              data={LineChartStatsRes?.revenue || []}
              backgroundColor={"hsla(129,80%,40%,0.4)"}
              borderColor={"hsl(129,80%,40%)"}
              label="Revenue"
              labels={lastTwelveMonths}
            />
            <h2>Total Revenue </h2>
          </section>

          <section>
            <LineChart
              data={LineChartStatsRes?.discount || []}
              backgroundColor={"hsla(29,80%,40%,0.4)"}
              borderColor={"hsl(29,80%,40%)"}
              label="Discount"
              labels={lastTwelveMonths}
            />
            <h2>Discount Allotted </h2>
          </section>
        </main>
      )}
    </div>
  );
};

export default Linecharts;
