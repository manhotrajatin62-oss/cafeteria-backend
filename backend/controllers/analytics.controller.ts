import { analyticsService } from "../services/analytics.service.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import { generateExcel, generatePDF, normalizeAnalyticsData } from "../utils/generateFile.ts";

export const getItemCategoryAnalytics = async (req: any, res: any) => {
  try {
    const data = await analyticsService.getItemCategoryAnalytics(req.query);
    sendResponse(res, STATUS.OK, MSG.ANALYTICS.ITEM_ANALYTICS, data);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getUserAnalytics = async (req: any, res: any) => {
  try {
    const data = await analyticsService.getUserAnalytics(req.query);
    sendResponse(res, STATUS.OK, MSG.ANALYTICS.USER_ANALYTICS, data);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getOrderStats = async (req: any, res: any) => {
  try {
    const data = await analyticsService.getOrderStats(req.query);
    sendResponse(res, STATUS.OK, MSG.ANALYTICS.ORDER_ANALYTICS, data);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getRevenueAnalytics = async (req: any, res: any) => {
  try {
    const data = await analyticsService.getRevenueAnalytics(req.query);
    sendResponse(res, STATUS.OK, MSG.ANALYTICS.REVENUE_ANALYTICS, data);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const exportAnalytics = async (req: any, res: any) => {
  try {
    const { type } = req.params;
    const { range, format } = req.query;

    const rangeLabelMap: any = {
  today: "Today",
  "3d": "3 Days",
  "7d": "7 Days",
  "1m": "1 Month"
};

const rangeLabel = rangeLabelMap[range as string] || "";

    let data: any;

    switch (type) {
      case "items":
        data = await analyticsService.getItemCategoryAnalytics(req.query);
        break;
      case "users":
        data = await analyticsService.getUserAnalytics(req.query);
        break;
      case "orders":
        data = await analyticsService.getOrderStats(req.query);
        break;
      case "revenue":
        data = await analyticsService.getRevenueAnalytics(req.query);
        break;
      default:
        return res.status(400).json({ message: "Invalid analytics type" });
    }

    data = normalizeAnalyticsData(data);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "No data found" });
    }

    if (format === "excel") {
      return generateExcel(data, type, rangeLabel, res);
    }

    if (format === "pdf") {
      return generatePDF(data, type, rangeLabel, res);
    }

    return res.status(400).json({
      message: "Invalid format. Use ?format=pdf or ?format=excel",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
