import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
  );
}
