import React from 'react';

function PlaylistGenerator(props) {
  const book = props.location.state.selectedBook; // Access the passed book data
  return (
    <div>
      <h1>Playlist for {book.volumeInfo.title}</h1>
      {/* Further implementation */}
    </div>
  );
}

export default PlaylistGenerator;