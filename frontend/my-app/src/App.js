import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BookSearch from './components/BookSearch';
import PlaylistGenerator from './components/PlaylistGenerator';

function App() {
  const [selectedBook, setSelectedBook] = useState(null); // State to manage selected book

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>BookBeats</h1>
          <h4>Playlists for Your Books!</h4>
        </header>
        <Routes>
          <Route path="/" element={
            <>
              <BookSearch setSelectedBook={setSelectedBook} />
              <PlaylistGenerator selectedBook={selectedBook} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
