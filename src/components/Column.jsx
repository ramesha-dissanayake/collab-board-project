import React from 'react';
import TaskCard from './TaskCard'; 

export default function Column({ title, tasks }) {
  return (
    <div className="flex-1 min-w-[300px] bg-stone-100/50 rounded-xl p-4 border border-stone-200 shadow-sm">
      <div className="flex justify-between items-center mb-5 mt-1">
        <h2 className="font-bold text-stone-700 uppercase text-sm tracking-widest">{title}</h2>
        <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 min-h-[100px]">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            {...task}
          />
        ))}
      </div>
    </div>
  );
}