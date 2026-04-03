import prisma from "../../config/db.js"
import { Prisma, Project } from "../../generated/prisma/default.js";
import { ProjectsFilters } from "./project.types.js";

export const getProjectById = async (id: string) => {
    const project = await prisma.project.findUnique({
        where: { id }
    });

    return project;
}

export const getAllProjects = async (filters: ProjectsFilters, userId: string) => {
    const where: Prisma.ProjectWhereInput = {};

    if (filters.name) {
        where.name = {
            contains: filters.name,
            mode: "insensitive",
        };
    }

    const projects = await prisma.project.findMany({
    where,
    include: {
        members: {
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        },
        _count: {
            select: {
                members: true,
            },
        },
    },
    });

    return projects.map((project) => {
        const { _count, members, ...rest } = project;

        return {
            ...rest,
            isMember: members.some(m => m.id === userId),
            membersCount: _count.members,
        };
    });
};

export const createNewProject = async (project: Project) => {
    const { name, description } = project;

    const newProject = await prisma.project.create({
        data: {
            name,
            description: description ?? null,
        }
    });

    return newProject;
}

export const updateProjectById = async (id: string, changes: Project) => {
    await prisma.project.update({
        where: { id },
        data: changes,
    });

    return changes;
}

export const deleteProjectById = async (id: string) => {
    const deletedProject = await prisma.project.delete({
        where: { id }
    });

    return deletedProject;
}

export const joinProjectById = async (projectId: string, userId: string) => {
    return prisma.project.update({
        where: { id: projectId },
        data: {
            members: {
                connect: {
                    id: userId,
                },
            },
        },
    });
};

export const leaveProjectById = async (projectId: string, userId: string) => {
    return prisma.project.update({
        where: { id: projectId },
        data: {
        members: {
            disconnect: {
            id: userId,
            },
        },
        },
    });
};