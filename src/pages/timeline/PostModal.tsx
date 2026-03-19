import { ImagePlus } from "lucide-react";

export function PostModal({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col pb-4 items-center justify-center rounded-xl border border-border bg-bg-secondary p-5 w-full h-41.25 text-text-muted hover:border-twitter-blue hover:bg-bg-secondary/90 transition-all shadow-md"
    >
      <p className="text-[18px] w-full text-left font-medium text-text-muted">
        E aí, o que está rolando?
      </p>
      <div className="mt-auto flex justify-between items-center border-t border-border/20 pt-4 w-full">
        <ImagePlus className="h-8 w-8 text-twitter-blue opacity-70" />
        <div className="flex items-center justify-center h-9 px-4.5 rounded-full bg-twitter-blue font-bold text-white shadow-lg">
          Postar
        </div>
      </div>
    </div>
  );
}
