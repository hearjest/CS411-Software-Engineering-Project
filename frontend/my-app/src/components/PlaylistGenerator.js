import React, { useState, useEffect } from 'react';

const PlaylistGenerator = ({ selectedBook }) => {
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!selectedBook) return;
      setError(''); // Reset error state

      try {
        // Fetch sentiment analysis and playlist based on book ID
        let response = await fetch(`/api/retrieve-book/${selectedBook.id}`);
        if (!response.ok) throw new Error('Problem retrieving book details');
        
        const bookDetails = await response.json();
        const { energy, valence } = bookDetails;
        
        // Fetch playlist from Spotify with the given energy and valence
        response = await fetch(`/api/spotify/?energy=${energy}&valence=${valence}`);
        if (!response.ok) throw new Error('Problem retrieving playlist from Spotify');
        
        const playlistData = await response.json();
        setPlaylist(playlistData); // Make sure this matches the Spotify response structure
      } catch (error) {
        setError(error.message);
        console.error('Error in fetchPlaylist:', error);
      }
    };

    fetchPlaylist();
  }, [selectedBook]);

  return (
    <div className="playlist-container">
      {error && <p>Error: {error}</p>}
      {playlist.length ? (
        <ul>
          {playlist.map((track) => (
            <li key={track.id}>
              {track.name} by {track.artists.map(artist => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlist to display. Search for a book to generate playlist.</p>
      )}
    </div>
  );
};

export default PlaylistGenerator;
