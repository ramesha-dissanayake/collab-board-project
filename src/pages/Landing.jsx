import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-800">
      
      {/* Ultra-subtle paper texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none z-0" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col pt-16 pb-20">
        
        {/* --- TWO-COLUMN HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-32 mt-8">
          
          {/* Left Column: Text and Buttons */}
          <div className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Workspace is Live
            </div>

            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight mb-6 leading-tight">
              Manage Tasks at
              {/* Adding 'block' forces this span to neatly drop to its own line */}
              <span className="text-emerald-600 block mt-2">
                Speed of Light
              </span>
            </h1>


            <p className="text-stone-500 text-lg md:text-xl mb-10 font-medium leading-relaxed">
              A bespoke, high-performance workspace for your team. 
              Organize your workflow, track your data, and ship faster without the visual clutter.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link 
                to="/board" 
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-lg"
              >
                Enter Workspace
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-white border border-stone-200 text-stone-700 font-bold rounded-lg hover:border-emerald-600 hover:text-emerald-700 shadow-sm transition-colors duration-200 text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Column: Featured Image */}
          <div className="relative w-full h-[400px] lg:h-[550px] rounded-2xl overflow-hidden shadow-xl border border-stone-200/60 transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* The Image */}
            <img 
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80" 
              alt="Minimalist workspace" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Emerald Color Overlay (Multiplies over the image to match your brand) */}
            <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply"></div>
            {/* Inner glow/shadow for a premium inset look */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] rounded-2xl"></div>
          </div>

        </div>

        {/* --- ABOUT US SECTION --- */}
        <div className="border-t border-stone-200 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-4">About the Project</h2>
              <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-6">Designed for Focus</p>
            </div>
            
            <div className="text-stone-600 text-lg leading-relaxed space-y-6">
              <p>
                CollabBoard was built from the ground up to solve a simple problem: modern project management tools have become too cluttered, too slow, and too distracting. We needed a workspace that gets out of the way so the work can actually get done.
              </p>
              <p>
                By prioritizing a clean, minimalist user interface and lightning-fast state management, this application ensures that tracking your milestones, managing daily tasks, and collaborating with your team feels effortless. No unnecessary features, just pure productivity.
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}