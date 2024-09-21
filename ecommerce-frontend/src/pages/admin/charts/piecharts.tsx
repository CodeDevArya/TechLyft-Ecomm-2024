import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { useDashboardStats } from "../../../store/DashboardStore";
import { useAuthStore } from "../../../store/authStore";
import Loader from "../../../components/admin/Loader";

const PieCharts = () => {
  const { PieChartStats, isLoading } = useDashboardStats();
  const { user } = useAuthStore();

  const [PieChartStatsRes, setPieChartStatsRes] = useState<any>();

  useEffect(() => {
    const FetchdashboardStats = async () => {
      try {
        const res: any = await PieChartStats(user?._id!);
        setPieChartStatsRes(res.Piecharts);
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
          <h1>Pie & Doughnut Charts</h1>
          <section>
            <div>
              <PieChart
                labels={["Processing", "Shipped", "Delivered"]}
                data={[
                  PieChartStatsRes?.orderFullFillMent?.Processing,
                  PieChartStatsRes?.orderFullFillMent?.Shipped,
                  PieChartStatsRes?.orderFullFillMent?.Delivered,
                ]}
                backgroundColor={[
                  `hsl(110,80%, 80%)`,
                  `hsl(110,80%, 50%)`,
                  `hsl(110,40%, 50%)`,
                ]}
                offset={[0, 0, 50]}
              />
            </div>
            <h2>Order Fulfillment Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={PieChartStatsRes?.categoryCountWithName.map(
                  (item: Record<string, number>) => Object.keys(item)[0]
                )}
                data={PieChartStatsRes?.categoryCountWithName.map(
                  (item: Record<string, number>) => Object.values(item)[0]
                )}
                backgroundColor={PieChartStatsRes?.categoryCountWithName.map(
                  (item: Record<string, number>) => {
                    const value = Object.values(item)[0];
                    return `hsl(${value * 4}, ${Math.random() * 89}%, 50%)`;
                  }
                )}
                legends={false}
                offset={[0, 0, 0, 80]}
              />
            </div>
            <h2>Product Categories Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={["In Stock", "Out Of Stock"]}
                data={[
                  PieChartStatsRes?.stockAvailablity?.inStock,
                  PieChartStatsRes?.stockAvailablity?.outOfStock,
                ]}
                backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                legends={false}
                offset={[0, 80]}
                cutout={"70%"}
              />
            </div>
            <h2> Stock Availability</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={[
                  "Marketing Cost",
                  "Discount",
                  "Burnt",
                  "Production Cost",
                  "Net Margin",
                ]}
                data={[
                  PieChartStatsRes?.revenueDistributionToSend?.marketingCost,
                  PieChartStatsRes?.revenueDistributionToSend?.discount,
                  PieChartStatsRes?.revenueDistributionToSend?.burnt,
                  PieChartStatsRes?.revenueDistributionToSend?.productionCost,
                  PieChartStatsRes?.revenueDistributionToSend?.netMargin,
                ]}
                backgroundColor={[
                  "hsl(110,80%,40%)",
                  "hsl(19,80%,40%)",
                  "hsl(69,80%,40%)",
                  "hsl(300,80%,40%)",
                  "rgb(53, 162, 255)",
                ]}
                legends={false}
                offset={[20, 30, 20, 30, 80]}
              />
            </div>
            <h2>Revenue Distribution</h2>
          </section>

          <section>
            <div>
              <PieChart
                labels={[
                  "Teenager(Below 20)",
                  "Adult (20-40)",
                  "Older (above 40)",
                ]}
                data={[
                  PieChartStatsRes?.usersAgeGroup?.teen,
                  PieChartStatsRes?.usersAgeGroup?.adult,
                  PieChartStatsRes?.usersAgeGroup?.old,
                ]}
                backgroundColor={[
                  `hsl(10, ${80}%, 80%)`,
                  `hsl(10, ${80}%, 50%)`,
                  `hsl(10, ${40}%, 50%)`,
                ]}
                offset={[0, 0, 50]}
              />
            </div>
            <h2>Users Age Group</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={["Admin", "Customers"]}
                data={[
                  PieChartStatsRes?.adminAndCustomers?.admin,
                  PieChartStatsRes?.adminAndCustomers?.customers,
                ]}
                backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                offset={[0, 50]}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default PieCharts;
