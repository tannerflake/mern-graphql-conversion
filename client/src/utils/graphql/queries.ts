import { gql } from '@apollo/client';

// Query to get the logged-in user's data
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
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