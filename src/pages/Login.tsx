import { Link } from 'react-router-dom';
import { Mail, Eye } from 'lucide-react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-4 font-sans text-white">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide">Mini Twitter</h1>
        </div>

        <div className="flex border-b border-slate-700/50">
          <div className="flex-1 border-b-2 border-blue-500 pb-3 text-center text-sm font-bold text-white">
            Login
          </div>
          <Link to="/register" className="flex-1 pb-3 text-center text-sm font-medium text-slate-400 transition-colors hover:text-white">
            Cadastrar
          </Link>
        </div>

        <form className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">E-mail</label>
            <div className="relative">
              <input type="email" placeholder="Insira o seu e-mail" className="w-full rounded-lg border border-slate-700 bg-[#151C2C] px-4 py-3 text-sm text-white outline-none focus:border-blue-500" />
              <Mail className="absolute right-4 top-3.5 h-5 w-5 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Senha</label>
            <div className="relative">
              <input type="password" placeholder="Insira a sua senha" className="w-full rounded-lg border border-slate-700 bg-[#151C2C] px-4 py-3 text-sm text-white outline-none focus:border-blue-500" />
              <Eye className="absolute right-4 top-3.5 h-5 w-5 text-slate-500" />
            </div>
          </div>

          <button type="submit" className="mt-4 w-full rounded-full bg-[#1DA1F2] py-3.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(29,161,242,0.4)]">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}