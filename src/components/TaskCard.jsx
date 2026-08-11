import React from 'react';

export default function TaskCard({ title, description, createdAt, timeSpent, userPhoto, activityBadge }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer group">
      
      <h3 className="font-bold text-stone-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">{title}</h3>
      {description && <p className="text-stone-500 text-sm mb-4 line-clamp-2 font-medium">{description}</p>}
      
      <div className="flex justify-between items-end text-xs text-stone-400 border-t border-stone-100 pt-3 mt-2">
        
        <div className="flex items-center gap-2">
          <img src={userPhoto} alt="Assignee" className="w-8 h-8 rounded-full border border-stone-200 object-cover" />
          
          {activityBadge === 'typing' && (
            <span className="flex items-center gap-1 bg-stone-100 text-stone-600 px-2 py-1 rounded-full border border-stone-200 font-bold">
               <span className="animate-pulse">●●●</span> Typing
            </span>
          )}
          {activityBadge === 'checkmark' && (
            <span className="flex items-center justify-center bg-emerald-50 text-emerald-600 w-6 h-6 rounded-full border border-emerald-200 font-bold">
               ✓
            </span>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 font-mono text-[10px] tracking-wider text-stone-500">
          <span>{createdAt}</span>
          {timeSpent && <span>{timeSpent}H</span>}
        </div>

      </div>
    </div>
  );
}