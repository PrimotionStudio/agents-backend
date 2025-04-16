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
exports.changePassword = exports.updateUser = exports.me = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Retrieves the authenticated user's information.
 *
 * Validates the presence of a Bearer token in the authorization header.
 * If valid, decodes the token to fetch the user's data from the database.
 *
 * @param {Request} req - The request object containing the authorization header.
 * @param {Response} res - The response object for sending the user's information or error.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 *
 * Responses:
 * - 200: User information fetched successfully.
 * - 400: Session expired or an error occurred during processing.
 * - 401: Unauthorized, no token provided.
 */
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        if (!decoded) {
            res.status(400).json({
                message: "Your login session has expired",
            });
            return;
        }
        const user = yield User_1.default.findById(decoded._id);
        if (!user) {
            res.status(400).json({
                message: "Your login session has expired",
            });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `An error occured`,
            error,
        });
    }
});
exports.me = me;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        res.status(400).json({
            message: "No request body found",
        });
        return;
    }
    try {
        const { userId, fullName, phoneNumber } = req.body;
        if (!userId || !fullName || !phoneNumber) {
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
        if (decoded._id !== userId) {
            res.status(403).json({
                message: "Your are not permmited to perform this action",
            });
            return;
        }
        const user = yield User_1.default.findByIdAndUpdate(userId, {
            fullName,
            phoneNumber,
        }, { new: true });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.json({
            message: "User updated successfully",
            user: user.toObject(),
        });
    }
    catch (error) {
        res.status(400).json({
            message: `An error occured`,
            error,
        });
    }
});
exports.updateUser = updateUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        res.status(400).json({
            message: "No request body found",
        });
        return;
    }
    try {
        const { userId, oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
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
        if (decoded._id !== userId) {
            res.status(403).json({
                message: "Your are not permmited to perform this action",
            });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                message: "Passwords do not match",
            });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: "Invalid password",
            });
            return;
        }
        user.password = newPassword;
        yield user.save();
        res.json({
            message: "User updated successfully",
            user: yield User_1.default.findById(userId),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occured",
        });
    }
});
exports.changePassword = changePassword;
