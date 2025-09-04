import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_LIST, UPDATE_BOARD } from "../../../lib/graphql";
import List from "./List";

export default function Board({
  board,
  setDeleteModal,
}: {
  board: any;
  setDeleteModal: any;
}) {
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");
  const [listInput, setListInput] = useState("");
  const [addList] = useMutation(ADD_LIST, {
    refetchQueries: [{ query: ADD_LIST }],
  });
  const [updateBoard] = useMutation(UPDATE_BOARD, {
    refetchQueries: [{ query: UPDATE_BOARD }],
  });

  const handleUpdateBoard = async (id: string) => {
    if (editingBoardTitle.trim()) {
      await updateBoard({ variables: { id, title: editingBoardTitle } });
      setEditingBoardId(null);
      setEditingBoardTitle("");
    }
  };

  const handleAddList = async (boardId: string) => {
    if (listInput.trim()) {
      await addList({ variables: { boardId, title: listInput } });
      setListInput("");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mb-12 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        {editingBoardId === board.id ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editingBoardTitle}
              onChange={(e) => setEditingBoardTitle(e.target.value)}
              className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={() => handleUpdateBoard(board.id)}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              ✅
            </button>
            <button
              onClick={() => setEditingBoardId(null)}
              className="px-2 py-1 bg-gray-400 text-white rounded"
            >
              ❌
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-blue-700">
              {board.title}
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingBoardId(board.id);
                  setEditingBoardTitle(board.title);
                }}
                className="px-2 py-1 bg-yellow-400 text-white rounded"
              >
                ✏️
              </button>
              <button
                onClick={() =>
                  setDeleteModal({
                    type: "board",
                    id: board.id,
                    title: board.title,
                  })
                }
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Add new list..."
          value={listInput}
          onChange={(e) => setListInput(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded flex-1 focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={() => handleAddList(board.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold"
        >
          ➕ Add List
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {board.lists.map((list: any) => (
          <List key={list.id} list={list} setDeleteModal={setDeleteModal} />
        ))}
      </div>
    </div>
  );
}
