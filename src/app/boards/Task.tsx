import { useState } from "react";
import { useMutation } from "@apollo/client";
import { TOGGLE_TASK_COMPLETION, UPDATE_TASK } from "../../../lib/graphql";
import { Draggable } from "@hello-pangea/dnd";

export default function Task({
  task,
  index,
  setDeleteModal,
}: {
  task: any;
  index: number;
  setDeleteModal: any;
}) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [toggleTask] = useMutation(TOGGLE_TASK_COMPLETION, {
    refetchQueries: [{ query: TOGGLE_TASK_COMPLETION }],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: UPDATE_TASK }],
  });

  const handleUpdateTask = async (id: string) => {
    if (editingTaskTitle.trim()) {
      await updateTask({ variables: { id, title: editingTaskTitle } });
      setEditingTaskId(null);
      setEditingTaskTitle("");
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
            onClick={() => toggleTask({ variables: { taskId: task.id } })}
          >
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editingTaskTitle}
                onChange={(e) => setEditingTaskTitle(e.target.value)}
                onBlur={() => handleUpdateTask(task.id)}
                className="border px-1 py-0.5 rounded"
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
            >
              ✏️
            </button>
            <button
              onClick={() =>
                setDeleteModal({ type: "task", id: task.id, title: task.title })
              }
              className="text-red-600 px-1"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
