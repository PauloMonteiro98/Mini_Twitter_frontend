import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/api/index";
import type { CreatePostProps } from "@/types/index";

import { PostCreationFormFields } from "./PostCreationFormFields";
import { PostFormErrors } from "./PostFormErrors";
import { PostImagePreview, PostImageUploadButton } from "./PostImageUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createPostSchema = z.object({
  title: z.string().min(3, "O título precisa de pelo menos 3 caracteres."),
  content: z.string().min(1, "O conteúdo não pode estar vazio."),
  image: z
    .instanceof(FileList)
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      "A imagem não pode ultrapassar 5MB.",
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Formato inválido. Use JPEG, PNG ou WEBP.",
    )
    .optional(),
});

type CreatePostInputs = z.infer<typeof createPostSchema>;

export default function PostCreationForm({
  onSuccess,
  onCancel,
}: CreatePostProps) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostInputs>({
    resolver: zodResolver(createPostSchema),
  });

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostInputs) => {
      let base64Image = undefined;
      if (data.image && data.image.length > 0) {
        base64Image = await convertFileToBase64(data.image[0]);
      }
      const response = await api.post("/posts", {
        title: data.title,
        content: data.content,
        image: base64Image,
      });
      return response.data;
    },
    onSuccess: () => {
      reset();
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
    },
  });

  const { onChange: onImageChange, ...restImageRegister } = register("image");
  const { ref: contentRef, ...contentRegister } = register("content");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
    onImageChange(e);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", undefined);
  };

  return (
    <div className="flex w-160 flex-col rounded-xl border border-border bg-bg-secondary p-4 shadow-sm">
      <div className="flex justify-end mb-2">
        <button
          onClick={onCancel}
          className="text-text-muted hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form
        onSubmit={handleSubmit((data) => createPostMutation.mutate(data))}
        className="flex w-full flex-col"
      >
        <PostCreationFormFields
          titleRegister={register("title")}
          contentRegister={contentRegister}
          contentRef={contentRef}
        />

        <PostFormErrors errors={errors} />

        <PostImagePreview
          imagePreview={imagePreview}
          imageError={errors.image?.message as string | undefined}
          onRemoveImage={removeImage}
        />

        <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center">
            <PostImageUploadButton
              register={restImageRegister}
              onImageChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || createPostMutation.isPending}
            className="flex h-8.25 w-23 items-center justify-center rounded-full bg-twitter-blue text-sm font-bold text-white shadow-[0_4px_6px_-1px_rgba(13,147,242,0.2)] transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            {createPostMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Postar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
