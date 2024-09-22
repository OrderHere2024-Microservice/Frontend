export interface SignState {
  isOpen: boolean;
  content: 'login' | 'register' | 'forgetpassword';
  isLogin: boolean;
  token?: string;
  passwordResetStatus?: 'success' | 'error';
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
