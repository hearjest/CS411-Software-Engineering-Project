import React, { useState } from 'react';
import './BookSearch.css'; // Ensure you have the corresponding CSS file

function BookSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch(`/api/search-books/${query}`, {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Problem fetching books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleDeselectBook = () => {
    setSelectedBook(null);
  };

  return (
    <div>
      {selectedBook ? (
        // Displaying details of the selected book
        <div className="book-detail-container">
          <div className="book-image-container">
            <img 
              src={selectedBook.volumeInfo.imageLinks?.thumbnail} 
              alt={`Cover of ${selectedBook.volumeInfo.title}`} 
            />
          </div>
          <div className="book-info-container">
            <h2>{selectedBook.volumeInfo.title}</h2>
            <p>Author: {selectedBook.volumeInfo.authors?.join(', ')}</p>
            <p>ISBN: {selectedBook.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13" || id.type === "ISBN_10")?.identifier || 'No ISBN available'}</p>
            <p>{selectedBook.volumeInfo.description}</p>
            <button onClick={handleDeselectBook}>Back to search results</button>
          </div>
        </div>
      ) : (
        // Displaying the search interface and book results
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
          <div className="book-grid">
            {books.map((book) => (
              <div className="book-card" key={book.id} onClick={() => handleBookSelect(book)}>
                <div className="book-image-container">
                  <img 
                    src={book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'} 
                    alt={`Cover of ${book.volumeInfo.title}`}
                    className="book-image" 
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.volumeInfo.title}</h3>
                  <p className="book-authors">{book.volumeInfo.authors?.join(', ')}</p>
                  <p className="book-isbn">ISBN: {book.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13" || id.type === "ISBN_10")?.identifier || 'No ISBN available'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSearch;
