import { Request, Response } from "express";
import User from "../models/User";

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

		res.status(200).json({
			message: "Agent fetched successfully",
			agent,
		});
	} catch (error) {
		// console.log("error", error);
		res.status(500).json({ message: "Internal server error", error });
	}
};
