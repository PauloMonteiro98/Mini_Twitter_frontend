import type { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  activeTab: "login" | "register";
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  isLikedByCurrentUser: boolean;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export type PostUpdatePayload = {
  title: string;
  content: string;
  image?: string;
};

export interface CreatePostProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface PostHeaderProps {
  authorName: string;
  username: string;
  formattedDate: string;
}

export interface PostActionsProps {
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export interface PostEditFormProps {
  editTitle: string;
  editContent: string;
  isSaving: boolean;
  onChangeTitle: (value: string) => void;
  onChangeContent: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface PostLikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
}
