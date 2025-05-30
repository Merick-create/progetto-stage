import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import productRouter from "./product/product-router";
import cartRouter from "./cart/cart-router";
import checkoutRouter from "./checkout/checkout-router";
import reviwsRouter from "./reviews/reviews-router";
import { isAuthenticated } from "../lib/auth/auth.middleware";

const router = Router();
router.use('/users', userRouter, isAuthenticated);
router.use(authRouter);
router.use('/product',productRouter,isAuthenticated);
router.use('/cart',cartRouter,isAuthenticated)
router.use('/checkout', checkoutRouter, isAuthenticated);
router.use('/reviews', reviwsRouter, isAuthenticated);
export default router;