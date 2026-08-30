import { Navigate, useParams } from 'react-router-dom';

import Board from '../components/Board';
import { projectsData } from '../data/profileData';

export default function BoardPage() {
  const { projectId } = useParams();

  const project = projectsData.find(
    (item) => item.id === projectId,
  );

  if (!project) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="relative min-h-screen bg-stone-50 p-8 font-sans text-stone-800">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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

        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 font-bold text-stone-700 shadow-sm transition-all hover:border-emerald-600 hover:text-emerald-700 sm:w-auto"
          >
            <span className="text-lg">+</span>
            Add New Task
          </button>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search Tasks..."
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <main>
          <Board projectId={project.id} />
        </main>
      </div>
    </div>
  );
}