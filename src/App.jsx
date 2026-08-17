import { Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';

// Import Pages & Components
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    // Wrapping the whole app in the dark background ensures no white flashes
    <div className="min-h-screen bg-gray-950 flex flex-col">
      
      {/* The Navbar sits outside the Routes so it always shows up */}
      <Navbar />

      {/* The main content area that changes based on the URL */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;