import { Request, Response } from "express";
import AgentRating from "../models/AgentRating";
import jwt, { JwtPayload } from "jsonwebtoken";

export const rateAgent = async (
	req: Request & {
		body: {
			agent: string;
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
		const hasRatedBefore = await AgentRating.findOne({ agent, user });
		if (hasRatedBefore) {
			res.status(400).json({
				message: "You cannot rate the same agent twice",
			});
			return;
		}

		const agentRating = await AgentRating.create({
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
	} catch (error) {
		res.status(500).json({
			message: "An error occured",
		});
	}
};

export const getAgentRatings = async (req: Request, res: Response) => {
	try {
		const { agentId } = req.params;

		if (!agentId) {
			res.status(400).json({
				message: "All fields are required",
			});
			return;
		}

		const agentRatings = await AgentRating.find({
			agent: agentId,
		})
			.populate("agent", "-password")
			.populate("user", "-password");

		res.status(200).json({
			message: "Agent ratings found",
			agentRatings,
		});
	} catch (error) {
		res.status(500).json({
			message: "An error occured",
		});
	}
};
