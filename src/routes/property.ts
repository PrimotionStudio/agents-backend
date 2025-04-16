import express, { Router } from "express";
import {
	createProperty,
	getAllProperties,
	getAProperty,
} from "../controllers/property";
import { isLoggedIn } from "../controllers/auth";

const router: Router = express.Router();

router.get("/", getAllProperties);
router.get("/:propertyId", getAProperty);

// router.use(isLoggedIn);
router.post("/create", createProperty);

export default router;
