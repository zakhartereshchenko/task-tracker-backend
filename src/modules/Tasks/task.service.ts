import { Prisma, Task, TaskPriority, TaskStatus } from "@prisma/client";
import prisma from "../../config/db.js"
import { TaskDTO, TaskFilters } from "./task.types.js";
import { mapPriority, mapStatus } from "../../utils/helpers.js";

export const getTaskById = async ({id, projectId}:{id: string, projectId: string}) => {
    const task = await prisma.task.findFirst({
        where: { id, projectId },
        include: {
            labels: true, 
            assignee:{
                select:{
                    id:true, 
                    username: true
                }
            },
            createdBy:{
                select:{
                    id:true, 
                    username: true
                }
            }
        }
    });

    return task;
}

export const getAllTasks = async (projectId: string, filters: TaskFilters) => {
    const where: Prisma.TaskWhereInput = {};

    if (filters.status) {
        where.status = {
            in: filters.status.map(mapStatus)
        };
    }
    if (filters.priority) {
        where.priority = {
            in: filters.priority.map(mapPriority)
        };
    }
    // if (filters.assigneeId) {
    //     where.assigneeId = filters.assigneeId;
    // }
    // if (filters.creatorId) {
    //     where.creatorId = filters.creatorId;
    // }
    if (filters.labels) {
        where.labels = {
            some: {
                id: { 
                    in: filters.labels 
                }
            }
        };
    }
    if (filters.title) {
        where.title = { contains: filters.title, mode: 'insensitive' };
    }
    
    const tasks = await prisma.task.findMany({
        where: { 
            projectId,
            ...where
        },
        include: {
            labels: true, 
            assignee:{
                select:{
                    id:true, 
                    username: true
                }
            },
            createdBy:{
                select:{
                    id:true, 
                    username: true
                }
            }
        }
    });

    return tasks;
}

export const createNewTask = async (projectId: string, task: TaskDTO, creatorId: string, assigneeId?: string) => {
    const { title, description, priority, labels, status, assignee } = task;
    
    const data: Prisma.TaskUncheckedCreateInput = {
        title: title,
        description: description ?? null,
        priority: priority ?? TaskPriority.MEDIUM,
        projectId: projectId,
        creatorId: creatorId,
        assigneeId: assignee ?? null,
        status: status ?? TaskStatus.TODO,
    }

    if (labels && labels.length > 0) {
        data.labels = {
            connect: labels.map(id => ({ id }))
        };
    }

    const newTask = await prisma.task.create({
        data,
        include: {
            labels: true,
            assignee:{
                select:{
                    id:true, 
                    username: true
                }
            },
            createdBy:{
                select:{
                    id:true, 
                    username: true
                }
            }
        }
    });
    
    return newTask;
}

export const updateTaskById = async ({taskId, projectId, updatedData}:{taskId: string, projectId: string, updatedData: Partial<TaskDTO>}) => {
    const task = await prisma.task.findFirst({
        where: { 
            id: taskId, 
            projectId 
        }
    });

    if (!task) {
        throw new Error("Task not found or does not belong to this project");
    }

    const data: Prisma.TaskUpdateInput = {};

    if (updatedData.title !== undefined) data.title = updatedData.title;
    if (updatedData.description !== undefined) data.description = updatedData.description;
    if (updatedData.status !== undefined) data.status = updatedData.status;
    if (updatedData.priority !== undefined) data.priority = updatedData.priority;

    // set labels if provided
    // if (labels) {
    //     data.labels = {
    //         set: labels.map(label => ({ id: label }))
    //     };
    // }
    if (updatedData.labels) {
        data.labels = {
            set: updatedData.labels.map(id => ({ id }))
        };
    }

    // set new assignee if provided
    // if (updatedData.assigneeId !== undefined) {
    //     data.assignee = updatedData.assigneeId 
    //         ? { connect: { id: updatedData.assigneeId } } 
    //         : { disconnect: true };
    // }
    if (updatedData.assignee !== undefined) {
        data.assignee = updatedData.assignee
            ? { connect: { id: updatedData.assignee } }
            : { disconnect: true };
    }

    return await prisma.task.update({
        where: { id: taskId },
        data,
        include: {
            labels: true,
            assignee:{
                select:{
                    id:true, 
                    username: true
                }
            },
            createdBy:{
                select:{
                    id:true, 
                    username: true
                }
            }
        }
    });
}

export const deleteTaskById = async ({id, projectId}:{id: string, projectId: string}) => {
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