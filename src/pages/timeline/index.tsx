import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, LogOut, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/axios";
import CreatePost from "../../components/post/PostCreationForm/CreatePost";
import PostCard from "../../components/post/PostViewCard/PostCard";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { getLoggedUserId } from "../../utils/auth";
import type { Post } from "../../types";

interface InfinitePostResponse {
  posts: Post[];
  nextPage: number | undefined;
}

export default function Timeline() {
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUserId = getLoggedUserId();
  const isGuest = !currentUserId;
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<InfinitePostResponse>({
    queryKey: ["posts", searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;
      const response = await api.get("/posts", {
        params: {
          page: page,
          search: searchTerm || undefined,
        },
      });

      const resData = response.data;
      let postsArray: Post[] = [];

      if (Array.isArray(resData)) {
        postsArray = resData;
      } else {
        postsArray = resData?.data || resData?.posts || [];
      }

      return {
        posts: postsArray,
        nextPage: postsArray.length === 10 ? page + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSettled: () => {
      logoutUser();
      navigate("/timeline");
    },
  });

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#0F172B] to-[#070B14]">
      <header className="fixed top-0 z-50 flex h-16.25 w-full items-center justify-between border-b border-[#62748E] bg-[#0F172B]/80 px-10 backdrop-blur-md">
        <h1 className="w-37.5 text-[18px] font-bold tracking-tight text-white">
          Mini Twitter
        </h1>

        <div className="flex h-10 w-160 items-center gap-2 rounded-lg bg-[#1D293D] px-4 border border-transparent focus-within:border-twitter-blue transition-all">
          <Search className="h-5 w-5 text-[#62748E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por post..."
            className="w-full bg-transparent text-sm text-white placeholder-[#62748E] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {isGuest ? (
            <>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center rounded-full border border-[#62748E] px-9 text-sm font-bold text-white transition-all hover:bg-white/5"
              >
                Registrar-se
              </Link>

              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-full bg-twitter-blue px-15 text-sm font-bold text-white shadow-[0_4px_10px_rgba(13,147,242,0.3)] transition-all hover:bg-[#0B7DCE]"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D293D] text-white transition-colors hover:bg-red-500/20 hover:text-red-500 disabled:opacity-50"
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-160 flex-col gap-6 pb-20 pt-24.25">
        {!isGuest && <CreatePost />}

        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-twitter-blue" />
          </div>
        )}

        {isError && (
          <div className="p-4 text-center text-red-500">
            Erro ao carregar os posts.
          </div>
        )}

        <div className="flex flex-col gap-8">
          {data?.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="flex flex-col gap-8">
              {page.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ))}
        </div>

        <div ref={ref} className="flex justify-center p-8">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-twitter-blue" />
          ) : hasNextPage ? (
            <span className="text-[#62748E] text-sm italic">
              Carregando mais...
            </span>
          ) : (
            data && (
              <span className="text-[#62748E] text-sm">Fim da timeline</span>
            )
          )}
        </div>
      </main>
    </div>
  );
}
