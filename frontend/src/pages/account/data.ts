import type { OrderRecord, WalletRecord } from "./AccountPage";

export const ORDER_DATA: OrderRecord[] = [
  {
    id: 1,
    date: "01-14-2026",
    orderId: "696abc123",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "confirmed",
    totalAmount: 30,
  },
  {
    id: 2,
    date: "06-12-2025",
    orderId: "684def456",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "confirmed",
    totalAmount: 20,
  },
  {
    id: 3,
    date: "05-14-2025",
    orderId: "682ghi789",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "confirmed",
    totalAmount: 10,
  },
  {
    id: 4,
    date: "04-30-2025",
    orderId: "681jkl012",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "pending",
    totalAmount: 40,
  },
  {
    id: 5,
    date: "04-22-2025",
    orderId: "680mno345",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "confirmed",
    totalAmount: 30,
  },
  {
    id: 6,
    date: "09-27-2024",
    orderId: "66fpqr678",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "cancelled",
    totalAmount: 60,
  },
  {
    id: 7,
    date: "09-02-2024",
    orderId: "66stu901",
    employeeId: "3899",
    employeeName: "Akashdeep Singh",
    status: "confirmed",
    totalAmount: 60,
  },
];

export const WALLET_DATA: WalletRecord[] = [
  {
    id: 1,
    payment: 175,
    walletBalance: 115,
    date: "04-17-2025",
    time: "09:15:07 am",
  },
  {
    id: 2,
    payment: 60,
    walletBalance: 0,
    date: "09-02-2024",
    time: "01:32:33 pm",
  },
];
