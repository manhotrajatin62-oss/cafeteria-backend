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
  unit: string;
  category: string;
}

export interface Customer extends BaseRecord {
  orders: number;
  spent: number;
  gender: string;
  address: string;
}

export interface FieldConfig<T extends BaseRecord> {
  key: keyof Omit<T, "id" | "image">;
  label: string;
  placeholder: string;
  type: "text" | "number" | "select";
  options?: string[];
  required?: boolean,
  validate?: (value: string) => string | undefined | null;
}
