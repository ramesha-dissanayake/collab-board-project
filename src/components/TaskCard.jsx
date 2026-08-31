export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
}) {
  const {
    id,
    title,
    description,
    status,
    assignee,
    priority,
    updatedAt,
  } = task;

  const initials = assignee
    ? assignee
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className="group rounded-lg border border-stone-200 bg-white p-4 transition-all duration-200 hover:border-emerald-400 hover:shadow-md">

      <div className="flex items-start justify-between gap-3">

        <h3 className="text-base font-bold text-stone-800 transition-colors group-hover:text-emerald-700">
          {title}
        </h3>

        <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-extrabold uppercase text-stone-500">
          {priority}
        </span>

      </div>

      {description && (
        <p className="mb-4 mt-1 line-clamp-2 text-sm font-medium text-stone-500">
          {description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">

        <div className="flex items-center gap-2">

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-[10px] font-extrabold text-white">
            {initials}
          </span>

          <span className="max-w-28 truncate text-xs font-semibold text-stone-500">
            {assignee || 'Unassigned'}
          </span>

        </div>

        <span className="text-[10px] font-medium text-stone-400">
          {updatedAt
            ? new Date(updatedAt).toLocaleDateString()
            : ''}
        </span>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">

        {status === 'todo' && (
          <button
            type="button"
            onClick={() =>
              onStatusChange(id, 'doing')
            }
            className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100"
          >
            Start
          </button>
        )}

        {status === 'doing' && (
          <>
            <button
              type="button"
              onClick={() =>
                onStatusChange(id, 'todo')
              }
              className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-200"
            >
              To Do
            </button>

            <button
              type="button"
              onClick={() =>
                onStatusChange(id, 'done')
              }
              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
            >
              Complete
            </button>
          </>
        )}

        {status === 'done' && (
          <button
            type="button"
            onClick={() =>
              onStatusChange(id, 'todo')
            }
            className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-200"
          >
            Reopen
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(id)}
          className="ml-auto rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

      </div>
    </div>
  );
}