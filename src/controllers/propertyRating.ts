import { Request, Response } from "express";
import PropertyRating from "../models/PropertyRating";
import jwt, { JwtPayload } from "jsonwebtoken";

export const rateProperty = async (
	req: Request & {
		body: {
			property: string;
			user: string;
			rating: string;
			review: string;
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
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;

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
		const hasRatedBefore = await PropertyRating.findOne({
			property,
			user,
		});
		if (hasRatedBefore) {
			res.status(400).json({
				message: "You cannot rate the same property twice",
			});
			return;
		}

		const propertyRating = await PropertyRating.create({
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
	} catch (error) {
		res.status(500).json({
			message: "An error occured",
		});
	}
};

export const getPropertyRatings = async (req: Request, res: Response) => {
	try {
		const { propertyId } = req.params;

		if (!propertyId) {
			res.status(400).json({
				message: "All fields are required",
			});
			return;
		}

		const propertyRatings = await PropertyRating.find({
			property: propertyId,
		})
			.populate("property")
			.populate("user", "-password");

		res.status(200).json({
			message: "Property ratings found",
			propertyRatings,
		});
	} catch (error) {
		res.status(500).json({
			message: "An error occured",
		});
	}
};
