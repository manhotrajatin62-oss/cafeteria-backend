export type OrderStatus = "pending" | "confirmed" | "rejected";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  table: number;
  guests: number;
  user: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  items: OrderItem[];
}