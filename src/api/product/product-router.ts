import {Router} from 'express';
import { getlist,add,getByname,get } from '../product/product-controller';
import { isAuthenticated } from '../../lib/auth/auth.middleware';

const router=Router();


router.use(isAuthenticated);
router.get('/lista',getlist);
router.get('/getByname',getByname);
router.get('/get/:id',get);
router.post('/add',add);


export default router;