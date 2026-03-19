import type { PostEditFormProps } from "@/types/Index";
import { Check, Loader2, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export function PostEditForm({
  editTitle,
  editContent,
  isSaving,
  onChangeTitle,
  onChangeContent,
  onSave,
  onCancel,
}: PostEditFormProps) {
  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={editTitle}
        onChange={(e) => onChangeTitle(e.target.value)}
        placeholder="Título"
        className="bg-transparent text-[16px] font-bold text-text-primary placeholder:text-text-muted outline-none"
      />
      <TextareaAutosize
        id="content"
        value={editContent}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder="Editando..."
        className="w-full resize-none overflow-hidden bg-transparent text-[16px] text-text-primary placeholder:text-text-muted outline-none py-1.5"
        rows={3}
      />
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" /> Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 rounded-md bg-twitter-blue px-3 py-1 text-sm font-bold text-white hover:bg-[#0B7DCE] disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="h-4 w-4" /> Salvar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
