export const getDateFilter = (range: string) => {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "3d":
      startDate.setDate(now.getDate() - 3);
      break;
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1m":
      startDate.setMonth(now.getMonth() - 1);
      break;
    default:
      throw new Error("Invalid range");
  }

  return { createdAt: { $gte: startDate } };
};
