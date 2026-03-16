export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  authorId: string;
  createdAt: string;
  author: {
    name: string;
  };
}