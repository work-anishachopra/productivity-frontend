import { gql } from "@apollo/client";

export const GET_BOARDS = gql`
  query GetBoards {
    boards {
      id
      title
      lists {
        id
        title
        tasks {
          id
          title
          completed
        }
      }
    }
  }
`;

export const ADD_BOARD = gql`
  mutation AddBoard($title: String!) {
    addBoard(title: $title) {
      id
      title
      lists {
        id
        title
        tasks {
          id
          title
          completed
        }
      }
    }
  }
`;
