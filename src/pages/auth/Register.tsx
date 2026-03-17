import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Eye, Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { api } from "../../api/axios";
import { Input } from "../../components/Input/Index";
import { AuthLayout } from "../../layouts/AuthLayout";

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
        <Input
          label="Nome"
          icon={User}
          placeholder="Insira o seu nome"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="E-mail"
          type="email"
          icon={Mail}
          placeholder="Insira o seu e-mail"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Senha"
          type="password"
          icon={Eye}
          placeholder="Insira a sua senha"
          error={errors.password?.message}
          {...register("password")}
        />

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
