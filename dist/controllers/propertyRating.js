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
exports.getPropertyRatings = exports.rateProperty = void 0;
const PropertyRating_1 = __importDefault(require("../models/PropertyRating"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        res.status(400).json({
            message: "No request body found",
        });
        return;
    }
    try {
        const { property, user, rating, review } = req.body;
        if (!property || !user || !rating || !review) {
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
        const hasRatedBefore = yield PropertyRating_1.default.findOne({
            property,
            user,
        });
        if (hasRatedBefore) {
            res.status(400).json({
                message: "You cannot rate the same property twice",
            });
            return;
        }
        const propertyRating = yield PropertyRating_1.default.create({
            property,
            user,
            rating,
            review,
        });
        if (!propertyRating) {
            res.status(400).json({
                message: "An error occured",
            });
            return;
        }
        res.status(201).json({
            message: "Property rated",
            propertyRating,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occured",
        });
    }
});
exports.rateProperty = rateProperty;
const getPropertyRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { propertyId } = req.params;
        if (!propertyId) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const propertyRatings = yield PropertyRating_1.default.find({
            property: propertyId,
        })
            .populate("property")
            .populate("user", "-password");
        res.status(200).json({
            message: "Property ratings found",
            propertyRatings,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occured",
        });
    }
});
exports.getPropertyRatings = getPropertyRatings;
