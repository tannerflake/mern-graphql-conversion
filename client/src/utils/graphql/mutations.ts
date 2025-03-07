import { gql } from '@apollo/client';

// Mutation to log in a user
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to create a new user
export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to save a book
export const SAVE_BOOK = gql`
  mutation SaveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Mutation to remove a saved book
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      savedBooks {
        bookId
      }
    }
  }
`;