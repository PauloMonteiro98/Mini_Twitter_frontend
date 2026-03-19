import type { PostActionsProps } from "@/types/Index";
import { Edit3, Loader2, Trash2 } from "lucide-react";

export function PostActions({
  isDeleting,
  onEdit,
  onDelete,
}: PostActionsProps) {
  return (
    <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-all group-hover:opacity-100">
      <button
        onClick={onEdit}
        className="text-[#62748E] hover:text-twitter-blue"
        title="Editar"
      >
        <Edit3 className="h-5 w-5" />
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="text-[#62748E] hover:text-red-500 disabled:opacity-50"
        title="Excluir"
      >
        {isDeleting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
