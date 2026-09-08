import {
  createTask,
  deleteTask,
  updateTask,
} from '../api/taskApi';

import {
  getLocalDocument,
  listLocalDocumentsByPrefix,
  putLocalDocument,
  removeLocalDocument,
} from '../db/localDb';

import {
  cacheTask,
  removeCachedTask,
} from './localProjectStore';

function safeSegment(
  value,
) {
  return String(value)
    .replace(
      /[^a-zA-Z0-9_-]/g,
      '_',
    );
}

function queueDocId(
  userId,
  projectId,
  taskId,
) {
  return `queue:${safeSegment(
    userId,
  )}:${projectId}:${taskId}`;
}

function queuePrefix(
  userId,
  projectId,
) {
  return `queue:${safeSegment(
    userId,
  )}:${projectId}:`;
}

function conflictDetails(
  error,
) {
  return (
    error?.details ??
    error?.data?.error
      ?.details ??
    error?.response?.error
      ?.details ??
    null
  );
}

function valuesEqual(
  first,
  second,
) {
  return (
    JSON.stringify(first) ===
    JSON.stringify(second)
  );
}

function canFieldMerge(
  baseTask,
  currentTask,
  changes,
) {
  if (
    !baseTask ||
    !currentTask
  ) {
    return false;
  }

  return Object.keys(
    changes
  ).every(
    (field) =>
      valuesEqual(
        baseTask[field],
        currentTask[field],
      ),
  );
}

async function getQueueDocument(
  userId,
  projectId,
  taskId,
) {
  try {
    return await getLocalDocument(
      queueDocId(
        userId,
        projectId,
        taskId,
      ),
    );
  } catch {
    return null;
  }
}

export async function queueTaskCreate(
  userId,
  projectId,
  localTask,
  payload,
) {
  await putLocalDocument(
    queueDocId(
      userId,
      projectId,
      localTask.id,
    ),
    {
      type:
        'task-operation',

      operation:
        'create',

      userId,
      projectId,

      taskId:
        localTask.id,

      payload,

      createdAt:
        new Date()
          .toISOString(),
    },
  );
}

export async function queueTaskUpdate(
  userId,
  projectId,
  taskId,
  changes,
  baseTask,
) {
  const existing =
    await getQueueDocument(
      userId,
      projectId,
      taskId,
    );

  if (
    existing?.operation ===
    'create'
  ) {
    await putLocalDocument(
      existing._id,
      {
        ...existing,

        payload: {
          ...existing.payload,
          ...changes,
        },
      },
    );

    return;
  }

  if (
    existing?.operation ===
    'delete'
  ) {
    return;
  }

  await putLocalDocument(
    queueDocId(
      userId,
      projectId,
      taskId,
    ),
    {
      type:
        'task-operation',

      operation:
        'update',

      userId,
      projectId,
      taskId,

      payload: {
        ...(existing?.payload ??
          {}),
        ...changes,
      },

      baseVersion:
        existing?.baseVersion ??
        baseTask?.version ??
        0,

      baseTask:
        existing?.baseTask ??
        baseTask,

      createdAt:
        existing?.createdAt ??
        new Date()
          .toISOString(),
    },
  );
}

export async function queueTaskDelete(
  userId,
  projectId,
  taskId,
) {
  const existing =
    await getQueueDocument(
      userId,
      projectId,
      taskId,
    );

  if (
    existing?.operation ===
    'create'
  ) {
    await removeLocalDocument(
      existing._id,
    );

    return {
      cancelledLocalCreate:
        true,
    };
  }

  await putLocalDocument(
    queueDocId(
      userId,
      projectId,
      taskId,
    ),
    {
      type:
        'task-operation',

      operation:
        'delete',

      userId,
      projectId,
      taskId,

      payload: {},

      createdAt:
        existing?.createdAt ??
        new Date()
          .toISOString(),
    },
  );

  return {
    cancelledLocalCreate:
      false,
  };
}

export async function listPendingTaskOperations(
  userId,
  projectId,
) {
  if (
    !userId ||
    !projectId
  ) {
    return [];
  }

  const documents =
    await listLocalDocumentsByPrefix(
      queuePrefix(
        userId,
        projectId,
      ),
    );

  return documents.sort(
    (first, second) =>
      String(
        first.createdAt,
      ).localeCompare(
        String(
          second.createdAt,
        ),
      ),
  );
}

export async function getPendingTaskOperationCount(
  userId,
  projectId,
) {
  const operations =
    await listPendingTaskOperations(
      userId,
      projectId,
    );

  return operations.length;
}

export async function removePendingTaskOperation(
  userId,
  projectId,
  taskId,
) {
  const existing =
    await getQueueDocument(
      userId,
      projectId,
      taskId,
    );

  if (!existing) {
    return false;
  }

  await removeLocalDocument(
    existing._id,
  );

  return true;
}

export async function syncPendingTaskOperations(
  userId,
  projectId,
) {
  const operations =
    await listPendingTaskOperations(
      userId,
      projectId,
    );

  for (
    const operation
    of operations
  ) {
    try {
      if (
        operation.operation ===
        'create'
      ) {
        const created =
          await createTask(
            operation.payload,
          );

        await removeCachedTask(
          userId,
          projectId,
          operation.taskId,
        );

        await cacheTask(
          userId,
          projectId,
          created,
        );
      }

      if (
        operation.operation ===
        'update'
      ) {
        try {
          const updated =
            await updateTask(
              operation.taskId,
              {
                ...operation.payload,

                baseVersion:
                  operation.baseVersion,
              },
            );

          await cacheTask(
            userId,
            projectId,
            updated,
          );
        } catch (error) {
          if (
            error?.status !==
            409
          ) {
            throw error;
          }

          const details =
            conflictDetails(
              error,
            );

          const current =
            details?.current;

          if (
            current &&
            canFieldMerge(
              operation.baseTask,
              current,
              operation.payload,
            )
          ) {
            const merged =
              await updateTask(
                operation.taskId,
                {
                  ...operation.payload,

                  baseVersion:
                    current.version,
                },
              );

            await cacheTask(
              userId,
              projectId,
              merged,
            );
          } else {
            return {
              completed: false,
              error,
              operation,
            };
          }
        }
      }

      if (
        operation.operation ===
        'delete'
      ) {
        await deleteTask(
          operation.taskId,
        );

        await removeCachedTask(
          userId,
          projectId,
          operation.taskId,
        );
      }

      await removeLocalDocument(
        operation._id,
      );
    } catch (error) {
      return {
        completed: false,
        error,
        operation,
      };
    }
  }

  return {
    completed: true,
    error: null,
    operation: null,
  };
}