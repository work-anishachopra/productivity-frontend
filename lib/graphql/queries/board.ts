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
