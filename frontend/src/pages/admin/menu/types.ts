export interface Category {
  id: number;
  name: string;
  startTime: string; 
  endTime: string;   
}

export interface MenuItem {
  rowId: number;     
  productId: number; 
  name: string;
  status: string;
  productCode: string;
  quantity: number;
  price: number;
}