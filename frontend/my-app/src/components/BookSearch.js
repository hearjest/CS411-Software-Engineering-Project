import React from 'react';

class BookSearch extends React.Component {
  render() {
    return (
      <div>
        <input type="text" placeholder="Search for a book..." />
        <button>Search</button>
      </div>
    );
  }
}

export default BookSearch;
