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
      type: 'task-operation',
      operation: 'create',
      userId,
      projectId,
      taskId: localTask.id,
      payload,
      createdAt:
        new Date().toISOString(),
    },
  );
}

export async function queueTaskUpdate(
  userId,
  projectId,
  taskId,
  changes,
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
      type: 'task-operation',
      operation: 'update',
      userId,
      projectId,
      taskId,
      payload: {
        ...(existing?.payload ??
          {}),
        ...changes,
      },
      createdAt:
        existing?.createdAt ??
        new Date().toISOString(),
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
      type: 'task-operation',
      operation: 'delete',
      userId,
      projectId,
      taskId,
      payload: {},
      createdAt:
        existing?.createdAt ??
        new Date().toISOString(),
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
        const updated =
          await updateTask(
            operation.taskId,
            operation.payload,
          );

        await cacheTask(
          userId,
          projectId,
          updated,
        );
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
      };
    }
  }

  return {
    completed: true,
    error: null,
  };
}