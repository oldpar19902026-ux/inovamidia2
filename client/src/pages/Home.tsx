import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Monitor,
  Settings,
  Shield,
  Clock,
  Play,
  ChevronRight,
  Tv,
  Radio,
  Layers,
  Upload,
  Lock,
  Copy,
  Check,
  Zap,
  BarChart3,
  Users,
  Globe,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";

/* ---------- Constantes de animação ---------- */
const easeEnter = [0.23, 1, 0.32, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeEnter },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeEnter },
  },
};

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
      className={`absolute ${position} ${size} rounded-full blur-[120px]`}
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

function StatItem({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/15 to-emerald-500/10 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-violet-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

/* ---------- Componente principal ---------- */
export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  /* Copy link com feedback */
  const copyMirrorLink = () => {
    const link = `${window.location.origin}/espelho`;
    navigator.clipboard.writeText(link).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      },
      () => {
        const input = document.createElement("input");
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    );
  };

  const goToDisplay = () => setLocation("/display");
  const goToAdmin = () => setLocation("/admin");

  return (
    <div className="relative min-h-screen bg-[#03060D] overflow-x-hidden selection:bg-violet-500/25 selection:text-white">
      {/* Camada de fundo decorativa – CLIPADA para evitar scroll duplo */}
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
          position="top-[45%] left-[40%]"
          size="w-[450px] h-[450px]"
          opacity={0.06}
        />
      </div>

      {/* Conteúdo real */}
      <div className="relative z-10">
        {/* ========== HEADER ========== */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeEnter }}
          className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#03060D]/80 backdrop-blur-3xl supports-[backdrop-filter]:bg-[#03060D]/65"
        >
          <div className="max-w-7xl mx-auto px-5 py-4 md:py-5">
            <div className="flex items-center justify-between gap-4">
              {/* Logo + tagline */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/logo4.png"
                    alt="Logo da Plataforma"
                    className="h-28 w-auto object-contain"
                    style={{
                      filter: "drop-shadow(0 0 15px rgba(124,58,237,0.8)) drop-shadow(0 0 45px rgba(124,58,237,0.45))",
                    }}
                  />
                </motion.div>
                <div className="hidden sm:block">
                  <p className="text-xs md:text-sm text-gray-500 font-medium tracking-[0.15em] uppercase">
                    Comunicação &amp; Gestão de Conteúdo
                  </p>
                  <p className="text-[10px] text-gray-700 tracking-widest uppercase mt-0.5">
                    Plataforma Corporativa
                  </p>
                </div>
              </div>

              {/* Status do usuário (sempre presente quando autenticado) */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/8 border border-emerald-500/20 rounded-full backdrop-blur-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  </span>
                  <span className="text-sm text-emerald-300 font-medium tracking-wide">
                    {user.name}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        {/* ========== HERO SECTION ========== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-7xl mx-auto px-5 pt-14 pb-8 md:pt-20 md:pb-12"
        >
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge flutuante */}
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full mb-6 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-gray-400 tracking-wide">
                Sistema de Exibição Corporativa
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                v2.0
              </span>
            </motion.div>

            {/* Título */}
            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-4"
            >
              Comunicação
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                que gera impacto
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={fadeUpVariants}
              className="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-8"
            >
              Gerencie e exiba conteúdos institucionais em telas corporativas
              com <span className="text-white font-medium">overlay profissional</span>, 
              reprodução contínua e controle centralizado.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button
                onClick={goToDisplay}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 transition-all duration-300 h-12 px-7 rounded-xl group text-base"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Iniciar Exibição
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={goToAdmin}
                variant="outline"
                className="border-white/10 text-gray-300 hover:text-white hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-300 h-12 px-7 rounded-xl text-base font-medium"
              >
                <Settings className="w-4 h-4 mr-2" />
                Painel Administrativo
              </Button>
            </motion.div>
          </div>

          {/* Indicador de scroll */}
          <motion.div
            variants={fadeUpVariants}
            className="flex justify-center mt-12 md:mt-16"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border border-white/[0.08] flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ========== CONTEÚDO PRINCIPAL (sem os cards) ========== */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-5 py-4 md:py-8"
        >
          {/* ========== AÇÃO RÁPIDA: LINK ESPELHO ========== */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Button
              onClick={copyMirrorLink}
              className={`relative overflow-hidden font-medium px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 border text-sm ${
                copied
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.08] hover:border-white/15 text-gray-300 hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Link copiado com sucesso!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar link do Espelho (acesso público)
                </>
              )}
            </Button>
          </motion.div>

          {/* ========== ESTATÍSTICAS RÁPIDAS ========== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10 md:mt-12"
          >
            <StatItem value="24/7" label="Exibição Contínua" icon={Clock} />
            <StatItem value="Full HD" label="Resolução Máxima" icon={Monitor} />
            <StatItem value="Multi" label="Telas Simultâneas" icon={Layers} />
            <StatItem value="100%" label="Gestão Web" icon={Globe} />
          </motion.div>

          {/* ========== SEÇÃO: SOBRE O SISTEMA ========== */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-10 md:mt-14"
          >
            <div className="relative overflow-hidden bg-[#060B16] border border-white/[0.05] rounded-2xl p-7 md:p-9 shadow-2xl shadow-black/50">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-violet-400 to-emerald-400 rounded-full inline-block" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Sobre o Sistema
                  </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div
                    variants={itemVariants}
                    className="group/feat flex flex-col items-start"
                  >
                    <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 group-hover/feat:bg-violet-500/15 group-hover/feat:border-violet-500/30 transition-all duration-300">
                      <Monitor className="w-5 h-5 text-violet-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-base">
                      Exibição Profissional
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Vídeos em looping infinito com overlay institucional
                      exibindo relógio em tempo real, identidade visual
                      personalizada e transições suaves entre conteúdos.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="group/feat flex flex-col items-start"
                  >
                    <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 group-hover/feat:bg-emerald-500/15 group-hover/feat:border-emerald-500/30 transition-all duration-300">
                      <Settings className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-base">
                      Gestão Centralizada
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Painel administrativo com autenticação segura para upload,
                      edição, reordenação e ativação/desativação de vídeos na
                      playlist institucional.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="group/feat flex flex-col items-start"
                  >
                    <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 group-hover/feat:bg-blue-500/15 group-hover/feat:border-blue-500/30 transition-all duration-300">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-base">
                      Alta Performance
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Interface otimizada com transições fluidas, suporte a
                      múltiplos formatos de vídeo e carregamento rápido para
                      exibição ininterrupta.
                    </p>
                  </motion.div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-500">
                      Desenvolvido para ambientes corporativos de alto padrão
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Users className="w-3.5 h-3.5" />
                    <span>Suporte multi-usuário</span>
                    <span className="mx-1">·</span>
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Métricas em tempo real</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ========== FOOTER ========== */}
          <motion.footer
            variants={itemVariants}
            className="mt-10 md:mt-14 pb-8 text-center"
          >
            <div className="border-t border-white/[0.04] pt-6">
              <p className="text-xs text-gray-600 tracking-wide">
                &copy; {new Date().getFullYear()} &middot; Plataforma de
                Comunicação Institucional &middot; v2.0
              </p>
              <p className="text-[10px] text-gray-700 mt-1.5 tracking-wider uppercase">
                Tecnologia proprietária · Todos os direitos reservados
              </p>
            </div>
          </motion.footer>
        </motion.main>
      </div>
    </div>
  );
}