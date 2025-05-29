import {Router} from 'express';
import { getlist,add,getByname,get } from '../product/product-controller';

const router=Router();

router.get('/lista',getlist);
router.get('/getByname',getByname);
router.get('/get',get);
router.post('/add',add);


export default router;