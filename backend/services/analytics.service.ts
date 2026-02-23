import { analyticsRepo } from "../repos/analytics.repo.ts";
import { getDateFilter } from "../utils/dateRange.ts";

const getItemCategoryAnalytics = async (query: any) => {
  const { range } = query;
  const dateFilter = getDateFilter(range);

  const data = await analyticsRepo.aggregateOrder([
    { $match: dateFilter },

    {
      $facet: {
        itemAnalytics: [
          { $unwind: "$items" },

          {
            $lookup: {
              from: "items",
              localField: "items.item",
              foreignField: "_id",
              as: "itemData",
            },
          },
          { $unwind: "$itemData" },

          {
            $group: {
              _id: "$itemData._id",
              name: { $first: "$itemData.name" },
              totalSold: { $sum: "$items.quantity" },
              totalRevenue: {
                $sum: {
                  $multiply: ["$items.quantity", "$items.price"],
                },
              },
              orderCount: { $sum: 1 },
            },
          },
          {
            $addFields: {
              avgQtyPerOrder: {
                $round: [{ $divide: ["$totalSold", "$orderCount"] }, 2],
              },
            },
          },
        ],

        categoryAnalytics: [
          { $unwind: "$items" },

          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryData",
            },
          },
          { $unwind: "$categoryData" },

          {
            $group: {
              _id: "$categoryData._id",
              name: { $first: "$categoryData.name" },
              totalSold: { $sum: "$items.quantity" },
              totalRevenue: {
                $sum: {
                  $multiply: ["$items.quantity", "$items.price"],
                },
              },
              orderCount: { $sum: 1 },
            },
          },
          {
            $addFields: {
              avgOrderValue: {
                $round: [{ $divide: ["$totalRevenue", "$orderCount"] }, 2],
              },
            },
          },
        ],
      },
    },
  ]);

  const result = data[0];

  const topSellingItems =
    result.itemAnalytics
      ?.sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5)
      .map((item: any, index: number) => ({
        name: item.name,
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
        orderCount: item.orderCount,
        avgQtyPerOrder: item.avgQtyPerOrder,
      })) || [];

  const topCategories =
    result.categoryAnalytics
      ?.sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
      .map((cat: any) => ({
        name: cat.name,
        totalSold: cat.totalSold,
        totalRevenue: cat.totalRevenue,
        avgOrderValue: cat.avgOrderValue,
      })) || [];

  const paymentBreakdown =
    result.paymentBreakdown?.map((p: any) => ({
      status: p._id,
      totalOrders: p.totalOrders,
      totalRevenue: p.totalRevenue,
    })) || [];

  return {
    topSellingItems,
    topCategories,
    revenueTrend: result.revenueTrend || [],
    peakHour: result.peakHour || [],
    paymentBreakdown,
  };
};

const getUserAnalytics = async (query: any) => {
  const { range } = query;
  const dateFilter = getDateFilter(range);

  const data = await analyticsRepo.aggregateOrder([
    { $match: dateFilter },

    {
      $facet: {
        userStats: [
          {
            $group: {
              _id: "$user",
              totalSpent: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
              firstOrderDate: { $min: "$createdAt" },
              lastOrderDate: { $max: "$createdAt" },
            },
          },
          {
            $addFields: {
              avgOrderValue: {
                $round: [{ $divide: ["$totalSpent", "$totalOrders"] }, 2],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: "$userData" },
        ],

        favoriteCategory: [
          {
            $group: {
              _id: { user: "$user", category: "$category" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          {
            $group: {
              _id: "$_id.user",
              favoriteCategory: { $first: "$_id.category" },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "favoriteCategory",
              foreignField: "_id",
              as: "categoryData",
            },
          },
          { $unwind: "$categoryData" },
        ],

        totalRevenue: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ],

      },
    },
  ]);

  const result = data[0];

  const favoriteMap = new Map();
  result.favoriteCategory.forEach((fc: any) => {
    favoriteMap.set(fc._id.toString(), fc.categoryData.name);
  });

  const users = result.userStats.map((user: any) => {
    const userId = user._id.toString();

    return {
      name: user.userData.name,
      totalSpent: user.totalSpent,
      totalOrders: user.totalOrders,
      avgOrderValue: user.avgOrderValue,
      firstOrderDate: user.firstOrderDate,
      lastOrderDate: user.lastOrderDate,
      favoriteCategory: favoriteMap.get(userId) || null,
    };
  });

  return {
    topUsersByOrders: [...users]
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 5)
      .map((u, index) => ({
        ...u,
      })),
  };
};

const getOrderStats = async (query: any) => {
  const { range } = query;
  const dateFilter = getDateFilter(range);

  const data = await analyticsRepo.aggregateOrder([
    { $match: dateFilter },

    {
      $facet: {
        coreStats: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$totalAmount" },
              avgOrderValue: { $avg: "$totalAmount" },
            },
          },
        ],

        basketStats: [
          { $unwind: "$items" },
          {
            $group: {
              _id: "$_id",
              totalItems: { $sum: "$items.quantity" },
            },
          },
          {
            $group: {
              _id: null,
              avgItemsPerOrder: { $avg: "$totalItems" },
            },
          },
        ],

        paymentBreakdown: [
          {
            $group: {
              _id: "$paymentStatus",
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ],

        adminVsUser: [
          {
            $group: {
              _id: "$placedByAdmin",
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ],

        mostOrderedTimeSlot: [
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryData",
            },
          },
          { $unwind: "$categoryData" },
          {
            $group: {
              _id: "$categoryData.name",
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
          { $sort: { totalOrders: -1 } },
        ],

        peakHour: [
          {
            $group: {
              _id: { $hour: "$createdAt" },
              totalOrders: { $sum: 1 },
            },
          },
          { $sort: { totalOrders: -1 } },
        ],

        orderTrend: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ],
      },
    },
  ]);

  const result = data[0];

  const core = result.coreStats[0] || {};
  const basket = result.basketStats[0] || {};

  const totalOrders = core.totalOrders || 0;
  const totalRevenue = core.totalRevenue || 0;

  const paymentBreakdown =
    result.paymentBreakdown?.map((p: any) => ({
      status: p._id,
      totalOrders: p.totalOrders,
      totalRevenue: p.totalRevenue,
    })) || [];

  const paidOrders =
    paymentBreakdown.find((p: any) => p.status === "paid")?.totalOrders || 0;

  const paymentSuccessRate =
    totalOrders > 0 ? Number(((paidOrders / totalOrders) * 100).toFixed(2)) : 0;

  const adminSplit =
    result.adminVsUser?.map((a: any) => ({
      type: a._id ? "Admin Orders" : "User Orders",
      totalOrders: a.totalOrders,
      totalRevenue: a.totalRevenue,
    })) || [];

  return {
    summary: {
      totalOrders,
      totalRevenue,
      averageOrderValue: Number((core.avgOrderValue || 0).toFixed(2)),
      averageItemsPerOrder: Number((basket.avgItemsPerOrder || 0).toFixed(2)),
      paymentSuccessRate,
    },

    paymentBreakdown,

    adminVsUser: adminSplit,

    mostOrderedTimeSlot:
      result.mostOrderedTimeSlot?.map((slot: any) => ({
        name: slot._id,
        totalOrders: slot.totalOrders,
        totalRevenue: slot.totalRevenue,
      })) || [],

    peakHour:
      result.peakHour?.map((h: any) => ({
        hour: h._id,
        totalOrders: h.totalOrders,
      })) || [],

    orderTrend: result.orderTrend || [],
  };
};

const getRevenueAnalytics = async (query: any) => {
  const { range } = query;
  const dateFilter = getDateFilter(range);

  const data = await analyticsRepo.aggregateOrder([
    { $match: dateFilter },

    {
      $facet: {
       
        coreRevenue: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
              avgOrderValue: { $avg: "$totalAmount" },
            },
          },
        ],

       
        paymentRevenue: [
          {
            $group: {
              _id: "$paymentStatus",
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
            },
          },
        ],

        adminVsUser: [
          {
            $group: {
              _id: "$placedByAdmin",
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
            },
          },
        ],

    
        revenueTrend: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ],

        categoryRevenue: [
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryData",
            },
          },
          { $unwind: "$categoryData" },
          {
            $group: {
              _id: "$categoryData.name",
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
            },
          },
          { $sort: { totalRevenue: -1 } },
          { $limit: 5 },
        ],

      
        itemRevenue: [
          { $unwind: "$items" },
          {
            $lookup: {
              from: "items",
              localField: "items.item",
              foreignField: "_id",
              as: "itemData",
            },
          },
          { $unwind: "$itemData" },
          {
            $group: {
              _id: "$itemData.name",
              totalRevenue: {
                $sum: {
                  $multiply: ["$items.quantity", "$items.price"],
                },
              },
              totalSold: { $sum: "$items.quantity" },
            },
          },
          { $sort: { totalRevenue: -1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);

  const result = data[0];
  const core = result.coreRevenue[0] || {};

  const totalRevenue = core.totalRevenue || 0;
  const totalOrders = core.totalOrders || 0;

  const paymentBreakdown =
    result.paymentRevenue?.map((p: any) => ({
      status: p._id,
      totalRevenue: p.totalRevenue,
      totalOrders: p.totalOrders,
    })) || [];

  const paidRevenue =
    paymentBreakdown.find((p: any) => p.status === "paid")
      ?.totalRevenue || 0;

  const pendingRevenue =
    paymentBreakdown.find((p: any) => p.status === "pending")
      ?.totalRevenue || 0;

  const paymentCollectionRate =
    totalRevenue > 0
      ? Number(((paidRevenue / totalRevenue) * 100).toFixed(2))
      : 0;

  const adminSplit =
    result.adminVsUser?.map((a: any) => ({
      type: a._id ? "Admin Orders" : "User Orders",
      totalRevenue: a.totalRevenue,
      totalOrders: a.totalOrders,
    })) || [];

  return {
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue: Number(
        (core.avgOrderValue || 0).toFixed(2)
      ),
      paidRevenue,
      pendingRevenue,
      paymentCollectionRate,
    },

    paymentBreakdown,

    adminVsUser: adminSplit,

    revenueTrend: result.revenueTrend || [],

    topRevenueCategories:
      result.categoryRevenue?.map((c: any) => ({
        name: c._id,
        totalRevenue: c.totalRevenue,
        totalOrders: c.totalOrders,
      })) || [],

    topRevenueItems:
      result.itemRevenue?.map((i: any) => ({
        name: i._id,
        totalRevenue: i.totalRevenue,
        totalSold: i.totalSold,
      })) || [],
  };
};

export const analyticsService = {
  getItemCategoryAnalytics,
  getUserAnalytics,
  getOrderStats,
  getRevenueAnalytics,
};
