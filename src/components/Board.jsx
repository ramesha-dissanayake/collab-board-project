import Column from './Column';
import { tasksData } from '../data/mockData';

export default function Board({ projectId }) {
  const projectTasks = tasksData.filter(
    (task) => task.projectId === projectId,
  );

  const todoTasks = projectTasks.filter(
    (task) => task.status === 'To Do',
  );

  const doingTasks = projectTasks.filter(
    (task) => task.status === 'Doing',
  );

  const doneTasks = projectTasks.filter(
    (task) => task.status === 'Done',
  );

  return (
    <div className="mt-6 flex w-full flex-col gap-6 lg:flex-row">
      <Column title="To Do" tasks={todoTasks} />
      <Column title="Doing" tasks={doingTasks} />
      <Column title="Done" tasks={doneTasks} />
    </div>
  );
}