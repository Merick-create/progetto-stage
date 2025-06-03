import { CheckoutModel } from "./checkout-model";
import { checkoutEntity } from "./checkout-entity";
import { CartItemModel } from "../cart/cart-model";
import { ProductModel } from "../product/product-model";
import { Types } from "mongoose";

export async function getCheckOut(userId: Types.ObjectId): Promise<checkoutEntity | null> {
  const checkout = await CheckoutModel.findOne({ userId });
  return checkout ? checkout.toObject({ virtuals: true }) : null;
}



export async function createCheckout(userId: Types.ObjectId): Promise<checkoutEntity | null> {
  const cartItems = await CartItemModel.find({
    user: new Types.ObjectId(userId)
  }).lean();

  if (cartItems.length === 0) {
    console.warn("Carrello vuoto per utente", userId);
    return null;
  }

  const productIds = cartItems.map(item => item.product);

  const products = await ProductModel.find({
    _id: { $in: productIds }
  }).lean();

  const checkoutItems = cartItems.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    if (!product) {
      throw new Error(`Prodotto non trovato: ${item.product}`);
    }

    return {
      productId: item.product,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const newCheckout = new CheckoutModel({
    userId,
    obj: checkoutItems,
  });

  await newCheckout.save();

  return newCheckout.toObject({ virtuals: true });
}
