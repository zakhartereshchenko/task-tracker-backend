import express from 'express'
import userRoutes from "./modules/Users/user.routes.js"
import projectRoutes from "./modules/Projects/project.routes.js"
import { authenticate } from './middlewares/auth.middleware.js';
import authRoutes from './modules/Auth/auth.routes.js';

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(authenticate);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

export default app;