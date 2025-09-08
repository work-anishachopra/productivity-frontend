import { useState } from "react";
import { useMutation } from "@apollo/client";

import { Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

//importing interfaces
import { DeleteModalType } from "../../types/common";
import { TaskProps } from "../../types/task";

//Import query & mutations
import {
  TOGGLE_TASK_COMPLETION,
  UPDATE_TASK,
  DELETE_TASK,
} from "../../../lib/graphql/mutations/task";
import { GET_BOARDS } from "../../../lib/graphql/queries/board";

export default function Task({ task, index, setDeleteModal }: TaskProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  const [toggleTask, { loading: toggling }] = useMutation(
    TOGGLE_TASK_COMPLETION,
    {
      refetchQueries: ["GetBoards"],
    }
  );
  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    refetchQueries: ["GetBoards"],
  });
  const [deleteTaskMutation, { loading: deleting }] = useMutation(DELETE_TASK, {
    refetchQueries: ["GetBoards"],
  });

  const handleUpdateTask = async (id: string) => {
    if (editingTaskTitle.trim()) {
      try {
        await updateTask({
          variables: { id, title: editingTaskTitle },
          optimisticResponse: {
            updateTask: {
              __typename: "Task",
              id,
              title: editingTaskTitle,
              completed: task.completed,
            },
          },
        });
        setEditingTaskId(null);
        setEditingTaskTitle("");
      } catch (error) {
        console.error("Failed to update task:", error);
        toast.error("Error updating task. Please try again.");
      }
    }
  };

  const toggleTaskCompletion = async () => {
    try {
      await toggleTask({
        variables: { taskId: task.id },
        optimisticResponse: {
          toggleTaskCompletion: {
            __typename: "Task",
            id: task.id,
            title: task.title,
            completed: !task.completed,
          },
        },
        update(cache, { data }) {
          const { toggleTaskCompletion } = data;
          const cacheData: any = cache.readQuery({ query: GET_BOARDS });
          if (!cacheData) return;
          const newBoards = cacheData.boards.map((board: any) => ({
            ...board,
            lists: board.lists.map((list: any) => ({
              ...list,
              tasks: list.tasks.map((t: any) =>
                t.id === toggleTaskCompletion.id
                  ? { ...t, completed: toggleTaskCompletion.completed }
                  : t
              ),
            })),
          }));
          cache.writeQuery({ query: GET_BOARDS, data: { boards: newBoards } });
        },
      });
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      toast.error("Error updating task completion. Please try again.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation({ variables: { id } });
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Error deleting task. Please try again.");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdateTask(task.id);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 p-3 rounded-md shadow border bg-white cursor-pointer transition ${
            snapshot.isDragging ? "ring-2 ring-blue-400 scale-105" : ""
          } ${task.completed ? "line-through text-gray-400 opacity-70" : ""}`}
        >
          <div className="flex justify-between items-center">
            <div
              className={`flex-grow cursor-pointer ${
                toggling ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={toggleTaskCompletion}
            >
              {toggling ? (
                <ClipLoader size={14} color="#3b82f6" />
              ) : editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  onBlur={() => handleUpdateTask(task.id)}
                  onKeyDown={onKeyDown}
                  className={`border px-2 py-1 rounded w-full ${
                    updating ? "opacity-50" : ""
                  }`}
                  autoFocus
                  disabled={updating}
                />
              ) : (
                <span>{task.title}</span>
              )}
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setEditingTaskId(task.id)}
                disabled={updating || deleting}
                className="text-yellow-600 hover:text-yellow-800 px-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Edit task"
              >
                {updating ? <ClipLoader size={14} color="#ca8a04" /> : "✏️"}
              </button>
              <button
                onClick={() =>
                  setDeleteModal({
                    type: "task",
                    id: task.id,
                    title: task.title,
                  })
                }
                disabled={deleting || updating}
                className="text-red-600 hover:text-red-800 px-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete task"
              >
                {deleting ? <ClipLoader size={14} color="#b91c1c" /> : "🗑️"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
