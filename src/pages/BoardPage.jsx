import Board from '../components/Board'; 

export default function BoardPage() {
  return (
    <div className="bg-stone-50 min-h-screen p-8 font-sans text-stone-800 relative">
      
      {/* Subtle Texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none z-0" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            CollabBoard Workspace
          </h1>
          <p className="text-stone-500 mt-1 text-sm uppercase tracking-wider font-bold">Project Management Dashboard</p>
        </header>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <button className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-lg hover:border-emerald-600 hover:text-emerald-700 shadow-sm transition-all w-full sm:w-auto font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Task
          </button>

          <div className="relative w-full sm:w-72">
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search Tasks..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all text-sm font-medium"
            />
          </div>
        </div>

        <main>
          <Board />
        </main>
      </div>
    </div>
  );
}