"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgent = void 0;
const User_1 = __importDefault(require("../models/User"));
const AgentRating_1 = __importDefault(require("../models/AgentRating"));
const getAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ") ||
            !authHeader.split(" ")[1]) {
            res.status(401).json({ message: "Unauthorized - No token provided" });
            return;
        }
        const { agentId } = req.params;
        const agent = yield User_1.default.findOne({ _id: agentId, role: "agent" }).select("-password");
        if (!agent) {
            res.status(404).json({
                message: "Agent not found",
            });
            return;
        }
        const agentRatings = yield AgentRating_1.default.find({
            agent: agentId,
        });
        const ratingNumber = agentRatings.length;
        const rating = ratingNumber == 0
            ? 0
            : (agentRatings.reduce((totalRating, aRating) => {
                return totalRating + aRating.rating;
            }, 0) / ratingNumber).toFixed();
        res.status(200).json({
            message: "Agent fetched successfully",
            agent: Object.assign(Object.assign({}, agent.toObject()), { rating,
                ratingNumber }),
        });
    }
    catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getAgent = getAgent;
