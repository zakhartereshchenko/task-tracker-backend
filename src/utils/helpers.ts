import { TaskPriority, TaskStatus } from "@prisma/client";
import { TaskPriorityEnum, TaskStatusEnum } from "../modules/Tasks/task.types.js";

export const convertStringIntoArray = (str: string) => {
    return str.split(",")
}

export const getValidStatuses = (arr: string[]) => {
    return arr.filter((s): s is TaskStatusEnum => Object.values(TaskStatusEnum).includes(s as TaskStatusEnum));
}

export const getValidPriorities = (arr: string[]) => {
    return arr.filter((s): s is TaskPriorityEnum => Object.values(TaskPriorityEnum).includes(s as TaskPriorityEnum));
}

export const mapStatus = (status: TaskStatusEnum): TaskStatus => {
    return status as TaskStatus;
};

export const mapPriority = (priority: TaskPriorityEnum): TaskPriority => {
    return priority as TaskPriority;
};