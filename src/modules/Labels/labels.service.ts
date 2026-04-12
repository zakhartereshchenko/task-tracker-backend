import prisma from "../../config/db.js";

export const createLabel = async ({
  name,
  color,
  projectId,
}: {
  name: string;
  color?: string;
  projectId: string;
}) => {
  try {
    return await prisma.label.create({
      data: {
        name,
        color: color ?? null,
        project: {
          connect: { id: projectId },
        },
      },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      throw new Error("Label already exists in this project");
    }
    throw e;
  }
};

export const deleteLabel = async (
  labelId: string,
  projectId: string
) => {
  const label = await prisma.label.findFirst({
    where: {
      id: labelId,
      projectId,
    },
  });

  if (!label) {
    throw new Error("Label not found in this project");
  }

  return prisma.label.delete({
    where: { id: labelId },
  });
};

export const getLabels = async (projectId: string) => {
  return prisma.label.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};