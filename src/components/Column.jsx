import TaskCard from './TaskCard';

export default function Column({
  title,
  tasks,
  onStatusChange,
  onDelete,
}) {
  return (
    <div className="min-w-[300px] flex-1 rounded-xl border border-stone-200 bg-stone-100/50 p-4 shadow-sm">

      <div className="mb-5 mt-1 flex items-center justify-between">

        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-700">
          {title}
        </h2>

        <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
          {tasks.length}
        </span>
      </div>

      <div className="flex min-h-[100px] flex-col gap-3">

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white/60 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-stone-400">
              No tasks yet
            </p>
          </div>
        )}

      </div>
    </div>
  );
}