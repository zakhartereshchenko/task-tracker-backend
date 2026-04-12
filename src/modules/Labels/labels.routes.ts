import { Router } from "express";
import { createLabelHandler, deleteLabelHandler, getLabelsHandler } from "./labels.controller.js";

const router = Router();

router.get("/:id", getLabelsHandler);
router.post("/", createLabelHandler);
router.delete("/:id", deleteLabelHandler);

export default router;