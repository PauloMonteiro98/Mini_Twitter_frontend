import type { PostHeaderProps } from "@/types/Index";

export function PostHeader({
  authorName,
  username,
  formattedDate,
}: PostHeaderProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-white">{authorName}</span>
      <span className="text-sm text-[#6E767D]">@{username}</span>
      <span className="text-sm text-[#6E767D]">·</span>
      <span className="text-sm text-[#6E767D]">{formattedDate}</span>
    </div>
  );
}
