// hooks/useListMutations.ts
import { useMutation } from "@apollo/client";
import {
  UPDATE_LIST,
  DELETE_LIST,
  ADD_LIST,
} from "../../lib/graphql/mutations/list";

export const useAddList = () =>
  useMutation(ADD_LIST, { refetchQueries: ["GetBoards"] });

export const useUpdateList = () => {
  return useMutation(UPDATE_LIST, {
    refetchQueries: ["GetBoards"],
  });
};

export const useDeleteList = () => {
  return useMutation(DELETE_LIST, {
    refetchQueries: ["GetBoards"],
  });
};
