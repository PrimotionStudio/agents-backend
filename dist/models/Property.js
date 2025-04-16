"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("./User");
const PropertySchema = new mongoose_1.default.Schema({
    houseName: {
        type: String,
        required: true,
    },
    houseDescription: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    mainImage: {
        type: String,
        required: true,
    },
    otherMedia: [String],
    startingPricePerYear: {
        type: Number,
        required: true,
    },
    agent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Property ||
    mongoose_1.default.model("Property", PropertySchema);
