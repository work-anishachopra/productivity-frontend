import { useState } from "react";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";

import { toast } from "react-toastify";

//Interfaces
import { DeleteModalType } from "../../types/common";
import { ListProps } from "../../types/list";

//Import query & mutations
import { GET_BOARDS } from "../../../lib/graphql/queries/board";

//Import loader button
import LoaderButton from "../../components/LoaderButton";

// import hooks for useMutations
import { useAddTask } from "@/hooks/useTaskMutations";
import { useDeleteList, useUpdateList } from "@/hooks/useListMutations";

export default function List({ list, setDeleteModal }: ListProps) {
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState("");
  const [taskInput, setTaskInput] = useState("");

  const [addTask, { loading: addingTask }] = useAddTask();
  const [updateList, { loading: updatingList }] = useUpdateList();
  const [deleteListMutation, { loading: deletingList }] = useDeleteList();

  const handleUpdateList = async (id: string) => {
    if (editingListTitle.trim()) {
      try {
        await updateList({
          variables: { id, title: editingListTitle },
          optimisticResponse: {
            updateList: {
              __typename: "List",
              id,
              title: editingListTitle,
              tasks: list.tasks,
            },
          },
        });
        setEditingListId(null);
        setEditingListTitle("");
      } catch (error) {
        console.error("Failed to update list:", error);
        toast.error("Error updating list. Please try again.");
      }
    }
  };

  const handleAddTask = async (listId: string) => {
    if (taskInput.trim()) {
      const tempId = "temp-id-" + Math.random().toString(36).substr(2, 9);
      try {
        await addTask({
          variables: { listId, title: taskInput },
          optimisticResponse: {
            addTask: {
              __typename: "Task",
              id: tempId,
              title: taskInput,
              completed: false,
            },
          },
          update(cache, { data: { addTask } }) {
            const existingData: any = cache.readQuery({ query: GET_BOARDS });
            if (!existingData || !existingData.boards) return;
            const newBoards = existingData.boards.map((b: any) => ({
              ...b,
              lists: b.lists.map((l: any) =>
                l.id === listId
                  ? { ...l, tasks: [...(l.tasks || []), addTask] }
                  : l
              ),
            }));
            cache.writeQuery({
              query: GET_BOARDS,
              data: { boards: newBoards },
            });
          },
        });
        setTaskInput("");
      } catch (error) {
        console.error("Failed to add task:", error);
        toast.error("Error adding task. Please try again.");
      }
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      await deleteListMutation({ variables: { id } });
    } catch (error) {
      console.error("Failed to delete list:", error);
      toast.error("Error deleting list. Please try again.");
    }
  };

  return (
    <Droppable droppableId={list.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-blue-50 rounded-xl p-4 min-w-[280px] shadow-sm border border-blue-200 flex-shrink-0"
        >
          <div className="flex justify-between items-center mb-4">
            {editingListId === list.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingListTitle}
                  onChange={(e) => setEditingListTitle(e.target.value)}
                  className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400"
                  autoFocus
                  disabled={updatingList}
                />
                <LoaderButton
                  loading={updatingList}
                  onClick={() => handleUpdateList(list.id)}
                  loaderColor="#22c55e"
                  loaderSize={16}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updatingList}
                >
                  Save
                </LoaderButton>
                <LoaderButton
                  loading={false}
                  onClick={() => setEditingListId(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  disabled={updatingList}
                >
                  Cancel
                </LoaderButton>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold tracking-wide">
                  {list.title}
                </h3>
                <div className="flex space-x-2">
                  <LoaderButton
                    loading={updatingList}
                    onClick={() => {
                      setEditingListId(list.id);
                      setEditingListTitle(list.title);
                    }}
                    loaderColor="#ca8a04"
                    loaderSize={14}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updatingList || deletingList}
                    aria-label="Edit list"
                  >
                    ✏️
                  </LoaderButton>
                  <LoaderButton
                    loading={deletingList}
                    onClick={() =>
                      setDeleteModal({
                        type: "list",
                        id: list.id,
                        title: list.title,
                      })
                    }
                    loaderColor="#b91c1c"
                    loaderSize={14}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletingList || updatingList}
                    aria-label="Delete list"
                  >
                    🗑️
                  </LoaderButton>
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
              className="px-2 py-1 border border-gray-300 rounded flex-1 focus:ring-2 focus:ring-blue-400"
              disabled={addingTask}
            />
            <LoaderButton
              loading={addingTask}
              onClick={() => handleAddTask(list.id)}
              loaderColor="#ffffff"
              loaderSize={16}
              className="bg-blue-600 text-white px-4 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={taskInput.trim() === "" || addingTask}
            >
              ＋
            </LoaderButton>
          </div>

          <div className="space-y-3">
            {list.tasks.map((task, index) => (
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
