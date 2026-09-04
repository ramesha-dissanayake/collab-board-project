import * as projectService
  from "../services/projectService.js";

export async function list(
  req,
  res
) {
  const projects =
    await projectService.listProjects(
      req.user.id
    );

  return res.status(200).json({
    data: projects,
  });
}

export async function getOne(
  req,
  res
) {
  const project =
    await projectService.getProject(
      req.params.id,
      req.user.id
    );

  return res.status(200).json({
    data: project,
  });
}

export async function create(
  req,
  res
) {
  const project =
    await projectService.createProject(
      req.body,
      req.user.id
    );

  return res.status(201).json({
    data: project,
  });
}

export async function findMemberCandidate(
  req,
  res
) {
  const member =
    await projectService.findMemberCandidate(
      req.params.id,
      req.validated.query.email,
      req.user.id
    );

  return res.status(200).json({
    data: member,
  });
}

export async function addMember(
  req,
  res
) {
  const project =
    await projectService.addProjectMember(
      req.params.id,
      req.body.memberId,
      req.user.id
    );

  return res.status(200).json({
    data: project,
  });
}

export async function removeMember(
  req,
  res
) {
  const project =
    await projectService.removeProjectMember(
      req.params.id,
      req.params.memberId,
      req.user.id
    );

  return res.status(200).json({
    data: project,
  });
}