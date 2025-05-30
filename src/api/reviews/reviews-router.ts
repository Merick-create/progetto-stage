import { Router } from 'express';
import {getReviewsList,getReview,patchReviewHandler,deleteReviewHandler,addReview} from './reviews-controller';

const router = Router({ mergeParams: true });

router.get('/list', getReviewsList);
router.get('/get/:id', getReview);
router.post('/add', addReview);
router.patch('/update/:id', patchReviewHandler);
router.delete('/delete/:id', deleteReviewHandler);

export default router;
