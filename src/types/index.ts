export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  likesCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}