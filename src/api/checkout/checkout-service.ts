import { CheckoutModel } from "./checkout-model";
import { checkoutEntity } from "./checkout-entity";
import { CartItemModel } from "../cart/cart-model";
import { ProductModel } from "../product/product-model";

export async function getCheckOut(userId: string): Promise<checkoutEntity| null> {
    return await CheckoutModel.findOne({ userId }).lean({ virtuals: true });
}


export async function createCheckout(userId: string): Promise<checkoutEntity | null> {
  // 1. Get all cart items for the user
  const cartItems = await CartItemModel.find({ userId }).lean();

  if (cartItems.length === 0) {
    return null; // no items in cart
  }

  // 2. Get unique productIds from cart
  const productIds = cartItems.map(item => item.product);

  // 3. Fetch prices from ProductModel
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();

  // 4. Build checkout obj[]
  const checkoutItems = cartItems.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    return {
      productId: item.product,
      quantity: item.quantity,
      price: product.price,
    };
  });

  // 5. Save checkout
  const newCheckout = new CheckoutModel({
    userId,
    obj: checkoutItems,
  });

  await newCheckout.save();

  // 6. Return plain object with virtuals
  return newCheckout.toObject({ virtuals: true });
}
