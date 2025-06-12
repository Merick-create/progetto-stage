import { Router } from "express";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { me, filtered, updateMe } from "./user.controller"; 

const router = Router();


router.get('/me', isAuthenticated, me );


router.get("/allFiltered", isAuthenticated, filtered);

router.patch('/me', isAuthenticated, updateMe); 

export default router;