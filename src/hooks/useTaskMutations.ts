// hooks/useTaskMutations.ts
import { useMutation } from "@apollo/client";
import {
  TOGGLE_TASK_COMPLETION,
  UPDATE_TASK,
  DELETE_TASK,
  ADD_TASK,
  MOVE_TASK,
} from "../../lib/graphql/mutations/task";
import { GET_BOARDS } from "../../lib/graphql/queries/board";

export const useAddTask = () => {
  return useMutation(ADD_TASK, {
    refetchQueries: ["GetBoards"],
  });
};

// Hook for toggling task completion
export const useToggleTask = () => {
  return useMutation(TOGGLE_TASK_COMPLETION, {
    refetchQueries: ["GetBoards"],
  });
};

// Hook for updating task
export const useUpdateTask = () => {
  return useMutation(UPDATE_TASK, {
    refetchQueries: ["GetBoards"],
  });
};

// Hook for deleting task
export const useDeleteTask = () => {
  return useMutation(DELETE_TASK, {
    refetchQueries: ["GetBoards"],
  });
};

export const useMoveTask = () =>
  useMutation(MOVE_TASK, { refetchQueries: ["GetBoards"] });
