export interface ShoppingRequest {
  id_shopping: number;
  product_name: string;
  producto_price: number;
  date_shopping: string;
  id_beneficiary: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface State {
  currentPage: number;
  totalPages: number;
  shoppings: ShoppingRequest[];
  totalShoppings: number;
}

export interface Shopping {
  id?: number;
  product_name: string;
  date_shopping: string | null;
  producto_price: number;
  id_beneficiary: number;
}
