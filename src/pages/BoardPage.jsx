import { useEffect, useMemo, useState } from 'react';
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

import Board from '../components/Board';
import ProjectMembers from '../components/ProjectMembers';

import {
  useAuth,
} from '../context/AuthContext';

export default function BoardPage() {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        setError('');
        setNotFound(false);

        const [projectData, taskData] =
          await Promise.all([
            getProject(projectId),
            getProjectTasks(projectId),
          ]);

        setProject(projectData);
        setTasks(taskData);
      } catch (err) {
        if (err.status === 404) {
          setNotFound(true);
          return;
        }

        setError(
          err.message ||
            'Unable to load project board',
        );
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [projectId]);

  const visibleTasks = useMemo(() => {
    const value = query
      .trim()
      .toLowerCase();

    if (!value) {
      return tasks;
    }

    return tasks.filter((task) =>
      `${task.title} ${task.description} ${task.assignee}`
        .toLowerCase()
        .includes(value),
    );
  }, [query, tasks]);

  async function handleAddTask() {
    const title =
      window.prompt(
        'Task title',
      );

    if (!title?.trim()) {
      return;
    }

    const description =
      window.prompt(
        'Task description',
      ) ?? '';

    try {
      setError('');

      const task =
        await createTask({
          projectId,
          title: title.trim(),
          description:
            description.trim(),
          status: 'todo',
          assignee:
            user?.name ?? '',
          priority: 'normal',
        });

      setTasks((current) => [
        ...current,
        task,
      ]);
    } catch (err) {
      setError(
        err.message ||
          'Unable to create task',
      );
    }
  }

  async function handleStatusChange(
    taskId,
    status,
  ) {
    try {
      setError('');

      const updated =
        await updateTask(
          taskId,
          {
            status,
          },
        );

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? updated
            : task,
        ),
      );
    } catch (err) {
      setError(
        err.message ||
          'Unable to update task',
      );
    }
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

    try {
      setError('');

      await deleteTask(taskId);

      setTasks((current) =>
        current.filter(
          (task) =>
            task.id !== taskId,
        ),
      );
    } catch (err) {
      setError(
        err.message ||
          'Unable to delete task',
      );
    }
  }

  if (notFound) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="font-bold text-stone-500">
          Loading board...
        </p>
      </div>
    );
  }

  if (!project) {
    return null;
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

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <ProjectMembers
          project={project}
          currentUser={user}
          onProjectChange={setProject}
        />

        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">

          <button
            type="button"
            onClick={handleAddTask}
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
              onChange={(event) =>
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
            tasks={visibleTasks}
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