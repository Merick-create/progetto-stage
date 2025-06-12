import { CheckoutModel } from "./checkout-model";
import { checkoutEntity, CheckoutItem } from "./checkout-entity";
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

export async function destroyCheckout(userId: Types.ObjectId): Promise<checkoutEntity | null> {
  const deletedCheckout = await CheckoutModel.findOneAndDelete({ userId });
  return deletedCheckout ? deletedCheckout.toObject({ virtuals: true }) : null;
}


export async function confirmCheckout(userId: Types.ObjectId): Promise<checkoutEntity> {
  
  const existingCheckout = await CheckoutModel.findOne({ userId });

  if (existingCheckout) {

    return existingCheckout.toObject({ virtuals: true });
  }


  const cartItems = await CartItemModel.find({ user: userId }).lean();
  if (cartItems.length === 0) throw new Error("Carrello vuoto");

  const productIds = cartItems.map(item => item.product);
  const products = await ProductModel.find({ _id: { $in: productIds } });

  const checkoutItems: CheckoutItem[] = [];

  for (const item of cartItems) {
    const product = products.find(p => p._id.toString() === item.product.toString());
    if (!product) throw new Error(`Prodotto non trovato: ${item.product}`);
    if (product.quantity < item.quantity)
      throw new Error(`Quantità insufficiente per il prodotto ${product.name}`);

    product.quantity -= item.quantity;
    await product.save();

    checkoutItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const newCheckout = new CheckoutModel({
    userId,
    obj: checkoutItems,
  });

  await newCheckout.save();
  await CartItemModel.deleteMany({ user: userId });

  return newCheckout.toObject({ virtuals: true });
}



export async function buyNowCheckout(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number): Promise<checkoutEntity> {
  const product = await ProductModel.findById(productId);
  if (!product) throw new Error('Prodotto non trovato');

  if (product.quantity < quantity) {
    throw new Error(`Quantità insufficiente per il prodotto ${product.name}`);
  }

  product.quantity -= quantity;
  await product.save();

  const checkoutItem = {
    productId: product._id,
    quantity,
    price: product.price,
  };

  await CheckoutModel.findOneAndDelete({ userId });

  const checkout = new CheckoutModel({
    userId,
    obj: [checkoutItem]
  });

  await checkout.save();
  return checkout.toObject({ virtuals: true });
}
