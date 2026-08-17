
export default function Login() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans relative">
      
      {/* Subtle paper texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none z-0" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-sm relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-stone-500 text-sm font-medium">Sign in to your CollabBoard workspace</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          
          <div className="flex flex-col gap-1">
            <label className="text-stone-600 text-xs font-bold tracking-wide uppercase">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="bg-stone-50 text-stone-900 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-stone-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-stone-600 text-xs font-bold tracking-wide uppercase flex justify-between">
              Password
              <a href="#" className="text-emerald-600 hover:text-emerald-700 normal-case text-xs">Forgot?</a>
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="bg-stone-50 text-stone-900 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-stone-400"
            />
          </div>

          <button 
            type="submit" 
            className="mt-4 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-stone-500 font-medium">
          Don't have an account? <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Create one</a>
        </p>
      </div>
    </div>
  );
}