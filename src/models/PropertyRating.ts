import mongoose from "mongoose";
import "./Property";
import "./User";

const PropertyRatingSchema = new mongoose.Schema(
	{
		property: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Property",
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

export default mongoose.models.PropertyRating ||
	mongoose.model("PropertyRating", PropertyRatingSchema);
