import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/graphql/queries';
import { REMOVE_BOOK } from '../utils/graphql/mutations';
//import Auth from '../utils/auth';

// Define TypeScript types for book data
interface Book {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

// Define TypeScript type for user
interface User {
  _id: string;
  username: string;
  email: string;
  savedBooks: Book[];
}

const SavedBooks: React.FC = () => {
  const { loading, error, data } = useQuery<{ me: User }>(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books.</p>;

  const user = data?.me;

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({ variables: { bookId } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Saved Books</h2>
      {user?.savedBooks.length ? (
        user.savedBooks.map((book) => (
          <div key={book.bookId}>
            <h3>{book.title}</h3>
            <p>{book.authors?.join(', ') || 'Unknown Author'}</p>
            <button onClick={() => handleDeleteBook(book.bookId)}>Remove</button>
          </div>
        ))
      ) : (
        <p>No saved books.</p>
      )}
    </div>
  );
};

export default SavedBooks;