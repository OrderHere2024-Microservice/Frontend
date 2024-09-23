export interface Booking {
  bookingId: number;
  userId: number;
  tableNumber: number;
  reservationTime: string;
  status: string;
  restaurantId: number;
  createdTime: string;
  updatedTime: string;
}

export interface Category {
  categoryId: number;
  restaurantId: number;
  categoryName: string;
  createdTime: string;
  updatedTime: string;
}

export interface Dish {
  dishId: number;
  dishName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  restaurantId: number;
  availability: boolean;
  createdTime: string;
  updatedTime: string;
  categoryId?: number;
  linkIngredientDishes?: LinkIngredientDish[];
  ratings?: Rating[];
  linkOrderDishes?: LinkOrderDish[];
}

export interface Ingredient {
  ingredientId: number;
  name: string;
  unit: string;
  createdTime: string;
  updatedTime: string;
}

export interface LinkIngredientDish {
  linkIngredientDishId: number;
  dishId: number;
  ingredientId: number;
  quantityValue: number;
  quantityUnit: string;
  createdTime: string;
  updatedTime: string;
}

export interface LinkOrderDish {
  linkOrderDishId: number;
  orderId: number;
  dishId: number;
  dishQuantity: number;
  createdTime: string;
  updatedTime: string;
}

export interface OpeningHours {
  id: number;
  restaurantId: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  updatedTime: string;
}

export interface Order {
  orderId: number;
  userId: number;
  restaurantId: number;
  orderStatus: string;
  orderType: string;
  tableNumber?: number;
  numberOfPeople?: number;
  pickupTime?: string;
  address?: string;
  totalPrice: number;
  discount: number;
  note?: string;
  phone?: string;
  createdTime: string;
  updatedTime: string;
}

export interface Rating {
  ratingId: number;
  userId: number;
  dishId: number;
  ratingValue: number;
  comments?: string;
  createdTime?: string;
  updatedTime?: string;
}

export interface Restaurant {
  restaurantId: number;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  abn: string;
  ownerName: string;
  ownerMobile: string;
  ownerAddress: string;
  ownerEmail: string;
  ownerCrn?: string;
  averageRating?: number;
  createdTime: string;
  updatedTime: string;
  openingHours?: OpeningHours[];
}

export interface User {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  avatarUrl?: string;
  point?: number;
  userRole: string;
  createdTime: string;
  updatedTime: string;
  googleOpenId?: string;
  facebookOpenId?: string;
}

export interface UserAddress {
  userAddressId: number;
  userId: number;
  address: string;
  isDefault: boolean;
  createdTime: string;
  updatedTime: string;
}
