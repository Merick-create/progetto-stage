import { Router } from "express";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { bill, createBill } from "./checkout-controller";

const router = Router();

router.use(isAuthenticated);
router.get('/',bill)
router.post('/',createBill)

export default router;