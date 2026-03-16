import { Mail, Eye, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios";
import { isAxiosError } from "axios";
import { AuthLayout } from "../layouts/AuthLayout";

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
    <AuthLayout
      title="Olá, vamos começar!"
      subtitle="Por favor, insira os dados solicitados para fazer cadastro."
      activeTab="register"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-5 text-[#FAFAFA]">Nome</label>
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
          className="mt-2 w-full h-16 bg-twitter-blue rounded-full text-[16px] font-bold text-white shadow-[0px_10px_15px_-3px_rgba(13,147,242,0.2)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
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
