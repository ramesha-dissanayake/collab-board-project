import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icons';

const statusStyles = {
  Ongoing: 'bg-amber-50 text-amber-700 ring-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}/board`}
      className="block"
      aria-label={`Open ${project.name} board`}
    >
      <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-stone-900">
              {project.name}
            </h3>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              {project.description}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusStyles[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-bold text-stone-500">
          <span>Started {project.startedMonth}</span>
          <span>{project.progress}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex -space-x-2">
            {project.members.map((member, index) => (
              <span
                key={member}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-stone-800 text-[10px] font-extrabold text-white"
                style={{ zIndex: project.members.length - index }}
              >
                {member}
              </span>
            ))}
          </div>

          <span className="text-xs font-extrabold text-emerald-700">
            Open board →
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function ProjectList({ projects }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [month, setMonth] = useState('All');

  const months = [...new Set(projects.map((project) => project.startedMonth))];
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesQuery = project.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = status === 'All' || project.status === status;
    const matchesMonth = month === 'All' || project.startedMonth === month;
    return matchesQuery && matchesStatus && matchesMonth;
  }), [month, projects, query, status]);

  return (
    <section className="mt-8" aria-labelledby="projects-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Workspace</p>
          <h2 id="projects-title" className="mt-1 text-2xl font-extrabold text-stone-900">Your projects</h2>
        </div>
        <span className="text-sm font-bold text-stone-400">{filtered.length} shown</span>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="relative">
          <Icon name="search" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm font-medium text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Search projects by name" aria-label="Search projects by name" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:flex">
          <label className="sr-only" htmlFor="project-status">Filter by status</label>
          <select id="project-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-bold text-stone-600 outline-none focus:border-emerald-500">
            <option>All</option><option>Ongoing</option><option>Completed</option>
          </select>
          <label className="sr-only" htmlFor="project-month">Filter by started month</label>
          <select id="project-month" value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-bold text-stone-600 outline-none focus:border-emerald-500">
            <option>All</option>{months.map((item) => <option key={item}>{item}</option>)}
          </select>
          {(query || status !== 'All' || month !== 'All') && <button type="button" onClick={() => { setQuery(''); setStatus('All'); setMonth('All'); }} className="col-span-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 sm:ml-auto">Clear filters</button>}
        </div>
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center">
          <p className="font-extrabold text-stone-800">No matching projects</p>
          <p className="mt-1 text-sm text-stone-500">Try another name, status or month.</p>
        </div>
      )}
    </section>
  );
}
