import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK, UPDATE_LIST } from "../../../lib/graphql";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";

export default function List({
  list,
  setDeleteModal,
}: {
  list: any;
  setDeleteModal: any;
}) {
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: ADD_TASK }],
  });
  const [updateList] = useMutation(UPDATE_LIST, {
    refetchQueries: [{ query: UPDATE_LIST }],
  });

  const handleUpdateList = async (id: string) => {
    if (editingListTitle.trim()) {
      await updateList({ variables: { id, title: editingListTitle } });
      setEditingListId(null);
      setEditingListTitle("");
    }
  };

  const handleAddTask = async (listId: string) => {
    if (taskInput.trim()) {
      await addTask({ variables: { listId, title: taskInput } });
      setTaskInput("");
    }
  };

  return (
    <Droppable droppableId={list.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[270px] flex-shrink-0 shadow hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-2">
            {editingListId === list.id ? (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={editingListTitle}
                  onChange={(e) => setEditingListTitle(e.target.value)}
                  className="px-1 py-0.5 border border-blue-300 rounded"
                />
                <button
                  onClick={() => handleUpdateList(list.id)}
                  className="bg-green-500 text-white px-2 py-0.5 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={() => setEditingListId(null)}
                  className="bg-gray-400 text-white px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold tracking-wide">
                  {list.title}
                </h3>
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => {
                      setEditingListId(list.id);
                      setEditingListTitle(list.title);
                    }}
                    className="text-yellow-500 hover:bg-yellow-100 rounded px-1"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        type: "list",
                        id: list.id,
                        title: list.title,
                      })
                    }
                    className="text-red-500 hover:bg-red-100 rounded px-1"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="New task title..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded flex-1"
            />
            <button
              onClick={() => handleAddTask(list.id)}
              className="bg-blue-600 text-white px-2 rounded"
            >
              ＋
            </button>
          </div>
          <div>
            {list.tasks.map((task: any, index: number) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                setDeleteModal={setDeleteModal}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
