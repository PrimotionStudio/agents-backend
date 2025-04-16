"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
// Register Routes
const auth_1 = __importDefault(require("./routes/auth"));
const property_1 = __importDefault(require("./routes/property"));
const agent_1 = __importDefault(require("./routes/agent"));
const user_1 = __importDefault(require("./routes/user"));
const agentRating_1 = __importDefault(require("./routes/agentRating"));
const propertyRating_1 = __importDefault(require("./routes/propertyRating"));
app.use("/api/auth", auth_1.default);
app.use("/api/property", property_1.default);
app.use("/api/agent", agent_1.default);
app.use("/api/user", user_1.default);
app.use("/api/agentRating", agentRating_1.default);
app.use("/api/propertyRating", propertyRating_1.default);
app.get("/", (req, res, next) => {
    res.json({ message: "Hello, World!" });
});
app.all("/*routeName", (req, res, next) => {
    res.status(404).json({
        message: "Cannot find this route",
    });
});
app.listen(port, () => {
    console.log(`⚡️[Agents-backend-server]: Server is running at http://localhost:${port}`);
    mongoose_1.default
        .connect(process.env.MONGODB_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => {
        console.error("Error connecting to MongoDB:");
        console.log(err);
        process.exit(1);
    });
});
