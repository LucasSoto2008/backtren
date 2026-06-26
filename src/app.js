import express from "express";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./router/health.route.js";
import authRoutes from "./router/auth.route.js";
import userRoutes from "./router/user.route.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;
