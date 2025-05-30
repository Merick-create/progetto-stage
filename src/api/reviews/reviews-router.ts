import { Router } from "express";
import { getReviewsList,getReview,patchReviewHandler,deleteReviewHandler,addReview } from "./reviews-controller";

const router =Router();

router.get('/list',getReviewsList);
router.get('/get/:id',getReview);
router.post('/add',addReview);
router.patch('/update',patchReviewHandler);
router.delete('/delete',deleteReviewHandler);

export default router;