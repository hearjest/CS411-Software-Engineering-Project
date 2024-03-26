import React from 'react';
import './App.css';
import BookSearch from './components/BookSearch';
import PlaylistDisplay from './components/PlaylistDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Book Sentiment-Based Playlist Generator</h1>
      </header>
      <BookSearch />
      <PlaylistDisplay />
    </div>
  );
}

export default App;
