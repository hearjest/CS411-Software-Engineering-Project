import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BookSearch from './components/BookSearch';
import PlaylistDisplay from './components/PlaylistDisplay';
import PlaylistGenerator from './components/PlaylistGenerator'; // Ensure this is imported

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>BookBeats</h1>
          <h4>Playlists for Your Books!</h4>
        </header>
        <Routes>
          <Route path="/" element={<><BookSearch /><PlaylistDisplay /></>} />
          <Route path="/playlist-generator" element={<PlaylistGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
