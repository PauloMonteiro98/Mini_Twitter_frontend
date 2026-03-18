import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../api/axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createPostSchema = z.object({
  content: z.string().min(1, "O post não pode estar vazio."),
  image: z
    .any()
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

export default function CreatePost() {
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostInputs) => {
      let base64Image = undefined;

      if (data.image && data.image.length > 0) {
        base64Image = await convertFileToBase64(data.image[0]);
      }

      const payload = {
        title: data.content.substring(0, 20) + "...",
        content: data.content,
        image: base64Image,
      };

      const response = await api.post("/posts", payload);
      return response.data;
    },
    onSuccess: () => {
      reset();
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = (data: CreatePostInputs) => {
    createPostMutation.mutate(data);
  };

  const { onChange, ...restImageRegister } = register("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
    onChange(e);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", undefined);
  };

  return (
    <div className="flex w-160 min-h-41.25 flex-col rounded-xl border border-[#62748E] bg-[#1D293D] p-4 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <textarea
          placeholder="E aí, o que está rolando?"
          {...register("content")}
          className="min-h-15 w-full resize-none bg-transparent text-lg text-white placeholder-[#62748E] outline-none"
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
        )}

        {imagePreview && (
          <div className="relative mt-3 w-fit">
            <img
              src={imagePreview}
              alt="Pré-visualização"
              className="max-h-50 rounded-lg border border-[#62748E] object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {errors.image && (
          <p className="mt-1 text-xs text-red-500">
            {errors.image.message as string}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-[#62748E]/30 pt-3">
          <div className="flex items-center">
            <label className="cursor-pointer text-twitter-blue transition-colors hover:text-blue-400">
              <ImagePlus className="h-6 w-6" />
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleImageChange}
                {...restImageRegister}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createPostMutation.isPending}
            className="flex h-9 w-21.25 items-center justify-center rounded-full bg-twitter-blue text-sm font-bold text-white shadow-[0_4px_6px_-1px_rgba(13,147,242,0.2)] transition-all hover:bg-blue-500 disabled:opacity-50"
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
