import { Request, Response } from "express";
import { createNewProject, deleteProjectById, getAllProjects, getProjectById, joinProjectById, leaveProjectById, updateProjectById } from "./project.service.js";
import { ProjectsFilters } from "./project.types.js";

export const getProject = async (req: Request, res: Response) => {
    try{
        const projectId = req.params.projectId as string;

        const project = await getProjectById(projectId);

        res.json(project);
    }catch(error){
        res.status(500).json({error})
    }
}

export const getProjects = async (req: Request, res: Response) => {
    try{
        const userId = req.user.id;
        const filters: ProjectsFilters = {};

        if (req.query.name) filters.name = req.query.name as string;

        const projects = await getAllProjects(filters, userId);

        res.json(projects);
    }catch(error){
        res.status(500).json({error})
    }
}

export const createProject = async (req: Request, res: Response) => {
    try{
        const project = req.body

        const newProject = await createNewProject(project)

        res.status(201).json(newProject);
    }catch(error){
        res.status(500).json({error})
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try{
        const projectId = req.params.projectId as string;
        const project = req.body;

        const updatedProject = await updateProjectById(projectId, project);

        res.json(updatedProject);
    }catch(error){
        res.status(500).json({error})
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try{
        const projectId = req.params.projectId as string;

        const deletedProject = await deleteProjectById(projectId);

        res.json(deletedProject);
    }catch(error){
        res.status(500).json({error})
    }
}

export const joinProject = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.projectId as string;

        await joinProjectById(projectId, userId);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const leaveProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId as string;

    await leaveProjectById(projectId, userId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};