import { CountQueuingStrategy } from "stream/web";
import { myCache } from "../app.js";
import { tryCatch } from "../middlewares/error.js";
import { Order } from "../models/orders.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import {
  calculatePercentage,
  getChartData,
  getInventory,
} from "../utils/features.js";

export const getDashboardData = tryCatch(async (req, res, next) => {
  let stats = {};

  const key = "admin-dashboardStats";

  if (myCache.get(key)) {
    stats = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    //Product
    const ProductThisMonthPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const ProductLastMonthPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    //User

    const UserThisMonthPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const UserLastMonthPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    //Order

    const OrderThisMonthPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const OrderLastMonthPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const OrderLastSixMonthPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestFourTransactionPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      ProductThisMonth,
      UserThisMonth,
      OrderThisMonth,
      ProductLastMonth,
      UserLastMonth,
      OrderLastMonth,
      totalProductCount,
      totalUserCount,
      totalOrders,
      OrderLastSixMonth,
      productCategories,
      femaleUserCount,
      latestFourTransaction,
    ] = await Promise.all([
      ProductThisMonthPromise,
      UserThisMonthPromise,
      OrderThisMonthPromise,
      ProductLastMonthPromise,
      UserLastMonthPromise,
      OrderLastMonthPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      OrderLastSixMonthPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestFourTransactionPromise,
    ]);

    //calculate revenue
    const revenueThisMonth = OrderThisMonth.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const revenueLastMonth = OrderLastMonth.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    //calculate percentages

    const ChangePercentage = {
      revenue: calculatePercentage(revenueThisMonth, revenueLastMonth),
      product: calculatePercentage(
        ProductThisMonth.length,
        ProductLastMonth.length
      ),
      user: calculatePercentage(UserThisMonth.length, UserLastMonth.length),
      order: calculatePercentage(OrderThisMonth.length, OrderLastMonth.length),
    };

    const revenue = totalOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const counts = {
      revenue,
      user: totalUserCount,
      product: totalProductCount,
      orders: totalOrders.length,
    };

    //details of last six months orders

    const orderMonthCount = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);

    OrderLastSixMonth.forEach((order) => {
      const creationDate = order.createdAt;

      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCount[5 - monthDiff] += 1;
        orderMonthRevenue[5 - monthDiff] += order.total;
      }
    });

    //Inventory section
    const categoryCountWithName = await getInventory({
      productCategories,
      totalProductCount,
    });

    //gender section
    const userRatio = {
      male: totalUserCount - femaleUserCount,
      female: femaleUserCount,
    };

    //user transaction data
    const modifiedlatestFourTransaction = latestFourTransaction.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    //passing every thing into stats
    stats = {
      categoryCountWithName,
      ChangePercentage,
      counts,
      chart: {
        order: orderMonthCount,
        revenue: orderMonthRevenue,
      },
      userRatio,
      latestFourTransaction: modifiedlatestFourTransaction,
    };

    myCache.set(key, JSON.stringify(stats));
  }

  //send response
  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieChart = tryCatch(async (req, res, next) => {
  let Piecharts;
  const key = "admin-pie-chart";

  if (myCache.has(key)) {
    Piecharts = JSON.parse(myCache.get(key) as string);
  } else {
    const revenueDistributionPromise = Order.find({}).select([
      "total",
      "subtotal",
      "tax",
      "shippingCharges",
      "discount",
    ]);

    const [
      ProcessingOrdersCount,
      ShippedOrdersCount,
      DeliveredOrdersCount,
      productCategories,
      totalProductCount,
      ProductsoutOfStock,
      revenueDistribution,
      allUsers,
      AdminUser,
      customerUser,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      revenueDistributionPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    //order Fullfillment PieChart
    const orderFullFillMent = {
      Processing: ProcessingOrdersCount,
      Shipped: ShippedOrdersCount,
      Delivered: DeliveredOrdersCount,
    };

    //category PieChart
    const categoryCountWithName = await getInventory({
      productCategories,
      totalProductCount,
    });

    //stockAvailablity PieChart
    const stockAvailablity = {
      inStock: totalProductCount - ProductsoutOfStock,
      outOfStock: ProductsoutOfStock,
    };

    //revenue distribution

    const GrossIncome = revenueDistribution.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = revenueDistribution.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = revenueDistribution.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burntCost = revenueDistribution.reduce(
      (prev, order) => prev + (order.tax || 0),
      0
    );

    const marketingCost = Math.round(GrossIncome * (30 / 100));

    const netMargin =
      GrossIncome - discount - productionCost - burntCost - marketingCost;

    const revenueDistributionToSend = {
      netMargin,
      discount,
      productionCost,
      burnt: burntCost,
      marketingCost,
    };

    //age distribution
    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    //role Distribution

    const adminAndCustomers = {
      admin: AdminUser,
      customers: customerUser,
    };

    //adding everything into piecharts obj.
    Piecharts = {
      orderFullFillMent,
      categoryCountWithName,
      stockAvailablity,
      revenueDistributionToSend,
      adminAndCustomers,
      usersAgeGroup,
    };

    myCache.set(key, JSON.stringify(Piecharts));
  }

  return res.status(200).json({
    success: true,
    Piecharts,
  });
});

export const getBarChart = tryCatch(async (req, res, next) => {
  let BarChart;

  const key = "admin-bar-chart";

  if (myCache.has(key)) {
    BarChart = JSON.parse(myCache.get(key) as string);
  } else {
    //intializing Dates
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    //creating Promises

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    interface MyDocument extends Document {
      createdAt: Date;
      discount?: number;
      total?: number;
    }

    const productCounts = getChartData({
      length: 6,
      today,
      docArr: products.map(
        (order) =>
          ({
            createdAt: order.createdAt,
          } as MyDocument)
      ),
    });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({
      length: 12,
      today,
      docArr: orders.map(
        (order) =>
          ({
            createdAt: order.createdAt,
          } as MyDocument)
      ),
    });

    //adding everything into Barchart obj.
    BarChart = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };
    //set cache
    myCache.set(key, JSON.stringify(BarChart));
  }

  return res.status(200).json({
    success: true,
    BarChart,
  });
});

export const getLineChart = tryCatch(async (req, res, next) => {
  let LineChart;

  const key = "admin-line-chart";

  if (myCache.has(key)) {
    LineChart = JSON.parse(myCache.get(key) as string);
  } else {
    //intializing Dates
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    //creating Promises

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, user, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    interface MyDocument extends Document {
      createdAt: Date;
      discount?: number;
      total?: number;
    }

    const productCounts = getChartData({
      length: 12,
      today,
      docArr: products.map(
        (order) =>
          ({
            createdAt: order.createdAt,
          } as MyDocument)
      ),
    });
    const usersCounts = getChartData({ length: 12, today, docArr: user });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders.map(
        (order) =>
          ({
            createdAt: order.createdAt,
            discount: order.discount,
          } as MyDocument)
      ),
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders.map(
        (order) =>
          ({
            createdAt: order.createdAt,
            total: order.total,
          } as MyDocument)
      ),
      property: "total",
    });

    //adding everything into Barchart obj.
    LineChart = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };
    //set cache
    myCache.set(key, JSON.stringify(LineChart));
  }

  return res.status(200).json({
    success: true,
    LineChart,
  });
});
