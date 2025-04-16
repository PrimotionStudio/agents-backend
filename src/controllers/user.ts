import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

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

export const me = async (
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
	} catch (error) {
		res.status(500).json({
			message: `An error occured`,
			error,
		});
	}
};

export const updateUser = async (
	req: Request & {
		body: {
			_id: string;
			fullName: string;
			phoneNumber: string;
		};
	},
	res: Response
) => {
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
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;
		if (!decoded) {
		}
		if (decoded._id !== userId) {
			res.status(403).json({
				message: "Your are not permmited to perform this action",
			});
			return;
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{
				fullName,
				phoneNumber,
			},
			{ new: true }
		);

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
	} catch (error) {
		res.status(400).json({
			message: `An error occured`,
			error,
		});
	}
};

export const changePassword = async (
	req: Request & {
		body: {
			userId: string;
			oldPassword: string;
			newPassword: string;
			confirmNewPassword: string;
		};
	},
	res: Response
) => {
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
		if (newPassword !== confirmNewPassword) {
			res.status(400).json({
				message: "Passwords do not match",
			});
			return;
		}

		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({
				message: "User not found",
			});
			return;
		}

		const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordValid) {
			res.status(400).json({
				message: "Invalid password",
			});
			return;
		}

		user.password = newPassword;
		await user.save();

		res.json({
			message: "User updated successfully",
			user: await User.findById(userId),
		});
	} catch (error) {
		res.status(500).json({
			message: "An error occured",
		});
	}
};
