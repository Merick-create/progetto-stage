import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import productRouter from "./product/product-router";

const router = Router();
router.use('/users', userRouter);
router.use(authRouter);
router.use(productRouter);
export default router;