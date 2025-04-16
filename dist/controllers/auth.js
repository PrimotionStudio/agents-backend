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
exports.isLoggedIn = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Register a new user
 * @param {Request & {body: {fullName: string, phoneNumber: string, password: string, role: "buyer" | "agent"}}} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            res.status(400).json({
                message: "No request body found",
            });
            return;
        }
        const { fullName, phoneNumber, password, role } = req.body;
        if (!fullName ||
            !phoneNumber ||
            !password ||
            !role ||
            !["buyer", "agent"].includes(role)) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const user = yield User_1.default.create({
            fullName,
            phoneNumber,
            password,
            role,
        });
        res.status(201).json({
            message: "User registered successfully",
            user: user.toObject(),
        });
    }
    catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.register = register;
/**
 * Login an existing user
 * @param {Request & {body: {phoneNumber: string; password: string}}} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            res.status(400).json({
                message: "No request body found",
            });
            return;
        }
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const user = yield User_1.default.findOne({ phoneNumber });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: "Invalid password",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        // res.cookie("jwtToken", token, {
        // 	httpOnly: true,
        // 	maxAge: 30 * 24 * 60 * 60 * 1000,
        // });
        res.status(201).json({
            message: "User login",
            jwtToken: token,
            user: user.toObject(),
        });
    }
    catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.login = login;
/**
 * Verifies the presence of a Bearer token in the authorization header.
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
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!user)
            res.status(400).json({
                message: "Your login session has expired",
            });
        next();
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: `An error occured`,
            error,
        });
    }
});
exports.isLoggedIn = isLoggedIn;
