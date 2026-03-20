import { Edit3, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { PostActionsProps } from "@/types/index";

export function PostActions({
  isDeleting,
  onEdit,
  onDelete,
}: PostActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-all group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="text-text-muted hover:text-twitter-blue transition-colors"
          title="Editar"
        >
          <Edit3 className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isDeleting}
          className="text-text-muted hover:text-red-500 disabled:opacity-50 transition-colors"
          title="Excluir"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm rounded-2xl bg-bg-secondary p-6 shadow-2xl ring-1 ring-border/50 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>

              <h3 className="mb-2 text-xl font-bold text-text-primary">
                Excluir este post?
              </h3>
              <p className="mb-6 text-sm text-text-muted leading-relaxed">
                Essa ação não pode ser desfeita. O post será removido
                permanentemente da timeline.
              </p>
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title="Confirmar exclusão"
                  className="flex h-12 w-full items-center justify-center rounded-full bg-red-500 font-bold text-white hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-70 shadow-md shadow-red-500/20"
                >
                  {isDeleting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Excluir"
                  )}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="h-12 w-full rounded-full border border-border bg-transparent font-bold text-text-primary hover:bg-border/50 active:scale-[0.98] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
