import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import CreatePost from "../../components/post/PostCreationForm/CreatePost";
import PostCard from "../../components/post/PostViewCard/PostCard";
import type { Post } from "../../types";

export default function Timeline() {
  const navigate = useNavigate();

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/posts");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data?.posts)) return response.data.posts;
      return [];
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("@MiniTwitter:token");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#0F172B] to-[#070B14]">
      <header className="fixed top-0 z-50 flex h-16.25 w-full items-center justify-between border-b border-[#62748E] bg-[#0F172B]/80 px-10 backdrop-blur-md">
        <h1 className="w-37.5 text-[18px] font-bold tracking-tight text-white">
          Mini Twitter
        </h1>

        <div className="flex h-10 w-160 items-center gap-2 rounded-lg bg-[#1D293D] px-4">
          <Search className="h-5 w-5 text-[#62748E]" />
          <input
            type="text"
            placeholder="Buscar por post..."
            className="w-full bg-transparent text-sm text-white placeholder-[#62748E] outline-none"
          />
        </div>

        <div className="flex w-37.5 justify-end">
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D293D] text-white transition-colors hover:bg-red-500/20 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-160 flex-col gap-6 pb-20 pt-24.25">
        <CreatePost />

        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-twitter-blue" />
          </div>
        )}

        {isError && (
          <div className="p-4 text-center text-red-500">
            Erro ao carregar os posts. Tente novamente.
          </div>
        )}

        <div className="flex flex-col gap-8">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
