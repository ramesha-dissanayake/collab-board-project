import './App.css';
import Board from './components/Board'; // ADD THIS IMPORT

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CollabBoard Workspace</h1>
        <p>Project Management Dashboard</p>
      </header>
      
      <main className="board-container">
        <Board /> {/* ADD THE COMPONENT HERE */}
      </main>
    </div>
  );
}

export default App;