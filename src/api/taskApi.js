import { request } from "./client.js";

export async function getProjectTasks(projectId, params = {}) {
  const search = new URLSearchParams();

  if (params.status) {
    search.set("status", params.status);
  }

  if (params.assignee) {
    search.set("assignee", params.assignee);
  }

  const query = search.toString();

  const response = await request(
    `/api/projects/${projectId}/tasks${query ? `?${query}` : ""}`
  );

  return response.data;
}

export async function createTask(task) {
  const response = await request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

  return response.data;
}

export async function updateTask(taskId, changes) {
  const response = await request(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });

  return response.data;
}

export async function deleteTask(taskId) {
  return request(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}