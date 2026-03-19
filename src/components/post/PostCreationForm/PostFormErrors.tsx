import type { FieldErrors } from "react-hook-form";

interface PostFormErrorsProps {
  errors: FieldErrors<{ title: string; content: string; image?: string }>;
}

export function PostFormErrors({ errors }: PostFormErrorsProps) {
  if (!errors.title && !errors.content) return null;

  return (
    <div className="flex flex-col gap-1 pb-3 border-b border-[#62748E]/20 mb-2">
      {errors.title && (
        <span className="text-xs text-red-500 font-medium px-1">
          • {errors.title.message}
        </span>
      )}
      {errors.content && (
        <span className="text-xs text-red-500 font-medium px-1">
          • {errors.content.message}
        </span>
      )}
    </div>
  );
}
