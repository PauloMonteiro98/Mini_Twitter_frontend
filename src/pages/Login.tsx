import { Mail, Eye, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios";
import { isAxiosError } from "axios";
import { AuthLayout } from "../layouts/AuthLayout";

const loginSchema = z.object({
  email: z.email("Insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setAuthError(null);
    try {
      const response = await api.post("/auth/login", data);
      localStorage.setItem("@MiniTwitter:token", response.data.token);
      navigate("/timeline");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setAuthError(
          error.response?.data?.message || "E-mail ou senha incorretos.",
        );
      } else {
        setAuthError("Ocorreu um erro inesperado ao iniciar sessão.");
      }
    }
  };

  return (
    <AuthLayout
      title="Olá, de novo!"
      subtitle="Por favor, insira os seus dados para fazer login."
      activeTab="login"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-5 text-[#FAFAFA]">E-mail</label>
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
          <label className="text-[14px] leading-5 text-[#FAFAFA]">Senha</label>
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
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {authError && (
          <p className="text-center text-sm text-red-500">{authError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full h-14 bg-twitter-blue rounded-full text-[16px] font-bold text-white shadow-[0px_10px_15px_-3px_rgba(13,147,242,0.2)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Continuar"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
