import type { PostLikeButtonProps } from "@/types/index";
import { Heart } from "lucide-react";

export function PostLikeButton({
  isLiked,
  onLike,
}: PostLikeButtonProps) {
  return (
    <button onClick={onLike} className="group/like flex items-center gap-2" aria-label="curtir">
      <Heart
        className={`h-6 w-6 ${isLiked ? "fill-[#EB5757] text-[#EB5757]" : "text-[#EB5757]"}`}
      />
    </button>
  );
}
