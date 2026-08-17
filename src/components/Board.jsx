import Column from './Column';
import { tasksData } from '../data/mockData'; 

export default function Board() {
  const todoTasks = tasksData.filter(task => task.status === 'To Do');
  const doingTasks = tasksData.filter(task => task.status === 'Doing');
  const doneTasks = tasksData.filter(task => task.status === 'Done');

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
      <Column title="To Do" tasks={todoTasks} />
      <Column title="Doing" tasks={doingTasks} />
      <Column title="Done" tasks={doneTasks} />
    </div>
  );
}