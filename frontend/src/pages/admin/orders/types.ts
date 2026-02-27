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
  customer: string;
  payment: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}