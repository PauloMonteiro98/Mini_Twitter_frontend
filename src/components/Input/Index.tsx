import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[14px] leading-5 text-[#FAFAFA]">{label}</label>

        <div className="relative flex items-center">
          <input
            ref={ref}
            {...props}
            className="w-full h-14 bg-[#1D293D] border border-[#62748E] rounded-lg px-4 text-[16px] text-white placeholder-[#62748E] outline-none focus:border-twitter-blue transition-all"
          />
          <Icon className="absolute right-4 h-6 w-6 text-[#62748E]" />
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
