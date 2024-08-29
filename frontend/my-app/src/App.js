import React, {  useState } from 'react';
import { useContext } from 'react';

import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import BookSearch from './components/BookSearch';
import PlaylistGenerator from './components/PlaylistGenerator';
import Login2 from './components/login2';
import LibraryPage from './components/LibraryPage';
import { IdContext } from './components/context';
import { Link } from "react-router-dom";


function App() {
  const [selectedBook, setSelectedBook] = useState(null); // State to manage selected book
  //const [id, setId] = useState(null);
  //const [library, setLibrary] = useState([]);
  const { userId, setUserId, library, setLibrary } = useContext(IdContext);
  //const navigate = useNavigate();

  /*useEffect(() => {
    if(loginStatus){
      navigate('/search');
    }
  },[loginStatus,navigate]);*/

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>BookBeats</h1>
          <h4>Playlists for Your Books!</h4>
        </header>
        <div className="nav-bar">
          
        </div>
        <Routes>
          <Route path="/" element={
            <>
              {<Login2 userId={userId} setUserId={setUserId}/>}
            </>
          } />
          <Route path="/search" element={
            <>
            <Link to="/search">Search</Link>
            <Link to="/library">Library</Link>
              <BookSearch selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
              <PlaylistGenerator userId={userId} setSelectedBook={setSelectedBook} selectedBook={selectedBook} setLibrary={setLibrary}/>

            </>
          } />
          <Route path='/library' element={
            <>
            <Link to="/search">Search</Link>
            <Link to="/library">Library</Link>
              <LibraryPage/>
            </>
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
