"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import {
  GET_BOARDS,
  MOVE_TASK,
  DELETE_BOARD,
  DELETE_LIST,
  DELETE_TASK,
} from "../../../lib/graphql";
import Board from "./Board";
import DeleteModal from "./DeleteModal";
import AuthGuard from "../../components/AuthGuard";
import LogoutButton from "../../components/LogoutButton";
import { DeleteModalType } from "../../components/types";

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

  const [deleteModal, setDeleteModal] = useState<DeleteModalType>({
    type: null,
    id: null,
    title: "",
  });

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
      alert("Error deleting item. Please try again.");
    } finally {
      setDeleteModal({ type: null, id: null, title: "" });
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
