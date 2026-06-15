import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@shared/types";

interface VideoPlayerProps {
  videos: Video[];
  isLoading?: boolean;
}

export function VideoPlayer({ videos, isLoading = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo) return;

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener("ended", handleEnded);
    video.play().catch((err) => console.error("Autoplay failed:", err));

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, videos.length, currentVideo]);

  if (isLoading || !currentVideo) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            src={currentVideo.url}
            preload="auto"
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
          />
        </motion.div>
      </AnimatePresence>

      {/* Indicador de progresso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: currentVideo.duration || 30, ease: "linear" }}
        />
      </div>

      {/* Indicador de vídeos */}
      <div className="absolute top-4 right-4 text-white text-sm font-medium">
        <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {videos.length}
        </span>
      </div>
    </div>
  );
}
