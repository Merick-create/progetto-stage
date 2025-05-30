import {Router} from 'express';
import { getListCategory,addCategory,getCategory } from './category-controller';

const router=Router();

router.get('/categories',getListCategory);
router.get('/category/:id',getCategory);
router.post('/addcategory',addCategory);

export default router;