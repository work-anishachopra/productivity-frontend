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

  //   //add async because network requests (GraphQL mutations) are asynchronous.
  //   //use await so our code waits for the response before moving on.

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
    <div className="p-6" style={{ color: "violet" }}>
      <h1 className="text-2xl font-bold mb-4">Boards</h1>
      <button
        onClick={handleAddBoard}
        className="px-3 py-1 mb-4 bg-violet-600 text-white rounded"
      >
        ➕ Add Board
      </button>

      {data.boards.map((board: any) => (
        <div key={board.id} className="mb-6">
          <h2 className="text-xl font-semibold">{board.title}</h2>

          <button
            onClick={() => handleAddList(board.id)}
            className="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded"
          >
            ➕ Add List
          </button>

          {board.lists.map((list: any) => (
            <div key={list.id} className="ml-6 mb-3">
              <h3 className="font-medium">{list.title}</h3>

              <button
                onClick={() => handleAddTask(list.id)}
                className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded"
              >
                ➕ Add Task
              </button>

              <ul className="ml-6 list-disc">
                {list.tasks.map((task: any) => (
                  <li
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="cursor-pointer"
                  >
                    {task.title} {task.completed ? "✅" : "❌"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
