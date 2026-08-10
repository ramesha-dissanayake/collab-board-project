import React from 'react';
import TaskCard from './TaskCard'; // Import the TaskCard component

function Column({ title, tasks }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      
      <div className="task-list">
        {/* Loop through the tasks and render a TaskCard for each one */}
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            title={task.title}
            description={task.description}
            createdAt={task.createdAt}
            timeSpent={task.timeSpent}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;