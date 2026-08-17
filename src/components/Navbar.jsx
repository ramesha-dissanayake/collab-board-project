import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  // Updated active state for a dark background (using brighter emerald and stone-400)
  const isActive = (path) => location.pathname === path 
    ? "text-emerald-400 border-b-2 border-emerald-400" 
    : "text-stone-400 hover:text-stone-200 transition-colors";

  return (
    // Deep stone background with a subtle dark border
    <nav className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* White text for the logo to pop against the dark background */}
        <Link to="/" className="text-xl font-extrabold text-white tracking-tight">
          Collab<span className="text-emerald-500">Board</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 font-medium text-sm">
          <Link to="/" className={`pb-1 ${isActive('/')}`}>Home</Link>
          <Link to="/board" className={`pb-1 ${isActive('/board')}`}>Board</Link>
          <Link to="/profile" className={`pb-1 ${isActive('/profile')}`}>Profile</Link>
        </div>

        {/* Dark theme button that glows emerald on hover */}
        <div>
          <Link to="/login" className="bg-stone-900 border border-stone-700 text-stone-300 px-4 py-2 rounded-md text-sm font-bold hover:border-emerald-500 hover:text-emerald-400 shadow-sm transition-all">
            Sign In
          </Link>
        </div>

      </div>
    </nav>
  );
}