import express, { Router } from "express";
import { changePassword, me, updateUser } from "../controllers/user";
import { isLoggedIn } from "../controllers/auth";

const router: Router = express.Router();

router.use(isLoggedIn);

router.get("/me", me);

router.patch("/update", updateUser);
router.patch("/changePassword", changePassword);

export default router;
