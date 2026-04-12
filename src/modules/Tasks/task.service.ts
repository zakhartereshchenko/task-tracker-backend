import { Prisma, Task, TaskPriority, TaskStatus } from "@prisma/client";
import prisma from "../../config/db.js"
import { CreateTaskType, TaskFilters, TaskWithLabels } from "./task.types.js";

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

export const createNewTask = async (projectId: string, task: CreateTaskType, creatorId: string, assigneeId?: string) => {
    const { title, description, priority, labels, status } = task;
    
    const data: Prisma.TaskUncheckedCreateInput = {
        title: title,
        description: description ?? null,
        priority: priority ?? TaskPriority.MEDIUM,
        projectId: projectId,
        creatorId: creatorId,
        assigneeId: assigneeId ?? null,
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
    console.log('newTask', newTask)
    return newTask;
}

export const updateTaskById = async (id: string, projectId: string, updateData: Partial<TaskWithLabels>) => {
    const task = await prisma.task.findFirst({
        where: { id, projectId }
    });

    if (!task) {
        throw new Error("Task not found or does not belong to this project");
    }

    const { labels, ...rest} = updateData

    const data: Prisma.TaskUpdateInput = {
        ...rest,
    }

    // set labels if provided
    if (labels) {
        data.labels = {
            set: labels.map(label => ({ id: label }))
        };
    }

    // set new assignee if provided
    if (updateData.assigneeId !== undefined) {
        data.assignee = updateData.assigneeId 
            ? { connect: { id: updateData.assigneeId } } 
            : { disconnect: true };
    }

    return await prisma.task.update({
        where: { id },
        data
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