import { Link, useNavigate } from "react-router-dom";
import { Mail, Eye, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { api } from "../api/axios";
import { isAxiosError } from "axios";

const registerSchema = z.object({
  name: z.string().min(2, "Insira o seu nome completo."),
  email: z.email("Insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setAuthError(null);
    try {
      await api.post("/auth/register", data);

      navigate("/login");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setAuthError(
          error.response?.data?.message ||
            "Ocorreu um erro ao criar sua conta.",
        );
      } else {
        setAuthError("Ocorreu um erro inesperado.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-4 font-sans text-white">
      <div className="flex flex-col items-center w-full max-w-120 gap-14">
        <div className="text-center">
          <h1 className="text-[40px] font-bold leading-12 tracking-[-0.27px] text-white">
            Mini Twitter
          </h1>
        </div>

        <div className="flex flex-col w-full gap-6">
          <div className="flex border-b border-[#334155]">
            <Link
              to="/login"
              className="flex-1 pb-3 text-center text-[16px] leading-6 font-bold text-[#90A1B9] transition-colors hover:text-white"
            >
              Login
            </Link>
            <div className="flex-1 border-b-[3px] border-twitter-blue pb-3 text-center text-[16px] leading-6 font-bold text-[#FAFAFA]">
              Cadastrar
            </div>
          </div>

          <div className="flex flex-col gap-1 py-6">
            <h2 className="text-[30px] font-bold leading-9 tracking-[-0.75px] text-[#FAFAFA]">
              Olá, vamos começar!
            </h2>
            <p className="text-[16px] font-light leading-6 text-[#90A1B9]">
              Por favor, insira os dados solicitados para fazer cadastro.
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-5 text-[#FAFAFA]">
                Nome
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Insira o seu nome"
                  className="w-full h-14.25 bg-[#1D293D] border border-[#62748E] rounded-lg px-4 text-[16px] text-white placeholder-[#62748E] outline-none focus:border-twitter-blue transition-all"
                />
                <User className="absolute right-4 h-6 w-6 text-[#62748E]" />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-5 text-[#FAFAFA]">
                E-mail
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Insira o seu e-mail"
                  className="w-full h-14.25 bg-[#1D293D] border border-[#62748E] rounded-lg px-4 text-[16px] text-white placeholder-[#62748E] outline-none focus:border-twitter-blue transition-all"
                />
                <Mail className="absolute right-4 h-6 w-6 text-[#62748E]" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-5 text-[#FAFAFA]">
                Senha
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Insira a sua senha"
                  className="w-full h-13.75 bg-[#1D293D] border border-[#62748E] rounded-lg px-4 text-[16px] text-white placeholder-[#62748E] outline-none focus:border-twitter-blue transition-all"
                />
                <Eye className="absolute right-4 h-6 w-6 text-[#62748E] cursor-pointer" />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {authError && (
              <p className="text-center text-sm text-red-500">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full h-16 bg-twitter-blue rounded-full text-[16px] font-bold text-white shadow-[0px_10px_15px_-3px_rgba(13,147,242,0.2)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Continuar"
              )}
            </button>
          </form>

          <p className="px-21 mt-4 text-center text-[12px] leading-4 text-[#94A3B8]">
            Ao clicar em continuar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-slate-300">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-slate-300">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
