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
exports.getAgentRatings = exports.rateAgent = void 0;
const AgentRating_1 = __importDefault(require("../models/AgentRating"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rateAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        res.status(400).json({
            message: "No request body found",
        });
        return;
    }
    try {
        const { agent, user, rating, review } = req.body;
        if (!agent || !user || !rating || !review) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized - No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(400).json({
                message: "Your login session has expired",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded._id !== user) {
            res.status(403).json({
                message: "Your are not permmited to perform this action",
            });
            return;
        }
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                message: "Ratings must be with 1 to 5",
            });
            return;
        }
        // existing rating for same agent and user
        const hasRatedBefore = yield AgentRating_1.default.findOne({ agent, user });
        if (hasRatedBefore) {
            res.status(400).json({
                message: "You cannot rate the same agent twice",
            });
            return;
        }
        const agentRating = yield AgentRating_1.default.create({
            agent,
            user,
            rating,
            review,
        });
        if (!agentRating) {
            res.status(400).json({
                message: "An error occured",
            });
            return;
        }
        res.status(201).json({
            message: "Agent rated",
            agentRating,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occured",
        });
    }
});
exports.rateAgent = rateAgent;
const getAgentRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId } = req.params;
        if (!agentId) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const agentRatings = yield AgentRating_1.default.find({
            agent: agentId,
        })
            .populate("agent", "-password")
            .populate("user", "-password");
        res.status(200).json({
            message: "Agent ratings found",
            agentRatings,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occured",
        });
    }
});
exports.getAgentRatings = getAgentRatings;
