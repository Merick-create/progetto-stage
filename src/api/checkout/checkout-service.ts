import { CheckoutModel } from "./checkout-model";
import { checkoutEntity, CheckoutItem } from "./checkout-entity";
import { CartItemModel } from "../cart/cart-model";
import { ProductModel } from "../product/product-model";
import { Types } from "mongoose";
import mongoose from 'mongoose';

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


export async function confirmCartCheckout(userId: Types.ObjectId): Promise<checkoutEntity> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Verifica se esiste già un checkout (potrebbe essere stato creato da Buy Now)
    const existingCheckout = await CheckoutModel.findOne({ userId }).session(session);
    
    if (existingCheckout) {
      // Se esiste, confermalo direttamente senza bisogno del carrello
      const checkoutItems = existingCheckout.obj;

      // Aggiorna le quantità dei prodotti
      for (const item of checkoutItems) {
        const product = await ProductModel.findById(item.productId).session(session);
        if (!product) throw new Error(`Prodotto non trovato: ${item.productId}`);
        if (product.quantity < item.quantity) throw new Error(`Quantità insufficiente per ${product.name}`);

        product.quantity -= item.quantity;
        await product.save({ session });
      }

      // Elimina il checkout dopo la conferma (se vuoi mantenerlo, salta questo passaggio)
      await CheckoutModel.findByIdAndDelete(existingCheckout._id).session(session);

      await session.commitTransaction();
      session.endSession();

      return existingCheckout.toObject({ virtuals: true });
    }

    // 2. Altrimenti, procedi con il normale flusso del carrello
    const cartItems = await CartItemModel.find({ user: userId }).session(session).lean();
    if (cartItems.length === 0) {
      throw new Error("Nessun prodotto nel checkout o nel carrello.");
    }

    const productIds = cartItems.map(item => item.product);
    const products = await ProductModel.find({ _id: { $in: productIds } }).session(session);

    const checkoutItems: CheckoutItem[] = [];

    for (const item of cartItems) {
      const product = products.find(p => p._id.toString() === item.product.toString());
      if (!product) throw new Error(`Prodotto non trovato: ${item.product}`);
      if (product.quantity < item.quantity) throw new Error(`Quantità insufficiente per ${product.name}`);

      product.quantity -= item.quantity;
      await product.save({ session });

      checkoutItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Elimina il carrello
    await CartItemModel.deleteMany({ user: userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    // Restituisci i dati del checkout (anche se non è stato salvato nel DB)
    return {
      userId,
      obj: checkoutItems,
    } as checkoutEntity;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}


export async function buyNowCheckout(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number): Promise<checkoutEntity> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await ProductModel.findById(productId).session(session);
    if (!product || product.quantity < quantity) {
      throw new Error("Prodotto non disponibile o quantità insufficiente");
    }

    // ✅ NON riduciamo ancora la quantità, lo farà confirmCartCheckout
    const checkoutItem: CheckoutItem = {
      productId: product._id,
      quantity,
      price: product.price,
    };

    // Elimina eventuali checkout precedenti
    await CheckoutModel.findOneAndDelete({ userId }).session(session);

    const checkout = new CheckoutModel({
      userId,
      obj: [checkoutItem],
    });

    await checkout.save({ session });
    await session.commitTransaction();
    session.endSession();

    return checkout.toObject({ virtuals: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
