import React from 'react';

function TaskCard({ title, description, priority }) {
  return (
    <div className={`task-card priority-${priority}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="task-priority">{priority}</span>
    </div>
  );
}

export default TaskCard;