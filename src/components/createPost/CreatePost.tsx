import { ImagePlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";

const createPostSchema = z.object({
  content: z.string().min(1, "O post não pode estar vazio."),
  image: z.union([z.string().url(), z.literal("")]).optional(),
});

type CreatePostInputs = z.infer<typeof createPostSchema>;

export default function CreatePost() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePostInputs>({
    resolver: zodResolver(createPostSchema),
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostInputs) => {
      const payload = {
        title: data.content.substring(0, 20) + "...",
        content: data.content,
        imageUrl: data.image || undefined,
      };
      const response = await api.post("/posts", payload);
      return response.data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = (data: CreatePostInputs) => {
    createPostMutation.mutate(data);
  };

  return (
    <div className="flex w-160 flex-col rounded-xl border border-[#62748E] bg-[#1D293D] p-4 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <textarea
          placeholder="E aí, o que está rolando?"
          {...register("content")}
          className="min-h-15 w-full resize-none bg-transparent text-lg text-white placeholder-[#62748E] outline-none"
        />

        <div className="mt-2 flex items-center justify-between border-t border-[#62748E]/30 pt-3">
          <div className="flex items-center gap-2 text-twitter-blue">
            <ImagePlus className="h-6 w-6" />
            <input
              type="text"
              placeholder="URL da imagem (opcional)"
              {...register("image")}
              className="w-50 bg-transparent text-sm text-white placeholder-[#62748E] outline-none"
            />
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
