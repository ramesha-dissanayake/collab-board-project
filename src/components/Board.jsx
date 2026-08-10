import React from 'react';
import Column from './Column';
import { tasksData } from '../data/mockData'; // Import the mock data

function Board() {
  // Filter the data into three arrays based on their status
  const todoTasks = tasksData.filter(task => task.status === 'To Do');
  const doingTasks = tasksData.filter(task => task.status === 'Doing');
  const doneTasks = tasksData.filter(task => task.status === 'Done');

  return (
    <div className="board">
      {/* Pass the filtered arrays as a new 'tasks' prop to each Column */}
      <Column title="To Do" tasks={todoTasks} />
      <Column title="Doing" tasks={doingTasks} />
      <Column title="Done" tasks={doneTasks} />
    </div>
  );
}

export default Board;