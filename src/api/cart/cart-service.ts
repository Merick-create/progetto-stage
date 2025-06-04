import { Types } from "mongoose";
import { CartItem } from "./cart-entity";
import { CartItemModel } from "./cart-model";
import { GetById } from "../product/product-service";

export async function addToCart(data: CartItem): Promise<CartItem> {
    const existing = await CartItemModel.findOne({ product: data.product, user: data.user });

    const product = await GetById(new Types.ObjectId(data.product.toString()));
    if (!product) throw new Error('Prodotto non trovato');

    const currentQuantity = existing ? existing.quantity : 0;
    const desiredQuantity = currentQuantity + data.quantity;

    if (desiredQuantity > product.quantity) {
        throw new Error(`Quantità richiesta (${desiredQuantity}) superiore alla disponibilità (${product.quantity})`);
    }

    if (existing) {
        existing.quantity = desiredQuantity;
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
    const cartItem = await CartItemModel.findOne({ _id: new Types.ObjectId(id), user: userId });

    if (!cartItem) return null;

    const product = await GetById(new Types.ObjectId(cartItem.product.toString()));
    if (!product) throw new Error('Prodotto non trovato');

    if (data.quantity && data.quantity > product.quantity) {
        throw new Error(`Quantità richiesta (${data.quantity}) superiore alla disponibilità (${product.quantity})`);
    }

    if (data.quantity) cartItem.quantity = data.quantity;
    await cartItem.save();

    return cartItem.populate('product');
}

export async function removeFromCart(id: string, userId: string): Promise<CartItem | null> {
    return CartItemModel.findOneAndDelete({ _id: new Types.ObjectId(id), user: userId });
}
