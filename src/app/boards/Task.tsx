import { useState } from "react";
import { useMutation } from "@apollo/client";
import { TOGGLE_TASK_COMPLETION, UPDATE_TASK } from "../../../lib/graphql";
import { Draggable } from "@hello-pangea/dnd";
import { DeleteModalType } from "../../components/types";

interface TaskType {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskProps {
  task: TaskType;
  index: number;
  setDeleteModal: (modal: DeleteModalType) => void;
}

export default function Task({ task, index, setDeleteModal }: TaskProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [toggleTask] = useMutation(TOGGLE_TASK_COMPLETION, {
    refetchQueries: ["GetBoards"],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: ["GetBoards"],
  });

  const handleUpdateTask = async (id: string) => {
    if (editingTaskTitle.trim()) {
      try {
        await updateTask({ variables: { id, title: editingTaskTitle } });
        setEditingTaskId(null);
        setEditingTaskTitle("");
      } catch (error) {
        console.error("Failed to update task:", error);
        alert("Error updating task. Please try again.");
      }
    }
  };

  const toggleTaskCompletion = async () => {
    try {
      await toggleTask({ variables: { taskId: task.id } });
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      alert("Error updating task completion. Please try again.");
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
          className={`mb-3 px-3 py-2 rounded-lg shadow border flex justify-between items-center bg-white transition ${
            snapshot.isDragging ? "ring-2 ring-blue-400 scale-105" : ""
          }`}
        >
          <div
            className={`flex-1 cursor-pointer ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
            onClick={toggleTaskCompletion}
          >
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editingTaskTitle}
                onChange={(e) => setEditingTaskTitle(e.target.value)}
                onBlur={() => handleUpdateTask(task.id)}
                onKeyDown={onKeyDown}
                className="border px-1 py-0.5 rounded"
                autoFocus
              />
            ) : (
              <>
                <span
                  onDoubleClick={() => {
                    setEditingTaskId(task.id);
                    setEditingTaskTitle(task.title);
                  }}
                >
                  {task.title}
                </span>
                <span className="ml-2">{task.completed ? "✅" : "⬜"}</span>
              </>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setEditingTaskId(task.id)}
              className="text-yellow-600 px-1"
              aria-label="Edit task"
            >
              ✏️
            </button>
            <button
              onClick={() =>
                setDeleteModal({ type: "task", id: task.id, title: task.title })
              }
              className="text-red-600 px-1"
              aria-label="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
