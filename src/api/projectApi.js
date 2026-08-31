import { request } from "./client.js";

export async function getProjects() {
  const response = await request("/api/projects");

  return response.data;
}

export async function getProject(projectId) {
  const response = await request(`/api/projects/${projectId}`);

  return response.data;
}

export async function createProject(project) {
  const response = await request("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

  return response.data;
}