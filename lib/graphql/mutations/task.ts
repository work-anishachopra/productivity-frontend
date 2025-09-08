import { gql } from "@apollo/client";

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
