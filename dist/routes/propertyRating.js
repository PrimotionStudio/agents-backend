"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const propertyRating_1 = require("../controllers/propertyRating");
const router = express_1.default.Router();
router.use(auth_1.isLoggedIn);
router.post("/rate", propertyRating_1.rateProperty);
router.get("/:propertyId/ratings", propertyRating_1.getPropertyRatings);
exports.default = router;
