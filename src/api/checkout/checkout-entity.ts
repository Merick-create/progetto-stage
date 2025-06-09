import { Types } from "mongoose";

export type CheckoutItem = {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
};

export type checkoutEntity = {
  userId: Types.ObjectId;
  obj: CheckoutItem[];
};
