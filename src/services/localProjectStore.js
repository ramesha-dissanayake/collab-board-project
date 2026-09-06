import {
  getLocalDocument,
  listLocalDocumentsByPrefix,
  projectDocId,
  putLocalDocument,
  removeLocalDocument,
  taskDocId,
  taskDocPrefix,
} from '../db/localDb';

function cleanLocalDocument(
  document,
) {
  if (!document) {
    return null;
  }

  const value = {
    ...document,
  };

  delete value._id;
  delete value._rev;
  delete value.type;
  delete value.serverId;
  delete value.cachedAt;

  return value;
}

export async function cacheProject(
  userId,
  project,
) {
  if (
    !userId ||
    !project?.id
  ) {
    return false;
  }

  try {
    await putLocalDocument(
      projectDocId(
        userId,
        project.id,
      ),
      {
        type: 'project',
        serverId: project.id,
        ...project,
      },
    );

    return true;
  } catch {
    return false;
  }
}

export async function getCachedProject(
  userId,
  projectId,
) {
  if (
    !userId ||
    !projectId
  ) {
    return null;
  }

  try {
    const document =
      await getLocalDocument(
        projectDocId(
          userId,
          projectId,
        ),
      );

    return cleanLocalDocument(
      document,
    );
  } catch {
    return null;
  }
}

export async function cacheTask(
  userId,
  projectId,
  task,
  {
    pendingSync = false,
    localOnly = false,
  } = {},
) {
  if (
    !userId ||
    !projectId ||
    !task?.id
  ) {
    return false;
  }

  try {
    await putLocalDocument(
      taskDocId(
        userId,
        projectId,
        task.id,
      ),
      {
        type: 'task',
        serverId: task.id,
        ...task,
        pendingSync,
        localOnly,
      },
    );

    return true;
  } catch {
    return false;
  }
}

export async function cacheProjectTasks(
  userId,
  projectId,
  tasks,
) {
  if (
    !userId ||
    !projectId
  ) {
    return false;
  }

  try {
    const prefix =
      taskDocPrefix(
        userId,
        projectId,
      );

    const existing =
      await listLocalDocumentsByPrefix(
        prefix,
      );

    const existingByServerId =
      new Map(
        existing.map(
          (document) => [
            document.serverId,
            document,
          ],
        ),
      );

    const serverTaskIds =
      new Set(
        tasks.map(
          (task) => task.id,
        ),
      );

    await Promise.all(
      tasks.map(
        async (task) => {
          const current =
            existingByServerId.get(
              task.id,
            );

          if (
            current?.pendingSync
          ) {
            return;
          }

          await cacheTask(
            userId,
            projectId,
            task,
          );
        },
      ),
    );

    const staleDocuments =
      existing.filter(
        (document) =>
          !document.pendingSync &&
          !document.localOnly &&
          !serverTaskIds.has(
            document.serverId,
          ),
      );

    await Promise.all(
      staleDocuments.map(
        (document) =>
          removeLocalDocument(
            document._id,
          ),
      ),
    );

    return true;
  } catch {
    return false;
  }
}

export async function getCachedProjectTasks(
  userId,
  projectId,
) {
  if (
    !userId ||
    !projectId
  ) {
    return [];
  }

  try {
    const documents =
      await listLocalDocumentsByPrefix(
        taskDocPrefix(
          userId,
          projectId,
        ),
      );

    return documents
      .map(
        cleanLocalDocument,
      )
      .filter(Boolean)
      .sort(
        (first, second) =>
          (
            first.position ??
            0
          ) -
          (
            second.position ??
            0
          ),
      );
  } catch {
    return [];
  }
}

export async function removeCachedTask(
  userId,
  projectId,
  taskId,
) {
  if (
    !userId ||
    !projectId ||
    !taskId
  ) {
    return false;
  }

  try {
    return await removeLocalDocument(
      taskDocId(
        userId,
        projectId,
        taskId,
      ),
    );
  } catch {
    return false;
  }
}

export async function cacheProjectBoard(
  userId,
  project,
  tasks,
) {
  if (
    !userId ||
    !project?.id
  ) {
    return false;
  }

  const [
    projectSaved,
    tasksSaved,
  ] = await Promise.all([
    cacheProject(
      userId,
      project,
    ),

    cacheProjectTasks(
      userId,
      project.id,
      tasks,
    ),
  ]);

  return (
    projectSaved &&
    tasksSaved
  );
}

export async function clearCachedProject(
  userId,
  projectId,
) {
  if (
    !userId ||
    !projectId
  ) {
    return false;
  }

  try {
    await removeLocalDocument(
      projectDocId(
        userId,
        projectId,
      ),
    );

    const taskDocuments =
      await listLocalDocumentsByPrefix(
        taskDocPrefix(
          userId,
          projectId,
        ),
      );

    await Promise.all(
      taskDocuments.map(
        (document) =>
          removeLocalDocument(
            document._id,
          ),
      ),
    );

    return true;
  } catch {
    return false;
  }
}