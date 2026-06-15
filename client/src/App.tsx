import { Route, Switch } from "wouter";
import { useEffect } from "react";
import Home from "@/pages/Home";
import AdminPanel from "@/pages/AdminPanel";
import DisplayEnhanced from "@/pages/DisplayEnhanced";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App() {
  useEffect(() => {
    // Limpa resquícios de versões anteriores
    localStorage.removeItem("manus-runtime-user-info");
  }, []);

  return (
    <Switch>
      {/* Login é a única rota pública */}
      <Route path="/login" component={Login} />

      {/* Rotas protegidas */}
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      </Route>
      <Route path="/display">
        <ProtectedRoute>
          <DisplayEnhanced />
        </ProtectedRoute>
      </Route>
      <Route path="/espelho">
        <ProtectedRoute>
          <DisplayEnhanced />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route>
        <div className="min-h-screen bg-[#03060D] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-gray-400">Página não encontrada</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}