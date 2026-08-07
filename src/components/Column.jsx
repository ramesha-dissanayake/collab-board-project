import React from 'react';
import TaskCard from './TaskCard'; // ADD THIS IMPORT

function Column({ title }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      
      <div className="task-list">
        {/* Replace placeholder text with TaskCard components */}
        <TaskCard 
          title="Setup Project Repository" 
          description="Initialize Git and push initial project files." 
          priority="high" 
        />
        <TaskCard 
          title="Design UI Layout" 
          description="Build wireframes and component structure." 
          priority="medium" 
        />
      </div>
    </div>
  );
}

export default Column;