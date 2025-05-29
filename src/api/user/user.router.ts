import { Router } from "express";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { me,filtered } from "./user.controller";

const router = Router();

router.get('/me', isAuthenticated, me );
router.get("/allFiltered",isAuthenticated, filtered)
export default router;