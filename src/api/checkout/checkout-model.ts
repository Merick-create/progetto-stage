import { model, Schema, Types } from "mongoose";
import { checkoutEntity } from "./checkout-entity";

const checkoutSchema = new Schema<checkoutEntity>({
  userId: { type: String, required: true },
  obj: [{
    productId: { type: Types.ObjectId, required: true, ref: 'Products' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

checkoutSchema.virtual("totalPrice").get(function (this: checkoutEntity) {
  return this.obj.reduce((sum, item) => sum + item.price * item.quantity, 0);
});


export const CheckoutModel = model("Checkout", checkoutSchema);
