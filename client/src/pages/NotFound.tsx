import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Compass, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

/* ---------- Componentes decorativos ---------- */
function GlowOrb({
  color,
  position,
  size,
  opacity = 0.12,
}: {
  color: string;
  position: string;
  size: string;
  opacity?: number;
}) {
  return (
    <motion.div
      className={`absolute ${position} ${size} rounded-full blur-[120px] pointer-events-none`}
      style={{ background: color, opacity }}
      animate={{
        scale: [1, 1.08, 1],
        opacity: [opacity, opacity * 1.3, opacity],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function GridPattern() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)",
      }}
    />
  );
}

function ShimmerBorder() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  );
}

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#03060D] overflow-x-hidden selection:bg-violet-500/25 selection:text-white">
      {/* Fundo decorativo clipado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridPattern />
        <GlowOrb
          color="#7c3aed"
          position="top-[-10%] left-[-5%]"
          size="w-[700px] h-[700px]"
          opacity={0.1}
        />
        <GlowOrb
          color="#059669"
          position="bottom-[-8%] right-[-4%]"
          size="w-[550px] h-[550px]"
          opacity={0.09}
        />
        <GlowOrb
          color="#3b82f6"
          position="top-[60%] left-[45%]"
          size="w-[400px] h-[400px]"
          opacity={0.06}
        />
      </div>

      {/* Botão de voltar (canto superior esquerdo) */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={() => setLocation("/")}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/30 transition-all duration-200"
        aria-label="Voltar para início"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Card central */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="group relative overflow-hidden bg-[#060B16] border border-white/[0.05] hover:border-violet-500/30 transition-all duration-500 shadow-2xl shadow-black/60 rounded-2xl">
          <ShimmerBorder />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-purple-600/0 group-hover:from-violet-500/[0.02] group-hover:to-purple-600/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />

          <div className="relative p-8 md:p-10 text-center">
            {/* Logo com glow duplo */}
            <div className="flex justify-center mb-6">
              <motion.img
              src="/logo4.png"
              alt="Logo Inova Mídia"
              className="h-24 md:h-28 w-auto object-contain"
              style={{
              filter: "drop-shadow(0 0 15px rgba(124,58,237,0.8)) drop-shadow(0 0 35px rgba(124,58,237,0.45))",
             }}
             initial={{ scale: 0.9 }}
             animate={{ scale: 1 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             />
            </div>

            {/* Número 404 com gradiente */}
            <motion.h1
              className="text-8xl md:text-9xl font-extrabold tracking-tight mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                404
              </span>
            </motion.h1>

            {/* Ícone de bússola */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center">
                <Compass className="w-7 h-7 text-violet-400" />
              </div>
            </div>

            {/* Título e mensagem */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Página não encontrada
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base max-w-sm mx-auto">
              A página que você está procurando não existe, foi movida ou
              removida. Verifique o endereço ou retorne ao início.
            </p>

            {/* Botão de retorno */}
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold shadow-lg shadow-violet-600/20 hover:shadow-violet-500/35 transition-all duration-300 h-12 px-8 rounded-xl group"
            >
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Voltar ao Início
            </Button>

            {/* Texto de rodapé dentro do card */}
            <p className="text-xs text-gray-600 mt-8">
              Inova Mídia &middot; Plataforma de Comunicação Institucional
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer discreto */}
      <p className="absolute bottom-6 text-xs text-gray-700 z-10">
        &copy; {new Date().getFullYear()} Inova Mídia &middot; Todos os
        direitos reservados
      </p>
    </div>
  );
}