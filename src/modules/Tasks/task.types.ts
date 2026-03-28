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