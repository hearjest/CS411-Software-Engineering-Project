import React, { useState } from 'react';

function BookSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  let [books, setBooks] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setLoading(true);
    setError('');
    setBooks([]);
    try {
      const response = await fetch('/api/search-books/'+query,{
        method: "GET"});

      if (!response.ok) {
        throw new Error('Problem fetching books');
      }
      const thing = await response.json()
      setBooks(thing); // Adjust according to the structure of your response
    } catch (error) {
      console.log("FUCKED UP")
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
       <a href="http://localhost:4000/auth/github">Login with GitHub</a>
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      <ul id="bookList">
        {books.map((book) => (
          <li key={book.id}>{book.volumeInfo.title} - {book.volumeInfo.description}</li> // Customize based on your book object structure
        ))}
      </ul>
    </div>
  );
}

export default BookSearch;