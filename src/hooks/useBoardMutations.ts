// hooks/useBoardMutations.ts
import { useMutation } from "@apollo/client";
import {
  ADD_BOARD,
  DELETE_BOARD,
  UPDATE_BOARD,
} from "../../lib/graphql/mutations/board";

export const useAddBoard = () =>
  useMutation(ADD_BOARD, { refetchQueries: ["GetBoards"] });

export const useUpdateBoard = () =>
  useMutation(UPDATE_BOARD, { refetchQueries: ["GetBoards"] });

export const useDeleteBoard = () =>
  useMutation(DELETE_BOARD, { refetchQueries: ["GetBoards"] });
