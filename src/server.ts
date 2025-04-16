import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Register Routes
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";
import agentRoutes from "./routes/agent";
import userRoutes from "./routes/user";
import agentRatingRoutes from "./routes/agentRating";
import propertyRatingRoutes from "./routes/propertyRating";

app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/agentRating", agentRatingRoutes);
app.use("/api/propertyRating", propertyRatingRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.json({ message: "Hello, World!" });
});

app.all("/*routeName", (req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({
		message: "Cannot find this route",
	});
});

app.listen(port, () => {
	console.log(
		`⚡️[Agents-backend-server]: Server is running at http://localhost:${port}`
	);
	mongoose
		.connect(process.env.MONGODB_URI as string)
		.then(() => console.log("Connected to MongoDB"))
		.catch((err) => {
			console.error("Error connecting to MongoDB:");
			console.log(err);
			process.exit(1);
		});
});
