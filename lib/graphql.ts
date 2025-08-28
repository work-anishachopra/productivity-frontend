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

const ADD_BOARD = gql`
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

const ADD_LIST = gql`
  mutation AddList($boardId: ID!, $title: String!) {
    addList(boardId: $boardId, title: $title) {
      id
      title
      tasks {
        id
        title
        completed
      }
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($listId: ID!, $title: String!) {
    addTask(listId: $listId, title: $title) {
      id
      title
      completed
    }
  }
`;

export const TOGGLE_TASK_COMPLETION = gql`
  mutation ToggleTaskCompletion($taskId: ID!) {
    toggleTaskCompletion(taskId: $taskId) {
      id
      completed
    }
  }
`;

export { ADD_BOARD, ADD_LIST, ADD_TASK };
