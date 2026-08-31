import Column from './Column';

export default function Board({
  tasks,
  onStatusChange,
  onDelete,
}) {
  const todoTasks = tasks.filter(
    (task) => task.status === 'todo'
  );

  const doingTasks = tasks.filter(
    (task) => task.status === 'doing'
  );

  const doneTasks = tasks.filter(
    (task) => task.status === 'done'
  );

  return (
    <div className="mt-6 flex w-full flex-col gap-6 lg:flex-row">

      <Column
        title="To Do"
        tasks={todoTasks}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

      <Column
        title="Doing"
        tasks={doingTasks}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

      <Column
        title="Done"
        tasks={doneTasks}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

    </div>
  );
}