// ------------------
// List Mutations
// ------------------

import { gql } from "@apollo/client";

export const ADD_LIST = gql`
  mutation AddList($boardId: ID!, $title: String!) {
    addList(boardId: $boardId, title: $title) {
      id
      title
    }
  }
`;

export const UPDATE_LIST = gql`
  mutation UpdateList($id: ID!, $title: String!) {
    updateList(id: $id, title: $title) {
      id
      title
    }
  }
`;

export const DELETE_LIST = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id)
  }
`;
