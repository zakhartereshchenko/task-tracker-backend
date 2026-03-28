import prisma from "../../config/db.js"
import { Prisma, Task } from "../../generated/prisma/index.js";
import { TaskFilters } from "./task.types.js";


export const getTaskById = async (id: string, projectId: string) => {
    const task = await prisma.task.findFirst({
        where: { id, projectId }
    });

    return task;
}

export const getAllTasks = async (projectId: string, filters: TaskFilters) => {
    const where: Prisma.TaskWhereInput = {};

    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.priority) {
        where.priority = filters.priority;
    }
    if (filters.assigneeId) {
        where.assigneeId = filters.assigneeId;
    }
    if (filters.creatorId) {
        where.creatorId = filters.creatorId;
    }
    if (filters.labels) {
        where.labels = { hasSome: filters.labels };
    }
    if (filters.title) {
        where.title = { contains: filters.title, mode: 'insensitive' };
    }
    
    const tasks = await prisma.task.findMany({
        where: { 
            projectId,
            ...where
        }
    });

    return tasks;
}

export const createNewTask = async (projectId: string, task: Task) => {
    const { title, description, priority, creatorId, assigneeId, labels } = task;
    
    const newTask = await prisma.task.create({
        data: {
            title,
            description: description ?? null,
            priority: priority,
            projectId,
            creatorId,
            assigneeId: assigneeId ?? null,
            labels: labels ?? []
        }
    });
    
    return newTask;
}

export const updateTaskById = async (id: string, projectId: string, updateData: Partial<Task>) => {
    const task = await prisma.task.findFirst({
        where: { id, projectId }
    });

    if (!task) {
        throw new Error("Task not found or does not belong to this project");
    }

    return await prisma.task.update({
        where: { id },
        data: updateData
    });
}

export const deleteTaskById = async (id: string, projectId: string) => {
    const task = await prisma.task.findFirst({
        where: { id, projectId }
    });

    if (!task) {
        throw new Error("Task not found or does not belong to this project");
    }

    return await prisma.task.delete({
        where: { id }
    });
}