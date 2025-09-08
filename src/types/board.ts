import { ListType } from "./list";
import { DeleteModalType } from "./common";

export interface BoardType {
  id: string;
  title: string;
  lists: ListType[];
}

export interface BoardProps {
  board: BoardType;
  setDeleteModal: (modal: DeleteModalType) => void;
}
