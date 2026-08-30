import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import BoardPage from './pages/BoardPage';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/projects/:projectId/board"
            element={<BoardPage />}
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