import { Router } from "express";
import { createProject, deleteProject, getProject, getProjects, joinProject, leaveProject, updateProject } from "./project.controller.js";
import taskRoutes from "../Tasks/task.routes.js";

const router = Router();

router.use("/:projectId/tasks", taskRoutes);

router.get("/", getProjects)
router.get("/:projectId", getProject)
router.post("/", createProject)
router.put("/:projectId", updateProject)
router.delete("/:projectId", deleteProject)
router.post("/:projectId/join", joinProject)
router.post("/:projectId/leave", leaveProject)

export default router;