import mongoose from "mongoose";
import "./User";

const PropertySchema = new mongoose.Schema(
	{
		houseName: {
			type: String,
			required: true,
		},
		houseDescription: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		mainImage: {
			type: String,
			required: true,
		},
		otherMedia: [String],
		startingPricePerYear: {
			type: Number,
			required: true,
		},
		agent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		available: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Property ||
	mongoose.model("Property", PropertySchema);
