import React from 'react';

function TaskCard({ title, description, createdAt, timeSpent }) {
  return (
    <div className="task-card">
      <h3 className="task-title">{title}</h3>
      {description && <p className="task-desc">{description}</p>}
      
      {/* Analytics Data Preparation (For later metrics dashboard) */}
      <div className="task-analytics">
        <small>Created: {createdAt}</small>
        {timeSpent && <small>Time: {timeSpent}h</small>}
      </div>

      {/* Real-Time WebSocket Placeholder (For M5 live-sync) */}
      <div className="task-realtime-placeholder">
        <span className="typist-indicator">💬 [UI: Active Typist Bubble]</span>
      </div>
    </div>
  );
}

export default TaskCard;