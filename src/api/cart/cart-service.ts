import { CartEntity } from "./cart-entity";
import {CartModel} from "./cart-model";

export async function addToCart(data: CartEntity): Promise<CartEntity> {
    const existing = await CartModel.findOne({ product: data.product, user: data.userId });
    if (!!existing) {
        existing.quantity += data.quantity;
        await existing.save();
        return existing.populate('product');
    }
    const newItem = await CartModel.create(data);
    await newItem.populate('product');
    return newItem;
}

export async function getCart(userId: string): Promise<CartEntity[]> {
    return CartModel.find({ user: userId }).populate('product');
}

export async function update(id: string, data: Partial<CartEntity>, userId: string): Promise<CartEntity | null> {
    const updated = await CartModel.findOneAndUpdate({ _id: id, user: userId }, data, {new: true}).populate('product');

    return updated;
}

export async function removeFromCart(id: string, userId: string): Promise<CartEntity | null> {
    return CartModel.findOneAndDelete({ _id: id, user: userId });
}