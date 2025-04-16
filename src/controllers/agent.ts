import { Request, Response } from "express";
import User from "../models/User";
import AgentRating from "../models/AgentRating";

export const getAgent = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;

		if (
			!authHeader ||
			!authHeader.startsWith("Bearer ") ||
			!authHeader.split(" ")[1]
		) {
			res.status(401).json({ message: "Unauthorized - No token provided" });
			return;
		}

		const { agentId } = req.params;

		const agent = await User.findOne({ _id: agentId, role: "agent" }).select(
			"-password"
		);
		if (!agent) {
			res.status(404).json({
				message: "Agent not found",
			});
			return;
		}

		const agentRatings = await AgentRating.find({
			agent: agentId,
		});
		const ratingNumber = agentRatings.length;
		const rating =
			ratingNumber == 0
				? 0
				: (
						agentRatings.reduce((totalRating, aRating) => {
							return totalRating + aRating.rating;
						}, 0) / ratingNumber
				  ).toFixed();

		res.status(200).json({
			message: "Agent fetched successfully",
			agent: {
				...agent.toObject(),
				rating,
				ratingNumber,
			},
		});
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};
