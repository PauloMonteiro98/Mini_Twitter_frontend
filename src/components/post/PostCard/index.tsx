import { isAxiosError } from "axios";
import { api } from "../../../api/axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoggedUserId } from "../../../utils/auth";
import { Heart, Trash2, Loader2, Edit3, X, Check } from "lucide-react";
import type { Post } from "../../../types";
import type { PostUpdatePayload } from "../../../types";
import TextareaAutosize from "react-textarea-autosize";

interface PostProps {
  post: Post;
}

export default function PostCard({ post }: PostProps) {
  const queryClient = useQueryClient();
  const currentUserId = getLoggedUserId();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTitle, setEditTitle] = useState(post.title);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLikedLocally, setIsLikedLocally] = useState(() => {
    const likedPosts = JSON.parse(
      localStorage.getItem("@MiniTwitter:likedPosts") || "[]",
    );
    return likedPosts.includes(post.id);
  });

  const isOwner =
    currentUserId != null && String(currentUserId) === String(post.authorId);
  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: PostUpdatePayload = {
        title: editTitle || editContent.substring(0, 20).padEnd(3, "."),
        content: editContent,
      };

      if (typeof post.image === "string" && post.image.trim() !== "") {
        payload.image = post.image;
      } else {
        delete payload.image;
      }

      const response = await api.put(`/posts/${post.id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        console.error("Erro detalhado do backend:", error.response?.data);

        if (error.response?.status === 403) {
          alert("Erro 403: Você não tem permissão para editar este post.");
        } else if (error.response?.status === 400) {
          alert(
            "Erro de validação: Verifique se o conteúdo e o título estão preenchidos.",
          );
        }
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 403) {
        alert("Ação não autorizada.");
      }
    },
  });

  const handleLike = async () => {
    const newState = !isLikedLocally;
    setIsLikedLocally(newState);
    setLikesCount((prev) => (newState ? prev + 1 : prev - 1));
    try {
      await api.post(`/posts/${post.id}/like`);
    } catch {
      setIsLikedLocally(!newState);
      setLikesCount((prev) => (!newState ? prev + 1 : prev - 1));
    }
  };

  const authorName = post?.authorName || "Anônimo";
  const username = authorName.toLowerCase().replace(/\s+/g, "");

  const formattedDate = post?.createdAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(post.createdAt))
    : "-";

  return (
    <div className="group relative flex w-160 flex-col gap-3 rounded-xl border border-[#62748E] bg-[#1D293D] p-4 shadow-sm">
      {isOwner && !isEditing && (
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#62748E] hover:text-twitter-blue"
            title="Editar"
          >
            <Edit3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              if (confirm("Deseja excluir?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
            className="text-[#62748E] hover:text-red-500 disabled:opacity-50"
            title="Excluir"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white">{authorName}</span>
        <span className="text-sm text-[#6E767D]">@{username}</span>
        <span className="text-sm text-[#6E767D]">·</span>
        <span className="text-sm text-[#6E767D]">{formattedDate}</span>
      </div>
      <div className="flex w-full flex-col gap-1">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título"
              className="bg-transparent text-[18px] font-bold text-white placeholder:text-[#62748E] outline-none"
            />
            <TextareaAutosize
              id="content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Editando..."
              className="w-full resize-none overflow-hidden bg-transparent text-[16px] text-[#CBD5E1] placeholder-[#62748E] outline-none py-2"
              rows={3}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                  setEditTitle(post.title);
                }}
                className="flex items-center gap-1 text-sm text-[#6E767D] hover:text-white"
              >
                <X className="h-4 w-4" /> Cancelar
              </button>
              <button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1 rounded-md bg-twitter-blue px-3 py-1 text-sm font-bold text-white hover:bg-[#0B7DCE] disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {post.title && (
              <h3 className="text-[18px] font-bold text-white">{post.title}</h3>
            )}
            <p className="text-[16px] leading-6.5 text-[#CBD5E1] whitespace-pre-wrap">
              {post.content}
            </p>
          </>
        )}
      </div>
      {!isEditing && post.image && (
        <div className="mt-2 w-full overflow-hidden rounded-lg bg-[#01274E]">
          <img
            src={post.image}
            alt="Anexo"
            className="max-h-100 w-full object-cover"
          />
        </div>
      )}
      <div className="flex w-full items-center">
        <button
          onClick={handleLike}
          className="group/like flex items-center gap-2"
        >
          <Heart
            className={`h-6 w-6 ${isLikedLocally ? "fill-[#EB5757] text-[#EB5757]" : "text-[#62748E]"}`}
          />
          <span className="text-sm text-[#62748E]">{likesCount}</span>
        </button>
      </div>
    </div>
  );
}
