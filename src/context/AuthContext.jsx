/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../api/authApi.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'collabboard-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  async function refreshUser() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const result = await loginUser({
      email,
      password,
    });

    localStorage.setItem(
      TOKEN_KEY,
      result.token,
    );

    setUser(result.user);

    return result.user;
  }

  async function register(name, email, password) {
    await registerUser({
      name,
      email,
      password,
    });

    return login(email, password);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      getCurrentUser()
        .then((currentUser) => {
          setUser(currentUser);
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    function handleExpired() {
      setUser(null);
    }

    window.addEventListener(
      'auth:expired',
      handleExpired,
    );

    return () => {
      window.removeEventListener(
        'auth:expired',
        handleExpired,
      );
    };
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}