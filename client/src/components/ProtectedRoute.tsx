import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ReactNode, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Só redireciona uma vez, e apenas quando o carregamento terminar e não autenticado
    if (!loading && !isAuthenticated && !redirectAttempted.current) {
      redirectAttempted.current = true;
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Se estiver carregando, mostra spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03060D]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  // Se não autenticado, não renderiza nada (o useEffect fará o redirecionamento)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}