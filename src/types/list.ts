import { TaskType } from "./task";
import { DeleteModalType } from "./common";

export interface ListType {
  id: string;
  title: string;
  tasks: TaskType[];
}

export interface ListProps {
  list: ListType;
  setDeleteModal: (modal: DeleteModalType) => void;
}
