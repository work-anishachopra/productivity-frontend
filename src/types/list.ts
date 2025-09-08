import { TaskType } from "./task";

export interface ListType {
  id: string;
  title: string;
  tasks: TaskType[];
}
