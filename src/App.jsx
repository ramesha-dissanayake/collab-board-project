import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import BoardPage from './pages/BoardPage';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-stone-50">
        <p className="font-bold text-stone-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId/board"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/board"
            element={<Navigate to="/profile" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;