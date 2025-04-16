import express, { Router } from "express";
import { register, login, me } from "../controllers/auth";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", me);
export default router;
