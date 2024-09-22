export interface SignState {
  isOpen: boolean;
  content: string;
  isLogin: boolean;
  token?: string;
  passwordResetStatus?: string;
  message?: string;
  error?: string;
}

export interface CartItem {
  dishId: number;
  dishName: string;
  quantity: number;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  orderType: string;
}

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
}
