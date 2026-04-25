import express from 'express'
import userRoutes from "./modules/Users/user.routes.js"
import projectRoutes from "./modules/Projects/project.routes.js"
import { authMiddleware } from './middlewares/auth.middleware.js';
import authRoutes from './modules/Auth/auth.routes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import labelsRoutes from './modules/Labels/labels.routes.js';
import { CLIENT_ORIGIN } from './constants/api.js';

const app = express();

app.use(express.json());

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(authMiddleware);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/labels", labelsRoutes);

export default app;