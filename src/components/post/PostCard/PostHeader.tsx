import type { PostHeaderProps } from "@/types/index";

export function PostHeader({
  authorName,
  username,
  formattedDate,
}: PostHeaderProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-text-primary">{authorName}</span>
      <span className="text-sm text-text-muted">@{username}</span>
      <span className="text-sm text-text-muted">·</span>
      <span className="text-sm text-text-muted">{formattedDate}</span>
    </div>
  );
}
