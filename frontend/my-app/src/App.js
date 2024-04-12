import React from 'react';
import './App.css';
import BookSearch from './components/BookSearch';
import PlaylistDisplay from './components/PlaylistDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>BookBeats</h1>
        <h4>Playlists for Your Books!</h4>
      </header>
      <BookSearch />
      <PlaylistDisplay />
    </div>
  );
}
//use passportjs first, return a true or false, check with ternary
// ternary if else " : ?
//
export default App;
