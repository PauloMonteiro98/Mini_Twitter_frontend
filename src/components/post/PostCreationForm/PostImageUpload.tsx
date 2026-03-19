import { ImagePlus, X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PostImageUploadProps {
  imagePreview: string | null;
  imageError?: string;
  register: Omit<UseFormRegisterReturn, "onChange">;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function PostImagePreview({
  imagePreview,
  imageError,
  onRemoveImage,
}: Pick<
  PostImageUploadProps,
  "imagePreview" | "imageError" | "onRemoveImage"
>) {
  return (
    <>
      {imagePreview && (
        <div className="relative mt-3 w-fit">
          <img
            src={imagePreview}
            alt="Pré-visualização"
            className="max-h-100 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {imageError && <p className="mt-1 text-xs text-red-500">{imageError}</p>}
    </>
  );
}

export function PostImageUploadButton({
  register,
  onImageChange,
}: Pick<PostImageUploadProps, "register" | "onImageChange">) {
  return (
    <label className="cursor-pointer text-twitter-blue transition-colors hover:text-blue-400">
      <ImagePlus className="h-8 w-8" />
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={onImageChange}
        {...register}
      />
    </label>
  );
}
