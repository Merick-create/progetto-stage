import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import productRouter from "./product/product-router";
import cartRouter from "./cart/cart-router";
import checkoutRouter from "./checkout/checkout-router";
import reviwsRouter from "./reviews/reviews-router";
import { isAuthenticated } from "../lib/auth/auth.middleware";
import CategoryRouter from './categories/category-router';

const router = Router();
router.use('/users', userRouter, isAuthenticated);
router.use(authRouter);
router.use('/product',productRouter,isAuthenticated);
router.use('/cart',cartRouter,isAuthenticated)
<<<<<<< HEAD
router.use('/checkout', checkoutRouter, isAuthenticated);
router.use('/reviews', reviwsRouter, isAuthenticated);
=======
router.use('category',CategoryRouter,isAuthenticated);
>>>>>>> ec43ae9df60c0be7f0e14a78e7e3fdbea75a8955
export default router;