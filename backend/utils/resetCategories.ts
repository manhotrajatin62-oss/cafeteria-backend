import cron from "node-cron";
import Category from "../models/Category.ts";

export const startDailyReset = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      await Category.updateMany({}, { $set: { items: [] } });
      console.log("categories reset at midnight");
    },
    { timezone: "Asia/Kolkata" },
  );
};
