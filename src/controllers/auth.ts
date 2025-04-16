import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Register a new user
 * @param {Request & {body: {fullName: string, phoneNumber: string, password: string, role: "buyer" | "agent"}}} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const register = async (
	req: Request & {
		body: {
			fullName: string;
			phoneNumber: string;
			password: string;
			role: "buyer" | "agent";
		};
	},
	res: Response
) => {
	try {
		if (!req.body) {
			res.status(400).json({
				message: "No request body found",
			});
			return;
		}

		const { fullName, phoneNumber, password, role } = req.body;

		if (
			!fullName ||
			!phoneNumber ||
			!password ||
			!role ||
			!["buyer", "agent"].includes(role)
		) {
			res.status(400).json({
				message: "All fields are required",
			});
			return;
		}

		const user = await User.create({
			fullName,
			phoneNumber,
			password,
			role,
		});
		res.status(201).json({
			message: "User registered successfully",
			user: user.toObject(),
		});
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};

/**
 * Login an existing user
 * @param {Request & {body: {phoneNumber: string; password: string}}} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const login = async (
	req: Request & {
		body: {
			phoneNumber: string;
			password: string;
		};
	},
	res: Response
) => {
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

		const user = await User.findOne({ phoneNumber });

		if (!user) {
			res.status(404).json({
				message: "User not found",
			});
			return;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			res.status(400).json({
				message: "Invalid password",
			});
			return;
		}

		const token = jwt.sign(
			{
				_id: user._id,
				role: user.role,
			},
			process.env.JWT_SECRET as string,
			{
				expiresIn: "30d",
			}
		);
		// res.cookie("jwtToken", token, {
		// 	httpOnly: true,
		// 	maxAge: 30 * 24 * 60 * 60 * 1000,
		// });

		res.status(201).json({
			message: "User login",
			jwtToken: token,
			user: user.toObject(),
		});
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};

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
export const isLoggedIn = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
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
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;
		if (!decoded) {
			res.status(400).json({
				message: "Your login session has expired",
			});
			return;
		}
		const user = await User.findById(decoded._id);
		if (!user)
			res.status(400).json({
				message: "Your login session has expired",
			});
		next();
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: `An error occured`,
			error,
		});
	}
};
