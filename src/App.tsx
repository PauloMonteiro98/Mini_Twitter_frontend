import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Timeline from "./pages/timeline/index";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/timeline" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white">
                <h1 className="text-2xl">404 - Página não encontrada</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
