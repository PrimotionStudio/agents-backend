import express, { Router } from "express";
import { isLoggedIn } from "../controllers/auth";
import {
	getPropertyRatings,
	rateProperty,
} from "../controllers/propertyRating";

const router: Router = express.Router();

router.use(isLoggedIn);

router.post("/rate", rateProperty);

router.get("/:propertyId/ratings", getPropertyRatings);

export default router;
