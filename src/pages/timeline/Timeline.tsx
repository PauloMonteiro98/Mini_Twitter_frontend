import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

import { api } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";

import PostCard from "@/components/post/postCard";
import PostCreationForm from "@/components/post/postCreationForm";

import { PostModal } from "./PostModal";
import { TimelineHeader } from "./TimelineHeader";

import { useDebounce } from "@/hooks/useDebounce";
import { getLoggedUserId } from "@/utils/auth";

import type { Post } from "@/types/Index";
import { TimelineFooter } from "./TimelineFooter";

export default function Timeline() {
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  } = useInfiniteQuery({
    queryKey: ["posts", debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/posts", {
        params: { page: pageParam, search: searchTerm || undefined },
      });
      const resData = response.data;
      const postsArray = Array.isArray(resData)
        ? resData
        : resData?.data || resData?.posts || [];

      return {
        posts: postsArray,
        nextPage:
          postsArray.length === 10 ? (pageParam as number) + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
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
    <div className="relative min-h-screen bg-bg-primary transition-all">
      <TimelineHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isGuest={isGuest}
        logoutLoading={logoutMutation.isPending}
        onLogout={() => logoutMutation.mutate()}
      />

      <main className="mx-auto flex w-160 flex-col gap-6 pb-20 pt-24.25">
        {!isGuest && <PostModal onClick={() => setIsModalOpen(true)} />}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-100 flex items-start justify-center bg-bg-primary/90 backdrop-blur-sm pt-24.25 px-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-full max-w-160 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <PostCreationForm
                onSuccess={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-twitter-blue" />
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Erro ao carregar os posts.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {data?.pages.map((page, i) => (
              <div key={i} className="flex flex-col gap-8">
                {page.posts.map((post: Post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ))}
          </div>
        )}

        <div ref={ref} className="flex justify-center p-32">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-twitter-blue" />
          ) : hasNextPage ? (
            <span className="text-text-muted text-sm italic">
              Carregando mais...
            </span>
          ) : (
            data && (
              <span className="text-text-muted text-sm">Fim da timeline</span>
            )
          )}
        </div>
      </main>
      <TimelineFooter />
    </div>
  );
}
