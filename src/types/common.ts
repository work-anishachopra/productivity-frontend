import { ButtonHTMLAttributes, ReactNode } from "react";

export type DeleteModalType =
  | { type: "board"; id: string; title: string }
  | { type: "list"; id: string; title: string }
  | { type: "task"; id: string; title: string }
  | { type: null; id: null; title: "" };

export interface LoaderButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  children: ReactNode;
  loaderColor?: string; // color of spinner
  loaderSize?: number; // size of spinner
  className?: string; // button classes (tailwind or css)
}
