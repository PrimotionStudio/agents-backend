import express, { Router } from "express";
import { isLoggedIn } from "../controllers/auth";
import { getAgent } from "../controllers/agent";

const router: Router = express.Router();

router.use(isLoggedIn);

router.get("/:agentId", getAgent);

export default router;
