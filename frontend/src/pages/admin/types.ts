export interface BaseRecord {
  id: number;
  name: string;
  image: string;
}

export interface Product extends BaseRecord {
  status: "In Stock" | "Out of Stock";
  productId: string;
  quantity: number;
  price: number;
  _id: number
}

export interface Customer extends BaseRecord {
  employeeId: string;
  email: string;
  pendingBill: number;
  wallet: number;
  gender: string;
  address: string;
  orders?: number;
  spent?: number;
}

export interface FieldConfig<T extends BaseRecord> {
  key: keyof Omit<T, "id" | "image">;
  label: string;
  placeholder: string;
  type: "text" | "number" | "select";
  options?: string[];
  required?: boolean;
  validate?: (value: string, formState?: Record<string, string>) => string | undefined;
}

export type View = "table" | "add" | "edit";

export interface WalletRecord {
  id: number;
  employeeName: string;
  payment: number;
  walletBalance: number;
  date: string;
  time: string;
}