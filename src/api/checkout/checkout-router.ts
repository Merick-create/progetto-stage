import { Router } from "express";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { bill, confirmOrder, createBill, deleteBill } from "./checkout-controller";

const router = Router();

router.use(isAuthenticated);
router.get('/',bill)
router.post('/',createBill)
router.delete('/',deleteBill)
router.post('/confirm', confirmOrder);


export default router;