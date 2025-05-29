import { Router } from "express";
import { add, showCart, remove, updateQuantity } from "./cart-controller";
import { validate } from "../../lib/validation-middleware";
import { AddCartDTO, UpdateCartQuantityDTO } from "./cart-DTO";
import { isAuthenticated } from "../../lib/auth/auth.middleware";

const router = Router();

router.use(isAuthenticated);
router.post('/', validate(AddCartDTO), add);
router.patch('/:id', validate(UpdateCartQuantityDTO), updateQuantity);
router.get('/', showCart);
router.delete('/:id', remove);

export default router;