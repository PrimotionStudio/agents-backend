"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_1 = require("../controllers/property");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.get("/", property_1.getAllProperties);
router.get("/:propertyId", property_1.getAProperty);
router.use(auth_1.isLoggedIn);
router.post("/create", property_1.createProperty);
exports.default = router;
