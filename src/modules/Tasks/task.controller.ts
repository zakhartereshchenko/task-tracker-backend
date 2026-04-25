import { Request, Response } from "express";
import { createNewTask, deleteTaskById, getAllTasks, getTaskById, updateTaskById } from "./task.service.js";
import { CreateTaskType, TaskFilters, TaskPriorityEnum, TaskStatusEnum, TaskWithLabels } from "./task.types.js";
import { Prisma } from "@prisma/client";
import { convertStringIntoArray, getValidPriorities, getValidStatuses } from "../../utils/helpers.js";

export const createTask = async (req: Request, res: Response) => {
    try{
        const projectId = req.params.projectId as string;
        const task = req.body as CreateTaskType;
        const creatorId = req.user.id
        
        const newTask = await createNewTask(projectId, task, creatorId);

        res.status(201).json(newTask);
    }catch(error){
        if (error instanceof Prisma.PrismaClientValidationError) {
            console.error("Create task endpoint error: ", error.message);
        }
        res.status(500).json({error})
    }
}

export const getTask = async (req: Request, res: Response) => {
    try{
        const projectId = req.params.projectId as string;
        const taskId = req.params.taskId as string;

        const task = await getTaskById({id: taskId, projectId});
        
        res.json(task);
    }catch(error){
        res.status(500).json({error})
    }
}

export const getTasks = async (req:Request, res:Response) => {
    try{
        const filters: TaskFilters = {};
        const projectId = req.params.projectId as string;
        
        if (req.query.status) filters.status = getValidStatuses(convertStringIntoArray(req.query.status as string));
        if (req.query.priority) filters.priority = getValidPriorities(convertStringIntoArray(req.query.priority as string));
        // if (req.query.assigneeId) filters.assigneeId = req.query.assigneeId as string;
        // if (req.query.creatorId) filters.creatorId = req.query.creatorId as string;
        if (req.query.labels) filters.labels = convertStringIntoArray(req.query.labels as string);
        if (req.query.title) filters.title = req.query.title as string;
        
        const tasks = await getAllTasks(projectId, filters)
        
        res.json(tasks);
    }catch(error){
        res.status(500).json({error})
    }
}

export const updateTask = async (req:Request, res:Response) => {
    try{
        const projectId = req.params.projectId as string;
        const taskId = req.params.taskId as string;
        const task = req.body;

        const updatedTask = await updateTaskById({projectId, taskId, updatedData: task});
        
        res.json(updatedTask);
    }catch(error){
        if (error instanceof Prisma.PrismaClientValidationError) {
            console.error("Update task endpoint error: ", error.message);
        }
        
        res.status(500).json({error})
    }
}

export const deleteTask = async (req:Request, res:Response) => {
    try{
        const projectId = req.params.projectId as string;
        const taskId = req.params.id as string;

        const deletedTask = await deleteTaskById({id: taskId, projectId });

        res.json(deletedTask);
    }catch(error){
        res.status(500).json({error})
    }
}