import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";

import { api } from "@/api";
import { getLoggedUserId } from "@/utils/auth";

import { PostActions } from "./PostActions";
import { PostEditForm } from "./PostEditForm";
import { PostHeader } from "./PostHeader";
import { PostLikeButton } from "./PostLikeButton";

import type { Post, PostUpdatePayload } from "@/types/Index";

const getLikedPostsKey = (userId: string | number) =>
  `@MiniTwitter:likedPosts:${userId}`;

const getLikedPosts = (userId: string | number): number[] =>
  JSON.parse(localStorage.getItem(getLikedPostsKey(userId)) || "[]");

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
    if (!currentUserId) return false;
    return getLikedPosts(currentUserId).includes(post.id);
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
    if (!currentUserId) return;

    const newState = !isLikedLocally;
    const likedPosts = getLikedPosts(currentUserId);
    const key = getLikedPostsKey(currentUserId);

    const updated = newState
      ? [...likedPosts, post.id]
      : likedPosts.filter((id) => id !== post.id);
    localStorage.setItem(key, JSON.stringify(updated));

    setIsLikedLocally(newState);
    setLikesCount((prev) => (newState ? prev + 1 : prev - 1));

    try {
      await api.post(`/posts/${post.id}/like`);
    } catch {
      localStorage.setItem(key, JSON.stringify(likedPosts));
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
    <div className="group relative flex w-160 flex-col gap-3 rounded-xl border border-border bg-bg-secondary transition-all p-4 shadow-sm">
      {isOwner && !isEditing && (
        <PostActions
          isDeleting={deleteMutation.isPending}
          onEdit={() => setIsEditing(true)}
          onDelete={() => {
            if (confirm("Deseja excluir?")) deleteMutation.mutate();
          }}
        />
      )}

      <PostHeader
        authorName={authorName}
        username={username}
        formattedDate={formattedDate}
      />

      <div className="flex w-full flex-col gap-1">
        {isEditing ? (
          <PostEditForm
            editTitle={editTitle}
            editContent={editContent}
            isSaving={updateMutation.isPending}
            onChangeTitle={setEditTitle}
            onChangeContent={setEditContent}
            onSave={() => updateMutation.mutate()}
            onCancel={() => {
              setIsEditing(false);
              setEditContent(post.content);
              setEditTitle(post.title);
            }}
          />
        ) : (
          <>
            {post.title && (
              <h3 className="text-[16px] font-bold text-text-primary">
                {post.title}
              </h3>
            )}
            <p className="text-[16px] leading-6.5 text-text-primary whitespace-pre-wrap">
              {post.content}
            </p>
          </>
        )}
      </div>

      {!isEditing && post.image && (
        <div className="mt-2 w-full overflow-hidden rounded-lg bg-bg-tertiary">
          <img
            src={post.image}
            alt="Anexo"
            className="max-h-100 w-full object-cover"
          />
        </div>
      )}

      <div className="flex w-full items-center">
        <PostLikeButton
          isLiked={isLikedLocally}
          likesCount={likesCount}
          onLike={handleLike}
        />
      </div>
    </div>
  );
}
