import { create } from "zustand";
import type { AuthState } from "../types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user, token) => {
    localStorage.setItem("@MiniTwitter:token", token);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("@MiniTwitter:token");
    set({ user: null, isAuthenticated: false });
  },
}));
