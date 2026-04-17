import { Prisma, User } from "@prisma/client";
import prisma from "../../config/db.js"
import { NewUser, UserFilters } from "./user.types.js";

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    return user;
}

export const getUserByUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: { username }
    });
    return user;
}

export const getAllUsers = async ({filters={}, projectId}:{filters: UserFilters, projectId: string}) => {
    const { username } = filters;

    const where: Prisma.UserWhereInput = {};

    if (username) {
        where.username = { contains: username, mode: 'insensitive' };
    }
    if (projectId) {
        where.projects = { some: { id: projectId } };
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            members: true,
        },
    });

    const users = await prisma.user.findMany({ 
        where,
        select: {
            id: true,
            username: true,
        }
    });
    return users;
}

export const createNewUser = async (user: NewUser) => {
    const { username, password } = user;
        
    const newUser = await prisma.user.create({
        data: { 
            username, 
            password 
        }
    });
    return newUser;
}

export const updateUserById = async (id:string, user: User) => {
    await prisma.user.update({
        where: { id },
        data: user
    });
    return user;
}

export const deleteUserById = async (id: string) => {
    const deletedUser = await prisma.user.delete({
        where: { id }
    });
    return deletedUser;
}