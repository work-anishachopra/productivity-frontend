"use client";
import {
  GET_BOARDS,
  ADD_BOARD,
  ADD_LIST,
  ADD_TASK,
  TOGGLE_TASK_COMPLETION,
} from "../../../lib/graphql";

import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

export default function BoardsPage() {
  const { loading, error, data } = useQuery(GET_BOARDS);

  const [addBoard] = useMutation(ADD_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }], // refresh board list after adding
  });

  const [addList] = useMutation(ADD_LIST, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const [toggleTask] = useMutation(TOGGLE_TASK_COMPLETION, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  //   add async because network requests (GraphQL mutations) are asynchronous.
  //   use await so our code waits for the response before moving on.

  const handleAddBoard = async () => {
    const title = prompt("Enter board name:");
    if (title) {
      await addBoard({ variables: { title } });
    }
  };

  const handleAddList = async (boardId: string) => {
    const title = prompt("Enter list name:");
    if (title) {
      await addList({ variables: { boardId, title } });
    }
  };

  const handleAddTask = async (listId: string) => {
    const title = prompt("Enter task name:");
    if (title) {
      await addTask({ variables: { listId, title } });
    }
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask({ variables: { taskId } });
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-violet-700">Trello Clone</h1>
        <button
          onClick={handleAddBoard}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow"
        >
          ➕ Add Board
        </button>
      </div>

      {/* Boards in horizontal row */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {data.boards.map((board: any) => (
          <div
            key={board.id}
            className="bg-white rounded-xl shadow-lg p-4 w-80 flex-shrink-0"
          >
            <h2 className="text-lg font-bold text-gray-800">{board.title}</h2>

            <button
              onClick={() => handleAddList(board.id)}
              className="w-full mb-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              ➕ Add List
            </button>

            <div className="space-y-4">
              {board.lists.map((list: any) => (
                <div
                  key={list.id}
                  className="bg-gray-50 rounded-lg shadow-inner p-3"
                >
                  <h3 className="font-medium text-gray-700 mb-2">
                    {list.title}
                  </h3>

                  <button
                    onClick={() => handleAddTask(list.id)}
                    className="w-full mb-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    ➕ Add Task
                  </button>

                  <ul className="space-y-2">
                    {list.tasks.map((task: any) => (
                      <li
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-2 rounded-lg shadow cursor-pointer transition ${
                          task.completed
                            ? "bg-green-200 line-through"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
