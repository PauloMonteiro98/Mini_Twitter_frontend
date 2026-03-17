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