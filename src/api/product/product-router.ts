import {Router} from 'express';
import { getlist,add,getByname,get, updateQuantity,getByCategory, getFiltered } from '../product/product-controller';
import { isAuthenticated } from '../../lib/auth/auth.middleware';
import reviewsRouter from '../reviews/reviews-router';
const router=Router();


router.use(isAuthenticated);
router.get('/lista',getlist);
router.get('/getByname',getByname);
router.get('/get/:id',get);
router.post('/add',add);
router.patch('/update-quantity', updateQuantity);
router.get('/products/:categoryId', getByCategory);
router.use('/:id/reviews', isAuthenticated, reviewsRouter);
router.use("/products/filtered",getFiltered);
export default router;