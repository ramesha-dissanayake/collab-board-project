import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-20 pt-16 lg:px-8">
        <div className="mb-32 mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Collaborative Task Workspace
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-stone-900 md:text-6xl lg:text-7xl">
              Organize Teamwork
              <span className="mt-2 block text-emerald-600">
                In One Place
              </span>
            </h1>

            <p className="mb-10 text-lg font-medium leading-relaxed text-stone-500 md:text-xl">
              Organize projects, track task progress, and keep your team
              focused with a simple collaborative workspace.
            </p>

            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <Link
                to="/profile"
                className="w-full rounded-lg bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                View Projects
              </Link>

              <Link
                to="/login"
                className="w-full rounded-lg border border-stone-200 bg-white px-8 py-4 text-lg font-bold text-stone-700 shadow-sm transition-colors duration-200 hover:border-emerald-600 hover:text-emerald-700 sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-stone-200/60 shadow-xl transition-transform duration-500 hover:rotate-0 lg:h-[550px] lg:-rotate-1">
            <img
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"
              alt="Team workspace"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />

            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]" />
          </div>
        </div>

        <div className="border-t border-stone-200 pt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-stone-900">
                About the Project
              </h2>

              <p className="mb-6 text-sm font-bold uppercase tracking-widest text-emerald-600">
                Built for Collaboration
              </p>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-stone-600">
              <p>
                CollabBoard is a collaborative task management application
                designed to help teams organize project work in a clear and
                structured way.
              </p>

              <p>
                Team members can work with project boards that organize tasks
                across To Do, Doing, and Done stages, making it easier to
                understand current progress and responsibilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}