import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  activeTab: "login" | "register";
}

export function AuthLayout({
  children,
  title,
  subtitle,
  activeTab,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-start justify-center pt-25 bg-bg-primary">
      <div className="flex flex-col items-center w-full max-w-120 gap-14">
        <div className="text-center">
          <h1 className="text-[40px] font-bold leading-12 tracking-[-0.27px] text-title-primary">
            Mini Twitter
          </h1>
        </div>

        <div className="flex flex-col w-full gap-6">
          <div className="flex border-b border-border">
            <Link
              to="/login"
              className={`flex-1 pb-3 text-center text-[16px] leading-6 font-bold transition-colors ${
                activeTab === "login"
                  ? "border-b-[3px] border-twitter-blue text-title-primary"
                  : "text-text-muted"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`flex-1 pb-3 text-center text-[16px] leading-6 font-bold transition-colors ${
                activeTab === "register"
                  ? "border-b-[3px] border-twitter-blue text-title-primary"
                  : "text-text-muted"
              }`}
            >
              Cadastrar
            </Link>
          </div>

          <div className="flex flex-col gap-1 py-6">
            <h2 className="text-[30px] font-bold leading-9 tracking-[-0.75px] text-title-primary">
              {title}
            </h2>
            <p className="text-[16px] font-light leading-6 text-text-muted">
              {subtitle}
            </p>
          </div>

          {children}

          <p className="px-21 mt-4 text-center text-[12px] leading-4 text-text-primary">
            Ao clicar em continuar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-text-primary">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-text-primary">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
