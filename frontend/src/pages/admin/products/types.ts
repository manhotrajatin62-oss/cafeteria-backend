export interface Product {
  id: number;
  name: string;
  status: "In Stock" | "Out of Stock";
  productId: string;
  quantity: number;
  price: number;
  unit: string;
  category: string;
  image: any;
}