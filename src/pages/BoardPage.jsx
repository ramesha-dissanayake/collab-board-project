import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Navigate,
  useParams,
} from 'react-router-dom';

import {
  getProject,
} from '../api/projectApi';

import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
} from '../api/taskApi';

import Board
  from '../components/Board';

import ConnectionStatus
  from '../components/ConnectionStatus';

import ProjectMembers
  from '../components/ProjectMembers';

import {
  useAuth,
} from '../context/AuthContext';

import {
  cacheProject,
  cacheProjectBoard,
  cacheTask,
  clearCachedProject,
  getCachedProject,
  getCachedProjectTasks,
  removeCachedTask,
} from '../services/localProjectStore';

import {
  getPendingTaskOperationCount,
  queueTaskCreate,
  queueTaskDelete,
  queueTaskUpdate,
  syncPendingTaskOperations,
} from '../services/offlineTaskQueue';

function isNetworkError(
  error,
) {
  return (
    !navigator.onLine ||
    !error?.status
  );
}

export default function BoardPage() {
  const {
    projectId,
  } = useParams();

  const {
    user,
  } = useAuth();

  const [
    project,
    setProject,
  ] = useState(null);

  const [
    tasks,
    setTasks,
  ] = useState([]);

  const [
    query,
    setQuery,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    notFound,
    setNotFound,
  ] = useState(false);

  const [
    connectionStatus,
    setConnectionStatus,
  ] = useState(
    navigator.onLine
      ? 'online'
      : 'offline',
  );

  const [
    pendingCount,
    setPendingCount,
  ] = useState(0);

  const refreshPendingCount =
    useCallback(
      async () => {
        if (
          !user?.id ||
          !projectId
        ) {
          setPendingCount(0);

          return;
        }

        const count =
          await getPendingTaskOperationCount(
            user.id,
            projectId,
          );

        setPendingCount(
          count,
        );
      },
      [
        projectId,
        user?.id,
      ],
    );

  const refreshFromServer =
    useCallback(
      async () => {
        const [
          projectData,
          taskData,
        ] =
          await Promise.all([
            getProject(
              projectId,
            ),

            getProjectTasks(
              projectId,
            ),
          ]);

        setProject(
          projectData,
        );

        setTasks(
          taskData,
        );

        await cacheProjectBoard(
          user?.id,
          projectData,
          taskData,
        );
      },
      [
        projectId,
        user?.id,
      ],
    );

  const syncAndRefresh =
    useCallback(
      async () => {
        if (
          !user?.id ||
          !projectId
        ) {
          return;
        }

        setConnectionStatus(
          'syncing',
        );

        setError('');

        const syncResult =
          await syncPendingTaskOperations(
            user.id,
            projectId,
          );

        if (
          !syncResult.completed &&
          isNetworkError(
            syncResult.error,
          )
        ) {
          setConnectionStatus(
            'offline',
          );

          await refreshPendingCount();

          return;
        }

        if (
          !syncResult.completed
        ) {
          setError(
            syncResult.error
              ?.status === 409
              ? 'A local change could not sync because the server version has changed.'
              : 'Some local changes could not be synchronized yet.',
          );
        }

        try {
          await refreshFromServer();

          setConnectionStatus(
            'online',
          );
        } catch (serverError) {
          if (
            serverError.status ===
            404
          ) {
            await clearCachedProject(
              user.id,
              projectId,
            );

            setNotFound(true);

            return;
          }

          if (
            isNetworkError(
              serverError,
            )
          ) {
            setConnectionStatus(
              'offline',
            );

            return;
          }

          setError(
            serverError.message ||
              'Unable to refresh project board',
          );
        } finally {
          await refreshPendingCount();
        }
      },
      [
        projectId,
        refreshFromServer,
        refreshPendingCount,
        user?.id,
      ],
    );

  useEffect(() => {
    let cancelled =
      false;

    async function loadBoard() {
      try {
        setLoading(true);
        setError('');
        setNotFound(false);

        const [
          cachedProject,
          cachedTasks,
        ] =
          await Promise.all([
            getCachedProject(
              user?.id,
              projectId,
            ),

            getCachedProjectTasks(
              user?.id,
              projectId,
            ),
          ]);

        if (cancelled) {
          return;
        }

        if (cachedProject) {
          setProject(
            cachedProject,
          );

          setTasks(
            cachedTasks,
          );

          setLoading(
            false,
          );
        }

        await refreshPendingCount();

        if (
          !navigator.onLine
        ) {
          setConnectionStatus(
            'offline',
          );

          if (!cachedProject) {
            setError(
              'This board is not available offline yet. Open it once while connected so it can be cached.',
            );
          }

          return;
        }

        await syncAndRefresh();
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBoard();

    return () => {
      cancelled = true;
    };
  }, [
    projectId,
    refreshPendingCount,
    syncAndRefresh,
    user?.id,
  ]);

  useEffect(() => {
    function handleOffline() {
      setConnectionStatus(
        'offline',
      );

      void refreshPendingCount();
    }

    function handleOnline() {
      void syncAndRefresh();
    }

    window.addEventListener(
      'offline',
      handleOffline,
    );

    window.addEventListener(
      'online',
      handleOnline,
    );

    return () => {
      window.removeEventListener(
        'offline',
        handleOffline,
      );

      window.removeEventListener(
        'online',
        handleOnline,
      );
    };
  }, [
    refreshPendingCount,
    syncAndRefresh,
  ]);

  const visibleTasks =
    useMemo(() => {
      const value =
        query
          .trim()
          .toLowerCase();

      if (!value) {
        return tasks;
      }

      return tasks.filter(
        (task) =>
          `${task.title} ${task.description} ${task.assignee}`
            .toLowerCase()
            .includes(
              value,
            ),
      );
    }, [
      query,
      tasks,
    ]);

  async function createOfflineTask(
    payload,
  ) {
    const now =
      new Date().toISOString();

    const localTask = {
      id:
        `local-${crypto.randomUUID()}`,

      projectId,

      ...payload,

      assigneeId:
        user?.id ?? null,

      position:
        payload.position ?? 0,

      version: 0,

      createdAt: now,
      updatedAt: now,

      localOnly: true,
      pendingSync: true,
    };

    setTasks(
      (current) => [
        ...current,
        localTask,
      ],
    );

    await cacheTask(
      user?.id,
      projectId,
      localTask,
      {
        pendingSync: true,
        localOnly: true,
      },
    );

    await queueTaskCreate(
      user?.id,
      projectId,
      localTask,
      payload,
    );

    setConnectionStatus(
      'offline',
    );

    await refreshPendingCount();
  }

  async function handleAddTask() {
    const title =
      window.prompt(
        'Task title',
      );

    if (
      !title?.trim()
    ) {
      return;
    }

    const description =
      window.prompt(
        'Task description',
      ) ?? '';

    const payload = {
      projectId,

      title:
        title.trim(),

      description:
        description.trim(),

      status:
        'todo',

      assignee:
        user?.name ?? '',

      priority:
        'normal',

      position: 0,
    };

    if (
      !navigator.onLine
    ) {
      await createOfflineTask(
        payload,
      );

      return;
    }

    try {
      setError('');

      const task =
        await createTask(
          payload,
        );

      setTasks(
        (current) => [
          ...current,
          task,
        ],
      );

      await cacheTask(
        user?.id,
        projectId,
        task,
      );
    } catch (createError) {
      if (
        isNetworkError(
          createError,
        )
      ) {
        await createOfflineTask(
          payload,
        );

        return;
      }

      setError(
        createError.message ||
          'Unable to create task',
      );
    }
  }

  async function updateTaskOffline(
    task,
    changes,
  ) {
    const updated = {
      ...task,
      ...changes,
      updatedAt:
        new Date().toISOString(),
      pendingSync: true,
    };

    setTasks(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            task.id
              ? updated
              : item,
        ),
    );

    await cacheTask(
      user?.id,
      projectId,
      updated,
      {
        pendingSync: true,
        localOnly:
          Boolean(
            task.localOnly,
          ),
      },
    );

    await queueTaskUpdate(
      user?.id,
      projectId,
      task.id,
      changes,
    );

    setConnectionStatus(
      'offline',
    );

    await refreshPendingCount();
  }

  async function handleStatusChange(
    taskId,
    status,
  ) {
    const task =
      tasks.find(
        (item) =>
          item.id === taskId,
      );

    if (!task) {
      return;
    }

    if (
      !navigator.onLine ||
      task.localOnly
    ) {
      await updateTaskOffline(
        task,
        {
          status,
        },
      );

      return;
    }

    try {
      setError('');

      const updated =
        await updateTask(
          taskId,
          {
            status,
          },
        );

      setTasks(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              taskId
                ? updated
                : item,
          ),
      );

      await cacheTask(
        user?.id,
        projectId,
        updated,
      );
    } catch (updateError) {
      if (
        isNetworkError(
          updateError,
        )
      ) {
        await updateTaskOffline(
          task,
          {
            status,
          },
        );

        return;
      }

      setError(
        updateError.message ||
          'Unable to update task',
      );
    }
  }

  async function deleteTaskOffline(
    task,
  ) {
    await queueTaskDelete(
      user?.id,
      projectId,
      task.id,
    );

    setTasks(
      (current) =>
        current.filter(
          (item) =>
            item.id !== task.id,
        ),
    );

    await removeCachedTask(
      user?.id,
      projectId,
      task.id,
    );

    setConnectionStatus(
      'offline',
    );

    await refreshPendingCount();
  }

  async function handleDelete(
    taskId,
  ) {
    const confirmed =
      window.confirm(
        'Delete this task?',
      );

    if (!confirmed) {
      return;
    }

    const task =
      tasks.find(
        (item) =>
          item.id === taskId,
      );

    if (!task) {
      return;
    }

    if (
      !navigator.onLine ||
      task.localOnly
    ) {
      await deleteTaskOffline(
        task,
      );

      return;
    }

    try {
      setError('');

      await deleteTask(
        taskId,
      );

      setTasks(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              taskId,
          ),
      );

      await removeCachedTask(
        user?.id,
        projectId,
        taskId,
      );
    } catch (deleteError) {
      if (
        isNetworkError(
          deleteError,
        )
      ) {
        await deleteTaskOffline(
          task,
        );

        return;
      }

      setError(
        deleteError.message ||
          'Unable to delete task',
      );
    }
  }

  function handleProjectChange(
    updatedProject,
  ) {
    setProject(
      updatedProject,
    );

    void cacheProject(
      user?.id,
      updatedProject,
    );
  }

  if (notFound) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  if (
    loading &&
    !project
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="font-bold text-stone-500">
          Loading board...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-extrabold text-stone-900">
            Board unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            {error ||
              'Connect to the server once so this board can be saved for offline use.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-stone-50 p-8 font-sans text-stone-800">

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitchTiles'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        <header className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            Project Board
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-stone-900">
            {project.name}
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {project.description}
          </p>
        </header>

        <ConnectionStatus
          status={
            connectionStatus
          }
          pendingCount={
            pendingCount
          }
          onRetry={
            syncAndRefresh
          }
        />

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <ProjectMembers
          project={project}
          currentUser={user}
          onProjectChange={
            handleProjectChange
          }
        />

        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">

          <button
            type="button"
            onClick={
              handleAddTask
            }
            className="flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 font-bold text-stone-700 shadow-sm transition-all hover:border-emerald-600 hover:text-emerald-700 sm:w-auto"
          >
            <span className="text-lg">
              +
            </span>

            Add New Task
          </button>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={query}
              onChange={(
                event
              ) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Search Tasks..."
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

        </div>

        <main>
          <Board
            tasks={
              visibleTasks
            }
            onStatusChange={
              handleStatusChange
            }
            onDelete={
              handleDelete
            }
          />
        </main>

      </div>
    </div>
  );
}