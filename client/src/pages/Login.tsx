import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Shield, LogIn, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

function GlowOrb({ color, position, size, opacity = 0.12 }: { color: string; position: string; size: string; opacity?: number }) {
  return (
    <motion.div
      className={`absolute ${position} ${size} rounded-full blur-[120px] pointer-events-none`}
      style={{ background: color, opacity }}
      animate={{ scale: [1, 1.08, 1], opacity: [opacity, opacity * 1.3, opacity] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
function GridPattern() {
  return (
    <div className="absolute inset-0" style={{
      backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
      maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)",
      WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)",
    }} />
  );
}
function ShimmerBorder() {
  return <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "cookie_set" | "cookie_missing" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const loginMutation = trpc.auth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setServerMessage("");

    try {
      const result = await loginMutation.mutateAsync({ email, password });

      if (result.success && result.token) {
        // Armazena o token no localStorage
        localStorage.setItem("auth_token", result.token);
        setStatus("cookie_set");
        // Redireciona após breve pausa
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setStatus("error");
        setServerMessage("Resposta inesperada do servidor.");
      }
    } catch (err: any) {
      setStatus("error");
      setServerMessage(err?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#03060D] flex items-center justify-center overflow-x-hidden selection:bg-violet-500/25 selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridPattern />
        <GlowOrb color="#7c3aed" position="top-[-10%] left-[-5%]" size="w-[700px] h-[700px]" opacity={0.1} />
        <GlowOrb color="#059669" position="bottom-[-8%] right-[-4%]" size="w-[550px] h-[550px]" opacity={0.09} />
        <GlowOrb color="#3b82f6" position="top-[60%] left-[45%]" size="w-[400px] h-[400px]" opacity={0.06} />
      </div>

      <motion.button
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={() => window.location.href = "/"}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/30 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="group relative overflow-hidden bg-[#060B16] border border-white/[0.05] hover:border-violet-500/30 transition-all duration-500 shadow-2xl shadow-black/60 rounded-2xl">
          <ShimmerBorder />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-purple-600/0 group-hover:from-violet-500/[0.02] group-hover:to-purple-600/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />
          <div className="relative p-8">
            <div className="flex justify-center mb-6">
              <motion.img
                src="/logo4.png" alt="Logo Inova Mídia"
                className="h-28 md:h-32 w-auto object-contain"
                style={{ filter: "drop-shadow(0 0 15px rgba(124,58,237,0.8)) drop-shadow(0 0 45px rgba(124,58,237,0.45))" }}
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">Inova Mídia</h1>
              <p className="text-xs text-gray-500 tracking-[0.15em] uppercase mt-1">Acesso ao Painel Administrativo</p>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
            </div>

            {status === "cookie_set" && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-300 text-sm">Login bem‑sucedido! Redirecionando...</p>
              </motion.div>
            )}
            {(status === "cookie_missing" || status === "error") && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <p className="text-red-400 text-sm font-medium">{serverMessage}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gmail.com" required autoComplete="email"
                  disabled={status === "loading" || status === "cookie_set"}
                  className="bg-[#03060D] border-white/[0.08] text-white placeholder:text-gray-500 h-11 rounded-xl focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">Senha</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password"
                  disabled={status === "loading" || status === "cookie_set"}
                  className="bg-[#03060D] border-white/[0.08] text-white placeholder:text-gray-500 h-11 rounded-xl focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all" />
              </div>
              <Button type="submit" disabled={status === "loading" || status === "cookie_set"}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold shadow-lg shadow-violet-600/20 hover:shadow-violet-500/35 transition-all duration-300 group">
                {status === "loading" ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Autenticando...</>) :
                 status === "cookie_set" ? (<><CheckCircle className="w-4 h-4 mr-2" />Redirecionando...</>) :
                 (<><LogIn className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />Entrar</>)}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-600 mt-6">Plataforma de Comunicação Institucional &middot; v2.0</p>
          </div>
        </div>
      </motion.div>
      <p className="absolute bottom-6 text-xs text-gray-700 z-10">&copy; {new Date().getFullYear()} Inova Mídia &middot; Todos os direitos reservados</p>
    </div>
  );
}