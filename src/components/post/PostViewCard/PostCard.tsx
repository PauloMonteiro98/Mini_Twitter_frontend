import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../api/axios";
import type { Post } from "../../../types";

interface PostProps {
  post: Post;
}

export default function PostCard({ post }: PostProps) {
  const queryClient = useQueryClient();
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLikedLocally, setIsLikedLocally] = useState(false);
  const authorName = post?.authorName || "Anônimo";
  const username = authorName.toLowerCase().replace(/\s+/g, "");
  const formattedDate = post?.createdAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(post.createdAt))
    : "-";

  const likeMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/posts/${post.id}/like`);
    },
    onError: () => {
      setIsLikedLocally(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    setLikesCount((prev) => (isLikedLocally ? prev - 1 : prev + 1));
    setIsLikedLocally(!isLikedLocally);
    likeMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div className="flex w-160 flex-col items-start gap-3 rounded-xl border border-[#62748E] bg-[#1D293D] p-4 shadow-sm relative group">
      <button
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
        className="absolute right-4 top-4 text-[#62748E] opacity-0 transition-all hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
        title="Deletar post"
      >
        {deleteMutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>

      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white">{authorName}</span>
        <span className="text-sm text-[#6E767D]">@{username}</span>
        <span className="text-sm text-[#6E767D]">·</span>
        <span className="text-sm text-[#6E767D]">{formattedDate}</span>
      </div>

      <div className="flex w-full flex-col gap-1">
        {post.title && (
          <h3 className="text-lg font-bold text-white">{post.title}</h3>
        )}
        <p className="text-[16px] leading-6.5 text-[#CBD5E1]">{post.content}</p>
      </div>

      {post.image && (
        <div className="mt-2 w-full overflow-hidden rounded-lg bg-[#01274E]">
          <img
            src={post.image}
            alt="Anexo"
            className="max-h-75 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-1 flex w-full items-center">
        <button
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="group flex items-center gap-2 transition-colors disabled:opacity-70"
        >
          <Heart
            className={`h-6 w-6 transition-all group-hover:text-[#EB5757] group-hover:scale-110 
              ${isLikedLocally ? "fill-[#EB5757] text-[#EB5757]" : "text-[#62748E]"}`}
          />
          {likesCount > 0 && (
            <span
              className={`text-sm font-medium transition-colors group-hover:text-[#EB5757] 
              ${isLikedLocally ? "text-[#EB5757]" : "text-[#62748E]"}`}
            >
              {likesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
