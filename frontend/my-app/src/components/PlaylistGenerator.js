import React, { useState, useEffect } from 'react';

const PlaylistGenerator = ({ selectedBook }) => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!selectedBook) return;

      try {
        // Fetch sentiment analysis and playlist based on book ID
        let response = await fetch(`/api/retrieve-book/${selectedBook.id}`);
        if (!response.ok) throw new Error('Problem retrieving book details');
        
        const bookDetails = await response.json();
        const { energy, valence } = bookDetails;
        console.log(energy, valence)

        // Fetch playlist from Spotify with the given energy and valence
        response = await fetch(`/api/spotify?energy=${energy}&valence=${valence}`);
        if (!response.ok) throw new Error('Problem retrieving playlist from Spotify');
        
        const playlistData = await response.json();
        setPlaylist(playlistData.tracks); // Assuming the response contains a 'tracks' field
      } catch (error) {
        console.error('Error in fetchPlaylist:', error);
      }
    };

    fetchPlaylist();
  }, [selectedBook]); // Trigger the effect when selectedBook changes

  return (
    <div className="playlist-container">
      {/* Render the playlist items here using the playlist state */}
    </div>
  );
};

export default PlaylistGenerator;
