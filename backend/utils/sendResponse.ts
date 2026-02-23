export const sendResponse = (
  res: any,
  statusCode: number,
  message: any,
  data: any = null,
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};
