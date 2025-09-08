import ClipLoader from "react-spinners/ClipLoader";
import { LoaderButtonProps } from "@/types/common";

export default function LoaderButton({
  loading,
  children,
  ...props
}: LoaderButtonProps) {
  return (
    <button {...props}>
      {loading ? <ClipLoader size={14} color="#fff" /> : children}
    </button>
  );
}
