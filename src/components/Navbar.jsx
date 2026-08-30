import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'border-b-2 border-emerald-400 text-emerald-400'
      : 'text-stone-400 transition-colors hover:text-stone-200';

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/95 px-4 py-4 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-white"
        >
          Collab<span className="text-emerald-500">Board</span>
        </Link>

        <div className="flex gap-4 text-sm font-medium sm:gap-6">
          <Link
            to="/"
            className={`pb-1 ${isActive('/')}`}
          >
            Home
          </Link>

          <Link
            to="/profile"
            className={`pb-1 ${isActive('/profile')}`}
          >
            Projects
          </Link>
        </div>

        <Link
          to="/login"
          className="rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm font-bold text-stone-300 shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-400 sm:px-4"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}