"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.use(auth_1.isLoggedIn);
router.get("/me", user_1.me);
router.patch("/update", user_1.updateUser);
router.patch("/changePassword", user_1.changePassword);
exports.default = router;
