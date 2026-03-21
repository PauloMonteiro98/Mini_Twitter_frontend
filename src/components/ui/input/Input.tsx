import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { forwardRef, useState } from "react";
import { EyeOff } from "lucide-react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, type, ...props }, ref) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        <label className="text-[14px] leading-5 text-text-muted">{label}</label>

        <div className="relative flex items-center">
          <input
            ref={ref}
            {...props}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className="w-full h-14.25 bg-bg-secondary border border-border rounded-lg px-4 text-[16px] text-text-muted placeholder:text-text-muted outline-none focus:border-twitter-blue transition-all"
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 text-text-muted hover:text-text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Icon className="h-6 w-6" />
              )}
            </button>
          ) : (
            <Icon className="absolute right-4 h-6 w-6 text-text-muted" />
          )}
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
