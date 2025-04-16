import express, { Router } from "express";
import { isLoggedIn } from "../controllers/auth";
import { getAgentRatings, rateAgent } from "../controllers/agentRating";

const router: Router = express.Router();

router.use(isLoggedIn);

router.post("/rate", rateAgent);

router.get("/:agentId/ratings", getAgentRatings);

export default router;
