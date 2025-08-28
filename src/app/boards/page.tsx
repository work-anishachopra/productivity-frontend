"use client";

import { gql, useQuery } from "@apollo/client";

const GET_BOARDS = gql`
  query GetBoards {
    boards {
      id
      title
      lists {
        id
        title
        tasks {
          id
          title
          completed
        }
      }
    }
  }
`;

export default function BoardsPage() {
  const { loading, error, data } = useQuery(GET_BOARDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="p-6" style={{ color: "violet" }}>
        <h1 className="text-2xl font-bold mb-4">Boards</h1>
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
    </>
  );
}
