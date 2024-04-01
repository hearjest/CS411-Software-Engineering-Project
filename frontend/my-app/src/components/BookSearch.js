import React, { useState } from 'react';

function BookSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch('/api/search-books', {
        method: 'POST', // or 'GET', depending on your backend setup
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // Ensure your backend expects the query in this format
      });

      if (!response.ok) {
        throw new Error('Problem fetching books');
      }

      const data = await response.json();
      setBooks(data.books); // Adjust according to the structure of your response
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      <ul>
        {books.map((book, index) => (
          <li key={index}>{book.title} - {book.author}</li> // Customize based on your book object structure
        ))}
      </ul>
    </div>
  );
}

export default BookSearch;