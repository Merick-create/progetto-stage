import { model, Schema,Types } from "mongoose";
import { CartItem } from "./cart-entity";

const cartItemSchema = new Schema<CartItem>({
    quantity: Number,
    product: { type: Types.ObjectId, ref: 'Products' },
    user: { type: Schema.Types.ObjectId, ref: 'User' } 
});

cartItemSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        return ret;
    }
});

export const CartItemModel = model<CartItem>('CartItem', cartItemSchema);