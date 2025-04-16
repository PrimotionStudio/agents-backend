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
exports.getAProperty = exports.getAllProperties = exports.createProperty = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const User_1 = __importDefault(require("../models/User"));
const PropertyRating_1 = __importDefault(require("../models/PropertyRating"));
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            res.status(400).json({
                message: "No request body found",
            });
            return;
        }
        const { houseName, houseDescription, category, location, mainImage, otherMedia, startingPricePerYear, agent, } = req.body;
        if (!houseName ||
            !houseDescription ||
            !category ||
            !location ||
            !mainImage ||
            !startingPricePerYear ||
            !agent) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        // Check if the agent exists
        const agentExists = yield User_1.default.findOne({ _id: agent, role: "agent" });
        if (!agentExists) {
            res.status(400).json({
                message: "Agent does not exist",
            });
            return;
        }
        const property = yield Property_1.default.create({
            houseName,
            houseDescription,
            category,
            location,
            mainImage,
            otherMedia: otherMedia || [],
            startingPricePerYear,
            agent,
        });
        if (!property) {
            res.status(500).json({
                message: "Failed to create property",
            });
            return;
        }
        res.status(201).json({
            message: "Property created successfully",
            property: property.toObject(),
        });
    }
    catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.createProperty = createProperty;
const getAllProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        let properties;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ") ||
            !authHeader.split(" ")[1])
            properties = yield Property_1.default.find();
        else
            properties = yield Property_1.default.find().populate("agent");
        const propertiesWithRatings = yield Promise.all(properties.map((prop) => __awaiter(void 0, void 0, void 0, function* () {
            const propertyRatings = yield PropertyRating_1.default.find({
                property: prop._id,
            });
            const ratingNumber = propertyRatings.length;
            const rating = ratingNumber == 0
                ? 0
                : (propertyRatings.reduce((totalRating, pRating) => {
                    return totalRating + pRating.rating;
                }, 0) / ratingNumber).toFixed();
            return Object.assign(Object.assign({}, prop.toObject()), { rating,
                ratingNumber });
        })));
        res.status(200).json({
            message: "Properties fetched successfully",
            properties: propertiesWithRatings,
        });
    }
    catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getAllProperties = getAllProperties;
const getAProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { propertyId } = req.params;
        const authHeader = req.headers.authorization;
        let property;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ") ||
            !authHeader.split(" ")[1])
            property = yield Property_1.default.findById(propertyId);
        else
            property = yield Property_1.default.findById(propertyId).populate("agent");
        if (!property) {
            res.status(404).json({
                message: "Property not found",
            });
            return;
        }
        const propertyRatings = yield PropertyRating_1.default.find({
            property: propertyId,
        });
        const ratingNumber = propertyRatings.length;
        const rating = ratingNumber == 0
            ? 0
            : (propertyRatings.reduce((totalRating, pRating) => {
                return totalRating + pRating.rating;
            }, 0) / ratingNumber).toFixed();
        res.status(200).json({
            message: "Property fetched successfully",
            property: Object.assign(Object.assign({}, property.toObject()), { rating,
                ratingNumber }),
        });
    }
    catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getAProperty = getAProperty;
