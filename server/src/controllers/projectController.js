import * as projectService from "../services/projectService.js";

export async function list(req, res) {
  const projects = await projectService.listProjects(req.user.id);

  return res.status(200).json({
    data: projects,
  });
}

export async function getOne(req, res) {
  const project = await projectService.getProject(
    req.params.id,
    req.user.id
  );

  return res.status(200).json({
    data: project,
  });
}

export async function create(req, res) {
  const project = await projectService.createProject(
    req.body,
    req.user.id
  );

  return res.status(201).json({
    data: project,
  });
}