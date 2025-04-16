"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const agent_1 = require("../controllers/agent");
const router = express_1.default.Router();
router.use(auth_1.isLoggedIn);
router.get("/:agentId", agent_1.getAgent);
exports.default = router;
