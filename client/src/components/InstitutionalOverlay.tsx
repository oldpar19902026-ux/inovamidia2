import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

interface InstitutionalOverlayProps {
  currentVideo?: any;
  videoIndex?: number;
  totalVideos?: number;
}

export function InstitutionalOverlay({
  currentVideo,
  videoIndex = 0,
  totalVideos = 0,
}: InstitutionalOverlayProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Topo esquerdo – Logo4 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 left-6"
      >
        <img
          src="/logo4.png"
          alt="Logo principal"
          className="h-20 md:h-22 w-auto object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Topo direito – Relógio */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 right-6"
      >
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.06]">
          <Clock className="w-5 h-5 text-violet-400" />
          <span className="text-2xl font-mono font-bold text-white">
            {time || "00:00:00"}
          </span>
        </div>
      </motion.div>

      {/* Canto inferior direito – Relógio e Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-6 right-6 text-right"
      >
        <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/[0.08] shadow-xl">
          <img
            src=""
            alt="Logo secundário"
            className="h-10 md:h-12 w-auto object-contain opacity-90 drop-shadow-lg mb-2 ml-auto"
          />
          <p className="text-sm text-gray-300 capitalize">{date || "Carregando..."}</p>
        </div>
      </motion.div>

      {/* Topo direito – Localização */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-20 right-6"
      >
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.06]">
          <MapPin className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-white font-medium">Vitória - ES</span>
        </div>
      </motion.div>
    </div>
  );
}