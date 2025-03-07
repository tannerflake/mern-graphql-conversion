import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/graphql/mutations';
import { searchGoogleBooks } from '../utils/API';
import Auth from '../utils/auth';

// Define TypeScript types for book data
interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    infoLink?: string;
  };
}

const SearchBooks: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput.trim()) return;

    try {
      const response = await searchGoogleBooks(searchInput);
      const data = await response.json();
      setSearchedBooks(data.items || []);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleSaveBook = async (book: Book) => {
    if (!Auth.loggedIn()) return;

    const bookToSave = {
      bookId: book.id,
      authors: book.volumeInfo.authors || [],
      title: book.volumeInfo.title,
      description: book.volumeInfo.description || '',
      image: book.volumeInfo.imageLinks?.thumbnail || '',
      link: book.volumeInfo.infoLink || '',
    };

    try {
      await saveBook({ variables: { input: bookToSave } });
      console.log('Book saved successfully!');
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for books"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {searchedBooks.map((book) => (
          <div key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
            <button onClick={() => handleSaveBook(book)}>Save This Book!</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;