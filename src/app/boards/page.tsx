"use client";

import { gql, useQuery } from "@apollo/client";

const GET_BOARDS = gql`
  query GetBoards {
    boards {
      id
      name
    }
  }
`;

export default function BoardsPage() {
  const { loading, error, data } = useQuery(GET_BOARDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Boards</h1>
      <ul>
        {data.boards.map((board: any) => (
          <li key={board.id}>{board.name}</li>
        ))}
      </ul>
    </div>
  );
}
