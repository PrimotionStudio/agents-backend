import { Request, Response } from "express";
import Property from "../models/Property";
import User from "../models/User";
import PropertyRating from "../models/PropertyRating";

export const createProperty = async (
	req: Request & {
		body: {
			houseName: string;
			houseDescription: string;
			category: string;
			location: string;
			mainImage: string;
			otherMedia?: string[];
			startingPricePerYear: number;
			agent: string;
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

		const {
			houseName,
			houseDescription,
			category,
			location,
			mainImage,
			otherMedia,
			startingPricePerYear,
			agent,
		} = req.body;

		if (
			!houseName ||
			!houseDescription ||
			!category ||
			!location ||
			!mainImage ||
			!startingPricePerYear ||
			!agent
		) {
			res.status(400).json({
				message: "All fields are required",
			});
			return;
		}

		// Check if the agent exists
		const agentExists = await User.findOne({ _id: agent, role: "agent" });

		if (!agentExists) {
			res.status(400).json({
				message: "Agent does not exist",
			});
			return;
		}

		const property = await Property.create({
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
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};

export const getAllProperties = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;

		let properties;
		if (
			!authHeader ||
			!authHeader.startsWith("Bearer ") ||
			!authHeader.split(" ")[1]
		)
			properties = await Property.find();
		else properties = await Property.find().populate("agent");

		const propertiesWithRatings = await Promise.all(
			properties.map(async (prop: any) => {
				const propertyRatings = await PropertyRating.find({
					property: prop._id,
				});
				const ratingNumber = propertyRatings.length;
				const rating =
					ratingNumber == 0
						? 0
						: (
								propertyRatings.reduce((totalRating, pRating) => {
									return totalRating + pRating.rating;
								}, 0) / ratingNumber
						  ).toFixed();

				return {
					...prop.toObject(),
					rating,
					ratingNumber,
				};
			})
		);
		res.status(200).json({
			message: "Properties fetched successfully",
			properties: propertiesWithRatings,
		});
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};

export const getAProperty = async (req: Request, res: Response) => {
	try {
		const { propertyId } = req.params;

		const authHeader = req.headers.authorization;

		let property;
		if (
			!authHeader ||
			!authHeader.startsWith("Bearer ") ||
			!authHeader.split(" ")[1]
		)
			property = await Property.findById(propertyId);
		else property = await Property.findById(propertyId).populate("agent");
		if (!property) {
			res.status(404).json({
				message: "Property not found",
			});
			return;
		}

		const propertyRatings = await PropertyRating.find({
			property: propertyId,
		});
		const ratingNumber = propertyRatings.length;
		const rating =
			ratingNumber == 0
				? 0
				: (
						propertyRatings.reduce((totalRating, pRating) => {
							return totalRating + pRating.rating;
						}, 0) / ratingNumber
				  ).toFixed();

		res.status(200).json({
			message: "Property fetched successfully",
			property: {
				...property.toObject(),
				rating,
				ratingNumber,
			},
		});
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};
