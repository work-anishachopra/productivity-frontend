import ClipLoader from "react-spinners/ClipLoader";
import { LoaderButtonProps } from "@/types/common";

export default function LoaderButton({
  loading,
  children,
  loaderColor = "#ffffff",
  loaderSize = 14,
  className = "",
  ...props
}: LoaderButtonProps) {
  return (
    <button
      className={`flex items-center justify-center ${className}`}
      {...props}
    >
      {loading ? (
        <ClipLoader size={loaderSize} color={loaderColor} />
      ) : (
        children
      )}
    </button>
  );
}
