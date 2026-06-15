import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  Edit2,
  LogOut,
  Film,
  ArrowLeft,
  Loader2,
  GripVertical,
  Upload,
  FileVideo,
  CheckCircle,
  X,
  Sparkles,
  Layers,
  ChevronDown,
  Copy,
  Monitor,
  Clock,
  Shield,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
  type PanInfo,
} from "framer-motion";

// ──────────────────────────── Constantes de animação ──────────────
const easeEnter: Transition = {
  duration: 0.55,
  ease: [0.23, 1, 0.32, 1] as const,
};
const easeOut: Transition = {
  duration: 0.45,
  ease: [0.23, 1, 0.32, 1] as const,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: easeEnter },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, ...easeOut },
  }),
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

// ──────────────────────────── Componentes decorativos ─────────────
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

function ShimmerBorder() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  );
}

function StatBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
      <Icon className="w-4 h-4 text-violet-400" />
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-white ml-auto">{value}</span>
    </div>
  );
}

// ──────────────────────────── Tipos ───────────────────────────────
type VideoItem = {
  id: number;
  title: string;
  description: string | null;
  duration: number | null;
  filename: string;
  isActive: number;
  order: number;
};

// ──────────────────────────── Componente Principal ─────────────────
export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Estado para controle do logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ---------- Dados ----------
  const {
    data: originalVideos = [],
    refetch,
    isLoading,
  } = trpc.localVideos.listAll.useQuery();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  useEffect(() => {
    if (originalVideos.length > 0) setVideos(originalVideos);
  }, [originalVideos]);

  // ---------- Mutations ----------
  const saveMutation = trpc.localVideos.saveInfo.useMutation({
    onSuccess: () => {
      toast.success("Vídeo adicionado com sucesso!");
      refetch();
    },
    onError: (error) =>
      toast.error("Erro ao adicionar vídeo: " + error.message),
  });

  const updateMutation = trpc.localVideos.update.useMutation({
    onSuccess: () => {
      toast.success("Vídeo atualizado!");
      refetch();
    },
    onError: (error) =>
      toast.error("Erro ao atualizar: " + error.message),
  });

  const deleteMutation = trpc.localVideos.delete.useMutation({
    onSuccess: () => {
      toast.success("Vídeo deletado!");
      refetch();
    },
    onError: (error) =>
      toast.error("Erro ao deletar: " + error.message),
  });

  const reorderMutation = trpc.localVideos.reorder.useMutation({
    onSuccess: () => {
      toast.success("Ordem atualizada!");
      refetch();
    },
    onError: (error) =>
      toast.error("Erro ao reordenar: " + error.message),
  });

  // ---------- Estado do modal de edição ----------
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });

  // ---------- Estado do upload ----------
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);

  // ---------- Estado do drag (Framer Motion) ----------
  const [dragId, setDragId] = useState<number | null>(null);
  const rowsRef = useRef<Map<number, HTMLTableRowElement>>(new Map());

  // ---------- Handlers ----------
  const resetEditForm = () => {
    setEditFormData({ title: "", description: "", duration: "" });
    setEditingId(null);
    setIsEditDialogOpen(false);
  };

  const handleUpdateVideo = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        title: editFormData.title || undefined,
        description: editFormData.description || undefined,
        duration: editFormData.duration
          ? parseInt(editFormData.duration)
          : undefined,
      });
      resetEditForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (
      confirm(
        "Tem certeza que deseja deletar este vídeo? O arquivo será removido do servidor."
      )
    ) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleActive = async (id: number, currentActive: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        isActive: currentActive === 1 ? 0 : 1,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openEditDialog = (video: VideoItem) => {
    setEditingId(video.id);
    setEditFormData({
      title: video.title,
      description: video.description || "",
      duration: video.duration?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  // ---------- Handlers de upload ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("video/")) {
      setUploadFile(selected);
      if (!uploadTitle)
        setUploadTitle(selected.name.replace(/\.[^/.]+$/, ""));
    } else {
      toast.error("Selecione um arquivo de vídeo válido");
    }
  };

  const handleUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("video/")) {
      setUploadFile(dropped);
      if (!uploadTitle)
        setUploadTitle(dropped.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const resetUploadForm = () => {
    setUploadTitle("");
    setUploadDescription("");
    setUploadFile(null);
    setUploadProgress(0);
    const input = document.getElementById("local-video-input") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      toast.error("Título e arquivo de vídeo são obrigatórios");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("video", uploadFile);

      const xhr = new XMLHttpRequest();
      const uploadPromise = new Promise<{
        filename: string;
        originalName: string;
        size: number;
        mimeType: string;
        url: string;
      }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable)
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
          else reject(new Error("Falha no upload"));
        });
        xhr.addEventListener("error", () => reject(new Error("Erro de rede")));
      });

      xhr.open("POST", "/api/local-upload");
      xhr.send(formData);

      const result = await uploadPromise;

      await saveMutation.mutateAsync({
        title: uploadTitle.trim(),
        description: uploadDescription.trim() || undefined,
        filename: result.filename,
        originalName: result.originalName,
        mimeType: result.mimeType,
        size: result.size,
        order: videos.length,
      });

      toast.success("Vídeo adicionado com sucesso!");
      resetUploadForm();
      setIsUploadExpanded(false);
    } catch (err: any) {
      toast.error("Erro no upload: " + (err.message || "Tente novamente"));
    } finally {
      setUploading(false);
    }
  };

  // ---------- Drag and Drop com Framer Motion ----------
  const handleDragStart = useCallback((id: number) => {
    setDragId(id);
  }, []);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (dragId === null) return;

      const pointerY = "pageY" in event ? event.pageY : (event as TouchEvent).touches[0].pageY;

      let targetIndex = -1;
      const rowEntries = Array.from(rowsRef.current.entries());
      for (let i = 0; i < rowEntries.length; i++) {
        const [, row] = rowEntries[i];
        const rect = row.getBoundingClientRect();
        if (pointerY >= rect.top && pointerY <= rect.bottom) {
          targetIndex = i;
          break;
        }
      }

      if (targetIndex === -1) {
        setDragId(null);
        return;
      }

      const currentIndex = videos.findIndex((v) => v.id === dragId);
      if (currentIndex === -1 || currentIndex === targetIndex) {
        setDragId(null);
        return;
      }

      const updated = [...videos];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      setVideos(updated);

      reorderMutation.mutate(
        { videoIds: updated.map((v) => v.id) },
        {
          onError: () => setVideos(videos),
          onSettled: () => setDragId(null),
        }
      );
    },
    [dragId, videos, reorderMutation]
  );

  const videosToDisplay = videos.length > 0 ? videos : originalVideos;

  // ----- Botão de copiar link do Espelho -----
  const copyMirrorLink = () => {
    const link = `${window.location.origin}/espelho`;
    navigator.clipboard.writeText(link).catch(() => {
      const input = document.createElement("input");
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    });
    toast.success("Link do espelho copiado!");
  };

  // ====================== RENDER ======================
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-5 md:p-8">
        {/* ========== HEADER ========== */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={easeEnter}
          className="sticky top-0 z-50 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-5 bg-[#03060D]/80 backdrop-blur-3xl border border-white/[0.04] rounded-2xl shadow-2xl shadow-black/50">
            {/* Lado esquerdo: voltar + logo + títulos */}
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLocation("/")}
                className="w-10 h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/30 transition-all duration-200"
                aria-label="Voltar para início"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              {/* Logo institucional */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="hidden sm:block"
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

              {/* Títulos ao lado da logo */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Inova Mídia
                </h1>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-[0.15em] uppercase mt-0.5">
                  Painel Administrativo
                </p>
              </div>
            </div>

            {/* Lado direito: status + ações */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/15 rounded-full backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                </span>
                <span className="text-sm text-emerald-300 font-medium">
                  {user?.name ?? "Administrador"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyMirrorLink}
                className="border-white/[0.08] bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/30 transition-all duration-200 h-9 rounded-lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                Espelho
              </Button>

              {/* Botão Sair */}
              <Button
                variant="outline"
                size="sm"
                disabled={isLoggingOut}
                onClick={async () => {
                  setIsLoggingOut(true);
                  try {
                    await logout();
                    setLocation("/login");
                  } catch (err) {
                    toast.error("Erro ao sair. Verifique sua conexão.");
                    setIsLoggingOut(false);
                  }
                }}
                className="border-white/[0.08] bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-red-500/30 transition-all duration-200 h-9 rounded-lg"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                {isLoggingOut ? "Saindo..." : "Sair"}
              </Button>
            </div>
          </div>
        </motion.header>

        {/* ========== CONTEÚDO PRINCIPAL ========== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* ========== STATS RÁPIDAS ========== */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <StatBadge icon={Film} label="Total de vídeos" value={videosToDisplay.length.toString()} />
            <StatBadge icon={Monitor} label="Resolução" value="Full HD" />
            <StatBadge icon={Clock} label="Exibição" value="24/7" />
            <StatBadge icon={Shield} label="Painel" value="Restrito" />
          </motion.div>

          {/* ========== UPLOAD SECTION ========== */}
          <motion.div variants={itemVariants}>
            <Card className="group relative bg-[#060B16] border-white/[0.05] hover:border-violet-500/30 transition-all duration-500 shadow-2xl shadow-black/60 overflow-hidden rounded-2xl">
              <ShimmerBorder />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-purple-600/0 group-hover:from-violet-500/[0.02] group-hover:to-purple-600/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />

              <button
                onClick={() => setIsUploadExpanded(!isUploadExpanded)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center group-hover:bg-violet-500/15 group-hover:border-violet-500/30 transition-all duration-300">
                    <FileVideo className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Adicionar Vídeo à Fila
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Arraste um arquivo ou clique para selecionar
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isUploadExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isUploadExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4 border-t border-white/[0.04] pt-5">
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleUploadDrop}
                        onClick={() =>
                          !uploadFile &&
                          document.getElementById("local-video-input")?.click()
                        }
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                          uploadFile
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-white/[0.08] hover:border-violet-500/30 hover:bg-white/[0.02]"
                        }`}
                      >
                        <input
                          id="local-video-input"
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <AnimatePresence mode="wait">
                          {uploadFile ? (
                            <motion.div
                              key="selected"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center gap-2"
                            >
                              <CheckCircle className="w-8 h-8 text-emerald-400" />
                              <span className="text-emerald-300 font-medium">
                                {uploadFile.name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {(uploadFile.size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadFile(null);
                                  const input = document.getElementById(
                                    "local-video-input"
                                  ) as HTMLInputElement;
                                  if (input) input.value = "";
                                }}
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3 inline mr-1" />
                                Remover
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center gap-2"
                            >
                              <Upload className="w-8 h-8 text-gray-500" />
                              <span className="text-gray-400">
                                Arraste um vídeo ou clique para selecionar
                              </span>
                              <span className="text-gray-600 text-xs">
                                MP4, WebM, OGG, MOV (até 2GB)
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Título do vídeo *"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          className="bg-[#03060D] border-white/[0.08] text-white placeholder:text-gray-500 h-11 rounded-xl focus:border-violet-500/50 transition-colors"
                        />
                      </div>
                      <Textarea
                        placeholder="Descrição (opcional)"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        className="bg-[#03060D] border-white/[0.08] text-white placeholder:text-gray-500 rounded-xl focus:border-violet-500/50 transition-colors min-h-[60px]"
                      />

                      {uploading && (
                        <div>
                          <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {uploadProgress}%
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          onClick={handleUpload}
                          disabled={!uploadFile || !uploadTitle.trim() || uploading}
                          className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold shadow-lg shadow-violet-600/20 flex-1"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Fazer Upload
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            resetUploadForm();
                            setIsUploadExpanded(false);
                          }}
                          className="h-11 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.05]"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* ========== TABELA DE VÍDEOS ========== */}
          <motion.div variants={itemVariants}>
            <Card className="group relative bg-[#060B16] border-white/[0.05] shadow-2xl shadow-black/60 overflow-hidden rounded-2xl">
              <ShimmerBorder />
              <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                  Fila de Vídeos
                </span>
                <span className="ml-auto text-xs text-gray-500 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.04]">
                  {videosToDisplay.length} vídeo{videosToDisplay.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.04] hover:bg-transparent">
                      <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider w-12">
                        #
                      </TableHead>
                      <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                        Título
                      </TableHead>
                      <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                        Descrição
                      </TableHead>
                      <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider w-20">
                        Ativo
                      </TableHead>
                      <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider w-44 text-right">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow className="border-white/[0.04]">
                        <TableCell colSpan={5} className="text-center py-16">
                          <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-3" />
                          <span className="text-sm text-gray-500">
                            Carregando vídeos...
                          </span>
                        </TableCell>
                      </TableRow>
                    ) : videosToDisplay.length === 0 ? (
                      <TableRow className="border-white/[0.04]">
                        <TableCell colSpan={5} className="text-center py-16">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Layers className="w-7 h-7 text-gray-600" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium">
                              Nenhum vídeo na fila
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              Adicione o primeiro vídeo usando a seção acima
                            </p>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence>
                        {videosToDisplay.map((video, index) => (
                          <motion.tr
                            key={video.id}
                            layout
                            ref={(ref) => {
                              if (ref) rowsRef.current.set(video.id, ref);
                              else rowsRef.current.delete(video.id);
                            }}
                            custom={index}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            drag="y"
                            dragSnapToOrigin
                            dragElastic={0.2}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragListener={false}
                            onDragStart={() => handleDragStart(video.id)}
                            onDragEnd={handleDragEnd}
                            className={`border-white/[0.04] hover:bg-white/[0.02] transition-colors group ${
                              dragId === video.id
                                ? "opacity-80 bg-white/[0.04] shadow-xl shadow-violet-500/10 z-10"
                                : ""
                            } cursor-default`}
                            style={{ position: "relative" }}
                          >
                            <TableCell className="text-gray-500 font-mono text-sm">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.04] group-hover:border-violet-500/20 transition-colors">
                                  {index + 1}
                                </span>
                                <div
                                  onPointerDown={(e) => {
                                    const row = rowsRef.current.get(video.id);
                                    if (row) {
                                      const event = new PointerEvent(
                                        "pointerdown",
                                        e.nativeEvent
                                      );
                                      row.dispatchEvent(event);
                                    }
                                  }}
                                  className="cursor-grab active:cursor-grabbing p-1 -ml-1"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-violet-400 transition-all" />
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <span className="text-white font-medium truncate max-w-[200px]">
                                {video.title}
                              </span>
                            </TableCell>

                            <TableCell className="hidden md:table-cell">
                              <span className="text-gray-500 text-sm truncate max-w-[200px] inline-block">
                                {video.description || "—"}
                              </span>
                            </TableCell>

                            <TableCell>
                              <Switch
                                checked={video.isActive === 1}
                                onCheckedChange={() =>
                                  handleToggleActive(video.id, video.isActive)
                                }
                                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/[0.08]"
                              />
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Dialog
                                  open={isEditDialogOpen && editingId === video.id}
                                  onOpenChange={(open) => {
                                    setIsEditDialogOpen(open);
                                    if (!open) resetEditForm();
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <button
                                      onClick={() => openEditDialog(video)}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                      title="Editar vídeo"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-[#0A0F1A] border-white/[0.08] shadow-2xl shadow-black/60 max-w-md">
                                    <DialogHeader>
                                      <DialogTitle className="text-white flex items-center gap-2">
                                        <Edit2 className="w-4 h-4 text-violet-400" />
                                        Editar Vídeo
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 mt-2">
                                      <Input
                                        placeholder="Título"
                                        value={editFormData.title}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            title: e.target.value,
                                          })
                                        }
                                        className="bg-[#05070D] border-white/[0.08] text-white h-11 rounded-xl"
                                      />
                                      <Textarea
                                        placeholder="Descrição"
                                        value={editFormData.description}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            description: e.target.value,
                                          })
                                        }
                                        className="bg-[#05070D] border-white/[0.08] text-white rounded-xl min-h-[80px]"
                                      />
                                      <Input
                                        placeholder="Duração (segundos)"
                                        type="number"
                                        value={editFormData.duration}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            duration: e.target.value,
                                          })
                                        }
                                        className="bg-[#05070D] border-white/[0.08] text-white h-11 rounded-xl"
                                      />
                                      <Button
                                        onClick={() => handleUpdateVideo(video.id)}
                                        disabled={updateMutation.isPending}
                                        className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold"
                                      >
                                        {updateMutation.isPending ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Salvando...
                                          </>
                                        ) : (
                                          "Salvar Alterações"
                                        )}
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <button
                                  onClick={() => handleDeleteVideo(video.id)}
                                  disabled={deleteMutation.isPending}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                  title="Deletar vídeo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>

          {/* ========== FOOTER ========== */}
          <motion.footer variants={itemVariants} className="text-center pb-4">
            <div className="border-t border-white/[0.04] pt-6">
              <p className="text-xs text-gray-600 tracking-wide">
                Inova Mídia &copy; {new Date().getFullYear()} &middot; Painel
                Administrativo &middot; v2.0
              </p>
              <p className="text-[10px] text-gray-700 mt-1.5 tracking-wider uppercase">
                Tecnologia proprietária · Todos os direitos reservados
              </p>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}