"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const agentRating_1 = require("../controllers/agentRating");
const router = express_1.default.Router();
router.use(auth_1.isLoggedIn);
router.post("/rate", agentRating_1.rateAgent);
router.get("/:agentId/ratings", agentRating_1.getAgentRatings);
exports.default = router;
