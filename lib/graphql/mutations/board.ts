import { gql } from "@apollo/client";

// ------------------
// Board Mutations
// ------------------
export const ADD_BOARD = gql`
  mutation AddBoard($title: String!) {
    addBoard(title: $title) {
      id
      title
      lists {
        id
        title
      }
    }
  }
`;

export const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: ID!, $title: String!) {
    updateBoard(id: $id, title: $title) {
      id
      title
    }
  }
`;

export const DELETE_BOARD = gql`
  mutation DeleteBoard($id: ID!) {
    deleteBoard(id: $id)
  }
`;
