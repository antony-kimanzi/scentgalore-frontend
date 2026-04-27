/* eslint-disable @typescript-eslint/no-explicit-any */
export type IdParams = number;

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface UpdateUserData {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface User {
  id: number;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  role?: string;
  // Google OAuth properties
  googleId?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
}

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  imageUrl: string;
  tone: string;
  stock: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  product: Product;
}

export interface ProductsResponse {
  products: Product[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt?: string;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number | null;
  createdAt?: string;
  updatedAt?: string;
  items: CartItem[];
}

export interface CartResponse {
  cart: Cart;
  total: number;
}

export interface CartItemResponse {
  item: CartItem;
}

export interface OrderData {
  status?: string;
  contact: string;
  paymentMethod: string;
  shippingMethod: string;
  totalAmount: number;
  isPaid: boolean;
  shipping?: ShippingData;
  billing?: BillingData;
}
export interface UpdateOrderData {
  status: string;
  paymentMethod?: string;
  shippingMethod?: string;
  totalAmount?: number;
  isPaid?: boolean;
}

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phoneNumber: string;
  apartment?: string;
  postalCode?: string;
}

export interface BillingData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface BillingDetails extends BillingData {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingDetails extends ShippingData {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt?: string;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  contact: string;
  totalAmount: number;
  status: string;
  isPaid: boolean;
  paymentMethod: string;
  shippingMethod: string;
  createdAt?: string;
  updatedAt?: string;
  items: Array<{
    id: number;
    quantity: number;
    price: string;
    product?: {
      id: number;
      name: string;
      imageUrl?: string;
      price: string;
    };
  }>;
  billing?: BillingDetails;
  shipping?: ShippingDetails;
}

export interface OrderResponse {
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  orderId?: number;
  order?: Order;
  cartCleared?: boolean;
}

export interface LogoutResponse {
  success: boolean;
}

export type DeleteResponse = LogoutResponse;

export interface InputProps {
  id: string;
  value: string | number;
  label: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}

export interface OrderSummaryProps {
  billingData: BillingData;
  shippingCost: number;
  buttonText: string;
  handleCompleteCheckoutBtn: (
    e: React.MouseEvent<HTMLButtonElement>,
    paymentOrder: PaymentOrder,
    calculatedTotal: number,
  ) => Promise<void>;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add this
  error: string | null;
  checkAuth: (force?: boolean) => Promise<UserResponse>;
  silentCheckAuth: () => Promise<boolean>;
  login: (
    credentials: LoginRequest,
  ) => Promise<{ user: User; isAdmin: boolean }>;
  googleLogin: (
    tokenData: GoogleLoginRequest,
  ) => Promise<{ user: User; isAdmin: boolean }>;
  register: (
    userData: RegisterRequest,
  ) => Promise<{ user: User; isAdmin: boolean }>;
  logout: () => Promise<void>;
  updateAccount: (updatedUser: UpdateUserData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  cartTotal: number;
  isLoading: boolean;
  success: boolean;
  isAddingToCart: boolean; // ADD THIS
  addingProductId: number | null; // ADD THIS
  error: string | null;
  fetchCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  addCartItem: (id: IdParams) => Promise<boolean>; // Updated return type
  addItemQuantity: (id: IdParams) => Promise<void>;
  subtractItemQuantity: (id: IdParams) => Promise<void>;
  deleteCartItem: (id: IdParams) => Promise<void>;
  setDeleteSuccess: () => void;
  deleteCart: () => Promise<void>;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestID?: string;
  orderId?: number;
  data?: any;
}

export interface PaymentOrder {
  phone: string;
  amount: number;
  orderId?: number;
}

// utils/types.ts - Add these types
export interface GoogleLoginRequest {
  token: string;
}

export interface CallbackResponse {
  ResultCode: number;
  ResultDesc: string;
}

export interface QueryResponse {
  success: boolean;
  isPaid: boolean;
  message?: string;
  resultCode?: string;
  resultDesc?: string;
  mpesaReceipt?: string;
}
