import { User } from "../../generated/prisma/index.js";

export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt">

export interface UserFilters {
    username?: string;
    projectId?: string;
}