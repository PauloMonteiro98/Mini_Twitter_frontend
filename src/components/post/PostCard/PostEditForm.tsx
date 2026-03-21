import type { PostEditFormProps } from "@/types/index";
import { Check, ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export function PostEditForm({
  editTitle,
  editContent,
  editImage,
  isSaving,
  onChangeTitle,
  onChangeContent,
  onChangeImage,
  onSave,
  onCancel,
}: PostEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editImage ?? null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      onChangeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onChangeImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

      {imagePreview && (
        <div className="relative mt-2 w-full overflow-hidden rounded-lg bg-bg-tertiary">
          <img
            src={imagePreview}
            alt="Imagem do post"
            className="max-h-100 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
            title="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between ">
        <label
          className="cursor-pointer text-twitter-blue hover:text-blue-400 transition-colors"
          title={imagePreview ? "Trocar imagem" : "Adicionar imagem"}
        >
          <ImagePlus className="h-6 w-6" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <div className="flex gap-4">
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
    </div>
  );
}