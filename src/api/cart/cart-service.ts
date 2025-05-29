import { Types } from "mongoose";
import { CartItem } from "./cart-entity";
import { CartItemModel } from "./cart-model";

export async function addToCart(data: CartItem): Promise<CartItem> {
    const existing = await CartItemModel.findOne({ product: data.product, user: data.user });
    if (!!existing) {
        existing.quantity += data.quantity;
        await existing.save();
        return existing.populate('product');
    }
    const newItem = await CartItemModel.create(data);
    await newItem.populate('product');
    return newItem;
}


export async function getCart(userId: string): Promise<CartItem[]> {
    return CartItemModel.find({ user: userId }).populate('product');
}

export async function update(id: string, data: Partial<CartItem>, userId: string): Promise<CartItem | null> {
    const updated = await CartItemModel.findOneAndUpdate({ _id: new Types.ObjectId(id), user: userId }, data, {new: true}).populate('product');

    return updated;
}

export async function removeFromCart(id: string, userId: string): Promise<CartItem | null> {
    return CartItemModel.findOneAndDelete({ _id: new Types.ObjectId(id), user: userId });
}