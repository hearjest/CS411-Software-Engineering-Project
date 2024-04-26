import React, { useState, useEffect } from 'react';


const PlaylistGenerator = ({ selectedBook }) => {
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');
  

  useEffect(() => {
    async function fetchPlaylist(){
      if (!selectedBook) return;
      setError('');

      try {
        let response = await fetch(`/api/retrieve-book/${selectedBook.id}`);
        if (!response.ok) throw new Error('Problem retrieving book details');
        
        const bookDetails = await response.json();
        const { energy, valence } = bookDetails;
        console.log("energy: "+ energy);
        console.log("valence: "+valence)
        response = await fetch(`/api/spotify/?energy=${energy}&valence=${valence}`);
        if (!response.ok) throw new Error('Problem retrieving playlist from Spotify');
        console.log("play")
        
        const playlistData = await response.json();
        setPlaylist(playlistData); // Assuming playlist data is correct
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPlaylist();
  }, [selectedBook]);

  return (
    <div className="playlist-container">
      <h2>Generated Playlist</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {playlist.map((track) => (
          <li key={track}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistGenerator;
