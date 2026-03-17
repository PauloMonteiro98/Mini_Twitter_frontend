import { Heart } from 'lucide-react';
import type { Post } from '../../types';

interface PostProps {
  post: Post;
}

export default function PostCard({ post }: PostProps) {
  const authorName = post?.author?.name || 'Anônimo';
  const username = authorName.toLowerCase().replace(/\s+/g, '');

  const formattedDate = post?.createdAt 
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(post.createdAt))
    : 'Data desconhecida';

  return (
    <div className="flex w-160 flex-col items-start gap-3 rounded-xl border border-[#62748E] bg-[#1D293D] p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white">{authorName}</span>
        <span className="text-sm text-[#6E767D]">@{username}</span>
        <span className="text-sm text-[#6E767D]">·</span>
        <span className="text-sm text-[#6E767D]">{formattedDate}</span>
      </div>

      <div className="flex w-full flex-col gap-1">
        {post.title && (
          <h3 className="text-lg font-bold text-white">{post.title}</h3>
        )}
        <p className="text-[16px] leading-6.5 text-[#CBD5E1]">
          {post.content}
        </p>
      </div>

      {post.imageUrl && (
        <div className="mt-2 w-full overflow-hidden rounded-lg bg-[#01274E]">
          <img 
            src={post.imageUrl} 
            alt="Anexo do post" 
            className="max-h-75 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-1 flex w-full items-center">
        <button className="flex items-center gap-2 transition-colors hover:text-[#EB5757]">
          <Heart className="h-6 w-6 text-[#62748E] transition-colors hover:text-[#EB5757]" />
          {post.likesCount > 0 && (
            <span className="text-sm font-medium text-[#62748E]">{post.likesCount}</span>
          )}
        </button>
      </div>
      
    </div>
  );
}