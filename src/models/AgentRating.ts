import mongoose from "mongoose";
import "./User";

const AgentRatingSchema = new mongoose.Schema(
	{
		agent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		review: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.AgentRating ||
	mongoose.model("AgentRating", AgentRatingSchema);
