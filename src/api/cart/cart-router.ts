import { Router } from "express";
import { add, list, remove, updateQuantity } from "./cart-controller";
import { validate } from "../../lib/validation-middleware";
import { AddCartItemDTO, UpdateCartQuantityDTO } from "./cart-DTO";
import { isAuthenticated } from "../../lib/auth/auth.middleware";

const router = Router();

router.use(isAuthenticated);
router.post('/', validate(AddCartItemDTO), add);
router.patch('/:id', validate(UpdateCartQuantityDTO), updateQuantity);
router.get('/', list);
router.delete('/:id', remove);

export default router;