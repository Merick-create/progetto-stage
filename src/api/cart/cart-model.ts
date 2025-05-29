import { model, Schema } from "mongoose";
import { CartEntity } from "./cart-entity";

const cartSchema= new Schema<CartEntity>({
    product:String,
    quantity:Number,
    userId:String,
})

cartSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        return ret;
    }
});

export const CartModel=model<CartEntity>('CartModel',cartSchema);