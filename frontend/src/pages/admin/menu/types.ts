export interface Category {
  _id: string;
  name: string;
  startTime: string; 
  endTime: string;   
}

export interface MenuItem {
  rowId: number;     
  productId: number | string; 
  name: string;
  status: string;
  quantity: number;
  price: number;
}