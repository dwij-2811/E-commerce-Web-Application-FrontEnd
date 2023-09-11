export interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  spiciness: number;
  image: string; // Assuming the image will be a URL or image path
  customizations: number[];
  isInStock: boolean;
}

export interface AddOn {
  id: number;
  name: string;
  price: number;
  isInStock: boolean;
}

export interface Categories {
  id: number;
  name: string;
  products: number[];
}

export interface Customizations {
  id: number;
  name: string;
  addOns: number[];
  required: boolean;
  minimum: number;
  maximum: number;
  multiple: number;
  isInStock: boolean;
}

export interface Order {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  itemTotal: string;
  paymentMethod: string;
  paymentId: string;
  orderedOn: string;
  orderStatus: string;
}

export interface OrderDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  billingAddress: string,
  city: string,
  province: string,
  postalCode: string,
  phone: string,
  orderedOn: string;
  orderStatus: string;
  estimatedWaitTime: number;
  items: OrderDetailItem[];
  payment: OrderPayment;
}

export interface OrderDetailItem {
  itemOrderd: string;
  itemTotal: number;
  itemQuantity: number;
  itemSpiciness: number;
  addOns: OrderDetailAddOns[];
}

export interface OrderDetailAddOns {
  name: string;
  price: number;
}
export interface OrderPayment {
  paymentMethod: string;
  orderTotal: number;
  subTotal: number;
  tax: number;
  tip: number;
  token: string;
  paymentId: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  cartTotal: number;
}

export interface CartItem extends Item {
  cartItemId: string;
  itemTotal: number;
  addOns: AddOn[];
}

export interface Payments {
  paymentMethod: string;
  orderTotal: number;
  subTotal: number;
  tax: number;
  tip: number;
  token: string;
}

export interface Card {
  cardName: string;
  cardNumber: number;
  cardExpiry: number;
  cardCVV: number;
}

export interface KitchenOrderDetail {
  orderId: string;
  email: string;
  firstName: string;
  lastName: string;
  billingAddress: string,
  city: string,
  province: string,
  postalCode: string,
  phone: string,
  orderedOn: string;
  cart: Cart;
  userId: number;
  payment: OrderPayment;
  orderStatus: string;
  estimatedWaitTime: number;
}