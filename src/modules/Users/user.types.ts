import { User } from "@prisma/client";

export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt">

export interface UserFilters {
    username?: string;
    projectId?: string;
}

export type UserData = Pick<User, "id" | "username">;