import { gql } from "@apollo/client";

// ------------------
// Queries
// ------------------
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

// ------------------
// List Mutations
// ------------------
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

// ------------------
// Task Mutations
// ------------------
export const ADD_TASK = gql`
  mutation AddTask($listId: ID!, $title: String!) {
    addTask(listId: $listId, title: $title) {
      id
      title
      completed
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!) {
    updateTask(id: $id, title: $title) {
      id
      title
      completed
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const TOGGLE_TASK_COMPLETION = gql`
  mutation ToggleTaskCompletion($taskId: ID!) {
    toggleTaskCompletion(taskId: $taskId) {
      id
      title
      completed
    }
  }
`;

export const MOVE_TASK = gql`
  mutation MoveTask(
    $taskId: ID!
    $sourceListId: ID!
    $destListId: ID!
    $newIndex: Int!
  ) {
    moveTask(
      taskId: $taskId
      sourceListId: $sourceListId
      destListId: $destListId
      newIndex: $newIndex
    ) {
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
