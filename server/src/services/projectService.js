import {
  projectRepository,
} from "../repositories/projectRepository.js";

import {
  publicUser,
  userRepository,
} from "../repositories/userRepository.js";

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../utils/AppError.js";

function canAccess(
  project,
  userId
) {
  return (
    project.ownerId === userId ||
    project.memberIds?.includes(
      userId
    )
  );
}

function isOwner(
  project,
  userId
) {
  return (
    project.ownerId === userId
  );
}

async function withMemberDetails(
  project
) {
  const members =
    await Promise.all(
      (
        project.memberIds ?? []
      ).map(
        (memberId) =>
          userRepository.findById(
            memberId
          )
      )
    );

  return {
    ...project,

    members: members
      .filter(Boolean)
      .map((user) => ({
        ...publicUser(user),

        role:
          user.id ===
          project.ownerId
            ? "owner"
            : "member",
      })),
  };
}

export async function listProjects(
  userId
) {
  const projects =
    await projectRepository.findAll();

  const accessibleProjects =
    projects.filter(
      (project) =>
        canAccess(
          project,
          userId
        )
    );

  return Promise.all(
    accessibleProjects.map(
      withMemberDetails
    )
  );
}

export async function getProject(
  projectId,
  userId
) {
  const project =
    await projectRepository.findById(
      projectId
    );

  if (!project) {
    throw new NotFoundError(
      "Project"
    );
  }

  if (
    !canAccess(
      project,
      userId
    )
  ) {
    throw new ForbiddenError();
  }

  return withMemberDetails(
    project
  );
}

export async function createProject(
  data,
  userId
) {
  const project =
    await projectRepository.create({
      ...data,
      ownerId: userId,
    });

  return withMemberDetails(
    project
  );
}

export async function findMemberCandidate(
  projectId,
  email,
  userId
) {
  const project =
    await projectRepository.findById(
      projectId
    );

  if (!project) {
    throw new NotFoundError(
      "Project"
    );
  }

  if (
    !isOwner(
      project,
      userId
    )
  ) {
    throw new ForbiddenError(
      "Only the project owner can search for members"
    );
  }

  const member =
    await userRepository.findByEmail(
      email
    );

  if (!member) {
    throw new NotFoundError(
      "User"
    );
  }

  return {
    ...publicUser(member),

    alreadyMember:
      project.memberIds.includes(
        member.id
      ),
  };
}

export async function addProjectMember(
  projectId,
  memberId,
  userId
) {
  const project =
    await projectRepository.findById(
      projectId
    );

  if (!project) {
    throw new NotFoundError(
      "Project"
    );
  }

  if (
    !isOwner(
      project,
      userId
    )
  ) {
    throw new ForbiddenError(
      "Only the project owner can add members"
    );
  }

  const member =
    await userRepository.findById(
      memberId
    );

  if (!member) {
    throw new NotFoundError(
      "User"
    );
  }

  if (
    project.memberIds.includes(
      memberId
    )
  ) {
    throw new ConflictError(
      "This user is already a project member"
    );
  }

  const updatedProject =
    await projectRepository.addMember(
      projectId,
      memberId
    );

  return withMemberDetails(
    updatedProject
  );
}

export async function removeProjectMember(
  projectId,
  memberId,
  userId
) {
  const project =
    await projectRepository.findById(
      projectId
    );

  if (!project) {
    throw new NotFoundError(
      "Project"
    );
  }

  if (
    !isOwner(
      project,
      userId
    )
  ) {
    throw new ForbiddenError(
      "Only the project owner can remove members"
    );
  }

  if (
    memberId ===
    project.ownerId
  ) {
    throw new ForbiddenError(
      "The project owner cannot be removed"
    );
  }

  if (
    !project.memberIds.includes(
      memberId
    )
  ) {
    throw new NotFoundError(
      "Project member"
    );
  }

  const updatedProject =
    await projectRepository.removeMember(
      projectId,
      memberId
    );

  return withMemberDetails(
    updatedProject
  );
}

export async function ensureProjectAccess(
  projectId,
  userId
) {
  return getProject(
    projectId,
    userId
  );
}