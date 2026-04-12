import { Prisma, Task } from "@prisma/client/edge";


const taskWithLabels = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: { 
    labels: true, 
    assignee: {
        select: {
            id: true,
            username: true,
        }
    }
}
});

export type TaskWithDetails = Prisma.TaskGetPayload<typeof taskWithLabels>;

export interface TaskWithLabels extends Task {
    labels: string[],
}

// export type CreateTaskType = Pick<TaskWithLabels, 'title' | 'description' | 'status' | 'priority' | 'labelIds'>

export type CreateTaskType = 
  Pick<TaskWithLabels, 'title' | 'status' | 'priority'> & 
  Partial<Pick<TaskWithLabels, 'description' | 'labels'>>;

export enum TaskStatusEnum {
    ToDo = 'TODO',
    InProgress = 'IN_PROGRESS',
    InReview = 'IN_REVIEW',
    Done = 'DONE',
}

export enum TaskPriorityEnum {
    Low = 'LOW',
    Medium = "MEDIUM",
    Hight = 'HIGH',
}

export interface TaskFilters {
    status?: TaskStatusEnum;
    priority?: TaskPriorityEnum;
    assigneeId?: string;
    creatorId?: string;
    labels?: string[];
    title?: string;
}