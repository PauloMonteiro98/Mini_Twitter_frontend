import { Search, Loader2, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isGuest: boolean;
  logoutLoading: boolean;
  onLogout: () => void;
}

export function TimelineHeader({
  searchTerm,
  setSearchTerm,
  isGuest,
  logoutLoading,
  onLogout,
}: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 flex h-16.25 w-full items-center border-b border-[#62748E] bg-[#0F172B]/80 px-10 backdrop-blur-md">
      <div className="flex w-1/4">
        <h1 className="text-[18px] font-bold tracking-tight text-white whitespace-nowrap">
          Mini Twitter
        </h1>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="flex h-10 w-full max-w-160 items-center gap-2 rounded-lg bg-[#1D293D] px-4 border border-transparent focus-within:border-twitter-blue transition-all">
          <Search className="h-5 w-5 text-[#62748E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por post..."
            className="w-full bg-transparent text-sm text-white placeholder-[#62748E] outline-none"
          />
        </div>
      </div>

      <div className="flex w-1/4 justify-end gap-4">
        {isGuest ? (
          <>
            <Link
              to="/register"
              className="flex h-10 items-center justify-center rounded-full border border-[#62748E] px-6 text-sm font-bold text-white hover:bg-white/5 whitespace-nowrap"
            >
              Registrar-se
            </Link>
            <Link
              to="/login"
              className="flex h-10 items-center justify-center rounded-full bg-twitter-blue px-8 text-sm font-bold text-white shadow-[0_4px_10px_rgba(13,147,242,0.3)] hover:bg-[#0B7DCE] whitespace-nowrap"
            >
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={onLogout}
            disabled={logoutLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D293D] text-white hover:bg-red-500/20 hover:text-red-500 disabled:opacity-50"
          >
            {logoutLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
