import { useState } from "react";
import { useMutation } from "@apollo/client";

import List from "./List";

import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

//  Import interfaces
import { BoardProps } from "../../types/board";
import { DeleteModalType } from "../../types/common";

//Import Queries & Mutations
import {
  UPDATE_BOARD,
  DELETE_BOARD,
} from "../../../lib/graphql/mutations/board";

import { ADD_LIST } from "../../../lib/graphql/mutations/list";

import { GET_BOARDS } from "../../../lib/graphql/queries/board";

export default function Board({ board, setDeleteModal }: BoardProps) {
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");
  const [listInput, setListInput] = useState("");

  const [addList, { loading: addingList }] = useMutation(ADD_LIST, {
    refetchQueries: ["GetBoards"],
  });
  const [updateBoard, { loading: updatingBoard }] = useMutation(UPDATE_BOARD, {
    refetchQueries: ["GetBoards"],
  });
  const [deleteBoardMutation, { loading: deletingBoard }] = useMutation(
    DELETE_BOARD,
    {
      refetchQueries: ["GetBoards"],
    }
  );

  const handleUpdateBoard = async (id: string) => {
    if (editingBoardTitle.trim()) {
      try {
        await updateBoard({
          variables: { id, title: editingBoardTitle },
          optimisticResponse: {
            updateBoard: {
              __typename: "Board",
              id,
              title: editingBoardTitle,
              lists: board.lists,
            },
          },
        });
        setEditingBoardId(null);
        setEditingBoardTitle("");
      } catch (error) {
        console.error("Failed to update board:", error);
        toast.error("Error updating board. Please try again.");
      }
    }
  };

  const handleAddList = async (boardId: string) => {
    if (listInput.trim()) {
      const tempId = "temp-id-" + Math.random().toString(36).substr(2, 9);
      try {
        await addList({
          variables: { boardId, title: listInput },
          optimisticResponse: {
            addList: {
              __typename: "List",
              id: tempId,
              title: listInput,
              tasks: [],
            },
          },
          update(cache, { data: { addList } }) {
            const existingData: any = cache.readQuery({ query: GET_BOARDS });
            if (!existingData || !existingData.boards) return;

            const newBoards = existingData.boards.map((b: any) =>
              b.id === boardId
                ? {
                    ...b,
                    lists: [
                      ...(Array.isArray(b.lists) ? b.lists : []),
                      {
                        ...addList,
                        tasks: Array.isArray(addList.tasks)
                          ? addList.tasks
                          : [],
                      },
                    ],
                  }
                : b
            );

            cache.writeQuery({
              query: GET_BOARDS,
              data: { boards: newBoards },
            });
          },
        });
        setListInput("");
      } catch (error) {
        console.error("Failed to add list:", error);
        toast.error("Error adding list. Please try again.");
      }
    }
  };

  const handleDeleteBoard = async (id: string) => {
    try {
      await deleteBoardMutation({ variables: { id } });
    } catch (error) {
      console.error("Failed to delete board:", error);
      toast.error("Error deleting board. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        {editingBoardId === board.id ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editingBoardTitle}
              onChange={(e) => setEditingBoardTitle(e.target.value)}
              className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400"
              autoFocus
              disabled={updatingBoard}
            />
            <button
              onClick={() => handleUpdateBoard(board.id)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updatingBoard}
            >
              {updatingBoard ? (
                <ClipLoader size={14} color="#22c55e" />
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={() => setEditingBoardId(null)}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              disabled={updatingBoard}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-blue-700">
              {board.title}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingBoardId(board.id);
                  setEditingBoardTitle(board.title);
                }}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                disabled={updatingBoard || deletingBoard}
                aria-label="Edit board"
              >
                {updatingBoard ? (
                  <ClipLoader size={14} color="#ca8a04" />
                ) : (
                  "✏️"
                )}
              </button>
              <button
                onClick={() =>
                  setDeleteModal({
                    type: "board",
                    id: board.id,
                    title: board.title,
                  })
                }
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deletingBoard || updatingBoard}
                aria-label="Delete board"
              >
                {deletingBoard ? (
                  <ClipLoader size={14} color="#b91c1c" />
                ) : (
                  "🗑️"
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-6 mb-5">
        <input
          type="text"
          placeholder="Add new list..."
          value={listInput}
          onChange={(e) => setListInput(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded flex-1 focus:ring-2 focus:ring-blue-400"
          disabled={addingList}
        />
        <button
          onClick={() => handleAddList(board.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={listInput.trim() === "" || addingList}
        >
          {addingList ? (
            <ClipLoader size={16} color="#ffffff" />
          ) : (
            "➕ Add List"
          )}
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        {board.lists.map((list) => (
          <List key={list.id} list={list} setDeleteModal={setDeleteModal} />
        ))}
      </div>
    </div>
  );
}
