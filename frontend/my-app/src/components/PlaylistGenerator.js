import React, { useState, useEffect } from 'react';


const PlaylistGenerator = ({ selectedBook,setSelectedBook, userId ,setlibrary}) => {
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');
  let playlistlist=[];

  useEffect(() => {
    async function fetchPlaylist(){
      if (!selectedBook) return;
      setError('');

      try {
        let response = await fetch(`/api/retrieve-book/${selectedBook.id}`);
        if (!response.ok) throw new Error('Problem retrieving book details');
        
        const bookDetails = await response.json();
        console.log(bookDetails)
        const energy=bookDetails[0];
        const valence=bookDetails[1]
        response = await fetch(`/api/spotify/?energy=${energy}&valence=${valence}`);
        if (!response.ok) throw new Error('Problem retrieving playlist from Spotify');
        const playlistData = await response.json();
        setPlaylist(playlistData.tracks);
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
      <div id="song-container">
      <ul>
        {playlist.map((track) => (
          playlistlist.push({[track.name]: track.album.external_urls.spotify}),
          <div class="songbox">
            <img src={track.album.images[1].url} alt={track.name} />
            <br></br>
            <a href={track.album.external_urls.spotify} key={track}>{track.name}</a>
          </div>
        ))}
      </ul>
      </div>
      <button onClick={async () => {const response = await fetch('http://localhost:4000/api/save-book/'+userId,{
                method:"POST",
                body:JSON.stringify(({pl:playlistlist, book:selectedBook})),
                headers:{
                    "Content-Type":'application/json',
                },
            }); }}>Add playlist to associated book! </button>
    </div>
  );
};

export default PlaylistGenerator;
