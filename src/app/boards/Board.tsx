import { useState } from "react";

import List from "./List";

import { toast } from "react-toastify";

import LoaderButton from "../../components/LoaderButton";

//  Import interfaces
import { BoardProps } from "../../types/board";
import { DeleteModalType } from "../../types/common";

//Import Queries & Mutations
import { useAddList } from "@/hooks/useListMutations";
import { useDeleteBoard, useUpdateBoard } from "@/hooks/useBoardMutations";
import { GET_BOARDS } from "../../../lib/graphql/queries/board";

export default function Board({ board, setDeleteModal }: BoardProps) {
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");
  const [listInput, setListInput] = useState("");

  const [addList, { loading: addingList }] = useAddList();
  const [updateBoard, { loading: updatingBoard }] = useUpdateBoard();
  const [deleteBoardMutation, { loading: deletingBoard }] = useDeleteBoard();

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

            <LoaderButton
              loading={updatingBoard}
              onClick={() => handleUpdateBoard(board.id)}
              loaderColor="#22c55e" // spinner color
              loaderSize={16} // spinner size
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </LoaderButton>

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
              <LoaderButton
                loading={updatingBoard}
                onClick={() => {
                  setEditingBoardId(board.id);
                  setEditingBoardTitle(board.title);
                }}
                loaderColor="#ca8a04"
                loaderSize={16}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updatingBoard || deletingBoard}
              >
                ✏️
              </LoaderButton>

              <LoaderButton
                loading={deletingBoard}
                onClick={() =>
                  setDeleteModal({
                    type: "board",
                    id: board.id,
                    title: board.title,
                  })
                }
                loaderColor="#b91c1c"
                loaderSize={14}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️
              </LoaderButton>
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
        <LoaderButton
          loading={addingList}
          onClick={() => handleAddList(board.id)}
          loaderColor="#ffffff"
          loaderSize={18}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➕ Add List
        </LoaderButton>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        {board.lists.map((list) => (
          <List key={list.id} list={list} setDeleteModal={setDeleteModal} />
        ))}
      </div>
    </div>
  );
}
