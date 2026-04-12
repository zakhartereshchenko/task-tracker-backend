import { Request, Response } from "express";
import { createLabel, deleteLabel, getLabels } from "./labels.service.js";

export const createLabelHandler = async (req: Request, res: Response) => {
  try {
    const { label, color, projectId } = req.body;

    const createdLabel = await createLabel({ name: label, color, projectId });

    res.status(201).json(createdLabel);
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

export const deleteLabelHandler = async (req: Request, res: Response) => {
  try {
    const { labelId } = req.params;
    const { projectId } = req.body;

    if (!labelId || Array.isArray(labelId)) {
        throw new Error("Invalid label id");
    }
    if(typeof(projectId) !== 'string'){
        throw new Error("Invalid project id");
    }

    await deleteLabel(labelId, projectId);

    res.status(204).send();
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

export const getLabelsHandler = async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project id");
    }

    const labels = await getLabels(projectId);

    return res.status(200).json(labels);
  } catch (e) {
    return res.status(400).json({ message: e });
  }
};