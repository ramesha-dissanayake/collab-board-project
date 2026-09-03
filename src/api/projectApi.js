import {
  request,
} from "./client.js";

export async function getProjects() {
  const response =
    await request(
      "/api/projects"
    );

  return response.data;
}

export async function getProject(
  projectId
) {
  const response =
    await request(
      `/api/projects/${projectId}`
    );

  return response.data;
}

export async function createProject(
  project
) {
  const response =
    await request(
      "/api/projects",
      {
        method: "POST",

        body:
          JSON.stringify(
            project
          ),
      }
    );

  return response.data;
}

export async function findMemberCandidate(
  projectId,
  email
) {
  const response =
    await request(
      `/api/projects/${projectId}/member-candidate?email=${encodeURIComponent(
        email
      )}`
    );

  return response.data;
}

export async function addProjectMember(
  projectId,
  memberId
) {
  const response =
    await request(
      `/api/projects/${projectId}/members`,
      {
        method: "POST",

        body:
          JSON.stringify({
            memberId,
          }),
      }
    );

  return response.data;
}

export async function removeProjectMember(
  projectId,
  memberId
) {
  const response =
    await request(
      `/api/projects/${projectId}/members/${memberId}`,
      {
        method: "DELETE",
      }
    );

  return response.data;
}