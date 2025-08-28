"use client";
import { GET_BOARDS, ADD_BOARD } from "../../../lib/graphql";

import { useQuery, useMutation } from "@apollo/client";
//import { GET_BOARDS, ADD_BOARD } from "@/graphql";
import { useState } from "react";

export default function BoardsPage() {
  const { loading, error, data } = useQuery(GET_BOARDS);
  const [addBoard] = useMutation(ADD_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }], // refresh board list after adding
  });

  const [newBoardTitle, setNewBoardTitle] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    await addBoard({
      variables: { title: newBoardTitle },
    });
    //add async because network requests (GraphQL mutations) are asynchronous.
    //use await so our code waits for the response before moving on.
    setNewBoardTitle(""); // reset input
  };

  return (
    <div className="p-6" style={{ color: "violet" }}>
      <h1 className="text-2xl font-bold mb-4">Boards</h1>

      {/* Add Board Form */}
      <form onSubmit={handleAddBoard} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New board title"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-1 rounded"
        >
          Add Board
        </button>
      </form>

      {/* Display Boards */}
      {data.boards.map((board: any) => (
        <div key={board.id} className="mb-6">
          <h2 className="text-xl font-semibold">{board.title}</h2>
          {board.lists.map((list: any) => (
            <div key={list.id} className="ml-6 mb-3">
              <h3 className="font-medium">{list.title}</h3>
              <ul className="ml-6 list-disc">
                {list.tasks.map((task: any) => (
                  <li key={task.id}>
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
