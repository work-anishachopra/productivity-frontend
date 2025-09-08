"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import Board from "./Board";
import DeleteModal from "./DeleteModal";
import AuthGuard from "../../components/AuthGuard";
import LogoutButton from "../../components/LogoutButton";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

//Import Interfaces
import { DeleteModalType } from "../../types/common";

//Import query & mutations

import { ADD_BOARD, DELETE_BOARD } from "../../../lib/graphql/mutations/board";

import { DELETE_LIST } from "../../../lib/graphql/mutations/list";

import { MOVE_TASK, DELETE_TASK } from "../../../lib/graphql/mutations/task";

import { GET_BOARDS } from "../../../lib/graphql/queries/board";

function BoardsPageContent() {
  const { loading, error, data } = useQuery(GET_BOARDS);
  const [moveTask] = useMutation(MOVE_TASK, {
    refetchQueries: ["GetBoards"],
  });
  const [deleteBoard] = useMutation(DELETE_BOARD, {
    refetchQueries: ["GetBoards"],
  });
  const [deleteList] = useMutation(DELETE_LIST, {
    refetchQueries: ["GetBoards"],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: ["GetBoards"],
  });
  const [addBoard, { loading: addingBoard }] = useMutation(ADD_BOARD, {
    refetchQueries: ["GetBoards"],
  });

  const [deleteModal, setDeleteModal] = useState<DeleteModalType>({
    type: null,
    id: null,
    title: "",
  });

  const [boardInput, setBoardInput] = useState("");

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    try {
      await moveTask({
        variables: {
          taskId: draggableId,
          sourceListId: source.droppableId,
          destListId: destination.droppableId,
          newIndex: destination.index,
        },
      });
    } catch (err) {
      console.error("Error moving task:", err);
      toast.error("Error moving task. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    try {
      if (deleteModal.type === "board") {
        await deleteBoard({ variables: { id: deleteModal.id } });
      } else if (deleteModal.type === "list") {
        await deleteList({ variables: { id: deleteModal.id } });
      } else if (deleteModal.type === "task") {
        await deleteTask({ variables: { id: deleteModal.id } });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Error deleting item. Please try again.");
    } finally {
      setDeleteModal({ type: null, id: null, title: "" });
    }
  };

  const handleAddBoard = async () => {
    if (!boardInput.trim()) return;
    const tempId = "temp-id-" + Math.random().toString(36).substr(2, 9);
    try {
      await addBoard({
        variables: { title: boardInput },
        optimisticResponse: {
          addBoard: {
            __typename: "Board",
            id: tempId,
            title: boardInput,
            lists: [],
            userId: "temp-user", // Add userId if needed, placeholder
          },
        },
        update(cache, { data: { addBoard } }) {
          const existingData: any = cache.readQuery({ query: GET_BOARDS });
          if (!existingData || !existingData.boards) return;

          const newBoards = [...existingData.boards, addBoard];

          cache.writeQuery({
            query: GET_BOARDS,
            data: { boards: newBoards },
          });
        },
      });
      setBoardInput("");
    } catch (error) {
      console.error("Failed to add board:", error);
      toast.error("Error adding board. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 font-semibold">Error: {error.message}</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800">Kanban Boards</h1>
          <LogoutButton />
        </div>

        {/* Add Board Input */}
        <div className="flex mb-8 gap-3">
          <input
            type="text"
            placeholder="Add new board..."
            className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={boardInput}
            onChange={(e) => setBoardInput(e.target.value)}
            disabled={addingBoard}
          />
          <button
            onClick={handleAddBoard}
            disabled={boardInput.trim() === "" || addingBoard}
            className="bg-green-600 hover:bg-green-700 text-white px-5 rounded font-semibold disabled:opacity-50"
          >
            {addingBoard ? (
              <ClipLoader size={18} color="#ffffff" />
            ) : (
              "➕ Add Board"
            )}
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-12">
            {data.boards.map((board: any) => (
              <Board
                key={board.id}
                board={board}
                setDeleteModal={setDeleteModal}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      {deleteModal.type && (
        <DeleteModal
          modal={deleteModal}
          onCancel={() => setDeleteModal({ type: null, id: null, title: "" })}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default function ProtectedBoardsPage() {
  return (
    <AuthGuard>
      <BoardsPageContent />
    </AuthGuard>
  );
}
