import type { PostLikeButtonProps } from "@/types/Index";
import { Heart } from "lucide-react";

export function PostLikeButton({
  isLiked,
  likesCount,
  onLike,
}: PostLikeButtonProps) {
  return (
    <button onClick={onLike} className="group/like flex items-center gap-2">
      <Heart
        className={`h-6 w-6 ${isLiked ? "fill-[#EB5757] text-[#EB5757]" : "text-[#62748E]"}`}
      />
      <span className="text-sm text-[#62748E]">{likesCount}</span>
    </button>
  );
}
