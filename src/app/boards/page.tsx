"use client";
import {
  GET_BOARDS,
  ADD_BOARD,
  ADD_LIST,
  ADD_TASK,
  TOGGLE_TASK_COMPLETION,
  UPDATE_BOARD,
  DELETE_BOARD,
  UPDATE_LIST,
  DELETE_LIST,
  UPDATE_TASK,
  DELETE_TASK,
  MOVE_TASK,
} from "../../../lib/graphql";

import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function BoardsPage() {
  const { loading, error, data } = useQuery(GET_BOARDS);

  // Mutations
  const [addBoard] = useMutation(ADD_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [updateBoard] = useMutation(UPDATE_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [deleteBoard] = useMutation(DELETE_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const [addList] = useMutation(ADD_LIST, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [updateList] = useMutation(UPDATE_LIST, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [deleteList] = useMutation(DELETE_LIST, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const [toggleTask] = useMutation(TOGGLE_TASK_COMPLETION, {
    refetchQueries: [{ query: GET_BOARDS }],
  });
  const [moveTask] = useMutation(MOVE_TASK, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  // UI States
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");
  const [listInputs, setListInputs] = useState<{ [boardId: string]: string }>(
    {}
  );
  const [taskInputs, setTaskInputs] = useState<{ [listId: string]: string }>(
    {}
  );
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    type: "board" | "list" | "task" | null;
    id: string | null;
    title: string;
  }>({ type: null, id: null, title: "" });

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

  // Drag Drop Handler
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

  // Handlers
  const handleAddBoard = async () => {
    if (newBoardTitle.trim()) {
      await addBoard({ variables: { title: newBoardTitle } });
      setNewBoardTitle("");
    }
  };

  const handleUpdateBoard = async (id: string) => {
    if (editingBoardTitle.trim()) {
      await updateBoard({ variables: { id, title: editingBoardTitle } });
      setEditingBoardId(null);
      setEditingBoardTitle("");
    }
  };

  const handleAddList = async (boardId: string) => {
    if (listInputs[boardId]?.trim()) {
      await addList({ variables: { boardId, title: listInputs[boardId] } });
      setListInputs({ ...listInputs, [boardId]: "" });
    }
  };

  const handleUpdateList = async (id: string) => {
    if (editingListTitle.trim()) {
      await updateList({ variables: { id, title: editingListTitle } });
      setEditingListId(null);
      setEditingListTitle("");
    }
  };

  const handleAddTask = async (listId: string) => {
    if (taskInputs[listId]?.trim()) {
      await addTask({ variables: { listId, title: taskInputs[listId] } });
      setTaskInputs({ ...taskInputs, [listId]: "" });
    }
  };

  const handleUpdateTask = async (id: string) => {
    if (editingTaskTitle.trim()) {
      await updateTask({ variables: { id, title: editingTaskTitle } });
      setEditingTaskId(null);
      setEditingTaskTitle("");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;
    if (deleteModal.type === "board") {
      await deleteBoard({ variables: { id: deleteModal.id } });
    } else if (deleteModal.type === "list") {
      await deleteList({ variables: { id: deleteModal.id } });
    } else if (deleteModal.type === "task") {
      await deleteTask({ variables: { id: deleteModal.id } });
    }
    setDeleteModal({ type: null, id: null, title: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">
          Kanban Boards
        </h1>
        {/* Add Board */}
        <div className="flex items-center gap-2 mb-8 bg-white p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Create a new board..."
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddBoard}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          >
            ➕ Add Board
          </button>
        </div>
        <div className="space-y-12">
          {data.boards.map((board: any) => (
            <div
              key={board.id}
              className="bg-white shadow-xl rounded-2xl p-6 mb-12 border border-gray-200"
            >
              {/* Board header */}
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
              {/* Add List */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Add new list..."
                  value={listInputs[board.id] || ""}
                  onChange={(e) =>
                    setListInputs({ ...listInputs, [board.id]: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded flex-1 focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={() => handleAddList(board.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold"
                >
                  ➕ Add List
                </button>
              </div>
              {/* Lists */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4">
                  {board.lists.map((list: any) => (
                    <Droppable droppableId={list.id} key={list.id}>
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
                                  onChange={(e) =>
                                    setEditingListTitle(e.target.value)
                                  }
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
                          {/* Add Task */}
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              placeholder="New task title..."
                              value={taskInputs[list.id] || ""}
                              onChange={(e) =>
                                setTaskInputs({
                                  ...taskInputs,
                                  [list.id]: e.target.value,
                                })
                              }
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
                              <Draggable
                                draggableId={task.id}
                                index={index}
                                key={task.id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-3 px-3 py-2 rounded-lg shadow border flex justify-between items-center bg-white transition
                                      ${
                                        snapshot.isDragging
                                          ? "ring-2 ring-blue-400 scale-105"
                                          : ""
                                      }`}
                                  >
                                    <div
                                      className={`flex-1 cursor-pointer ${
                                        task.completed
                                          ? "line-through text-gray-400"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        toggleTask({
                                          variables: { taskId: task.id },
                                        })
                                      }
                                    >
                                      {editingTaskId === task.id ? (
                                        <input
                                          type="text"
                                          value={editingTaskTitle}
                                          onChange={(e) =>
                                            setEditingTaskTitle(e.target.value)
                                          }
                                          onBlur={() =>
                                            handleUpdateTask(task.id)
                                          }
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
                                          <span className="ml-2">
                                            {task.completed ? "✅" : "⬜"}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <div className="flex gap-1 ml-2">
                                      <button
                                        onClick={() =>
                                          setEditingTaskId(task.id)
                                        }
                                        className="text-yellow-600 px-1"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() =>
                                          setDeleteModal({
                                            type: "task",
                                            id: task.id,
                                            title: task.title,
                                          })
                                        }
                                        className="text-red-600 px-1"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </div>
          ))}
        </div>
        {/* Delete Confirmation Modal */}
        {deleteModal.type && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-5 text-red-700">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Delete{" "}
                <span className="font-semibold">{deleteModal.title}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ type: null, id: null, title: "" })
                  }
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
