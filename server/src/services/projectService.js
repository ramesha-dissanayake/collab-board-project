import { projectRepository } from "../repositories/projectRepository.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../utils/AppError.js";

function canAccess(project, userId) {
  if (!project.ownerId) return true;

  return (
    project.ownerId === userId ||
    project.memberIds?.includes(userId)
  );
}

export async function listProjects(userId) {
  const projects = await projectRepository.findAll();

  return projects.filter((project) =>
    canAccess(project, userId)
  );
}

export async function getProject(projectId, userId) {
  const project = await projectRepository.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project");
  }

  if (!canAccess(project, userId)) {
    throw new ForbiddenError();
  }

  return project;
}

export async function createProject(data, userId) {
  return projectRepository.create({
    ...data,
    ownerId: userId,
  });
}

export async function ensureProjectAccess(projectId, userId) {
  return getProject(projectId, userId);
}