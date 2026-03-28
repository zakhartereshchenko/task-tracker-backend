import prisma from "../../config/db.js"
import { Prisma, Project } from "../../generated/prisma/default.js";
import { ProjectsFilters } from "./project.types.js";

export const getProjectById = async (id: string) => {
    const project = await prisma.project.findUnique({
        where: { id }
    });

    return project;
}

export const getAllProjects = async (filters: ProjectsFilters) => {
    const where: Prisma.ProjectWhereInput = {};

    if (filters.title) {
        where.title = { contains: filters.title, mode: 'insensitive' };
    }

    const projects = await prisma.project.findMany({
        where
    });

    return projects;
}

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