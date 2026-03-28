import prisma from "../../config/db.js"
import { User } from "../../generated/prisma/index.js";
import { NewUser, UserFilters } from "./user.types.js";
import { Prisma } from "../../generated/prisma/index.js";

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

export const getAllUsers = async (filters: UserFilters = {}) => {
    const { username, projectId } = filters;

    const where: Prisma.UserWhereInput = {};

    if (username) {
        where.username = { contains: username, mode: 'insensitive' };
    }
    if (projectId) {
        where.projects = { some: { id: projectId } };
    }

    const users = await prisma.user.findMany({ where });
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