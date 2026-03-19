import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0B1120] px-4 text-center">
      <span className="pointer-events-none select-none text-[12rem] font-black text-twitter-blue/5 sm:text-[20rem]">
        404
      </span>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mx-auto max-w-sm text-lg text-slate-400">
            Parece que a página que você está procurando nunca existiu.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/timeline")}
            className="flex items-center justify-center gap-2 rounded-full bg-twitter-blue px-8 py-3 font-bold text-white shadow-lg shadow-twitter-blue/20 transition-all hover:bg-[#1a8cd8] active:scale-95"
          >
            <Home className="h-5 w-5" />
            Ir para a Timeline
          </button>
        </div>
      </motion.div>
    </div>
  );
}
