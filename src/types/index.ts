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

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  likesCount: number;
  isLikedByCurrentUser: boolean
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