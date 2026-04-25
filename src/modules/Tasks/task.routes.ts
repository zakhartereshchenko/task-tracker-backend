import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "./task.controller.js";

const router = Router({ mergeParams: true});

router.get("/", getTasks)
router.get("/:taskId", getTask)
router.post("/", createTask)
router.put("/:taskId", updateTask)
router.delete("/:id", deleteTask)

export default router;