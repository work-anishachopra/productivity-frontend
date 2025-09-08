import { DeleteModalType } from "./common";

export interface TaskType {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskProps {
  task: TaskType;
  index: number;
  setDeleteModal: (modal: DeleteModalType) => void;
}
