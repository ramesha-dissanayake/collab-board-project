import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    register,
    isAuthenticated,
  } = useAuth();

  const [mode, setMode] = useState('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      if (mode === 'register') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      navigate('/profile', {
        replace: true,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function changeMode() {
    setMode((current) =>
      current === 'login' ? 'register' : 'login'
    );

    setError('');
  }

  const isRegister = mode === 'register';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4 font-sans">

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitchTiles'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-stone-900">
            {isRegister
              ? 'Create Account'
              : 'Welcome Back'}
          </h1>

          <p className="text-sm font-medium text-stone-500">
            {isRegister
              ? 'Join your CollabBoard workspace'
              : 'Sign in to your CollabBoard workspace'}
          </p>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
        >

          {isRegister && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                required
                className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 placeholder-stone-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
              className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 placeholder-stone-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
              minLength={isRegister ? 6 : 1}
              className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 placeholder-stone-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-lg bg-emerald-600 py-3 font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Please wait...'
              : isRegister
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-stone-500">
          {isRegister
            ? 'Already have an account? '
            : "Don't have an account? "}

          <button
            type="button"
            onClick={changeMode}
            className="font-bold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            {isRegister
              ? 'Sign in'
              : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}