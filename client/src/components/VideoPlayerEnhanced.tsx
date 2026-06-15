import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { Video } from "@shared/types";

interface VideoPlayerEnhancedProps {
  videos: Video[];
  isLoading?: boolean;
  onVideoChange?: (index: number, video: Video) => void;
}

export function VideoPlayerEnhanced({
  videos,
  isLoading = false,
  onVideoChange,
}: VideoPlayerEnhancedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videos[currentIndex];

  useEffect(() => {
    if (currentVideo && onVideoChange) onVideoChange(currentIndex, currentVideo);
  }, [currentIndex, currentVideo, onVideoChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo) return;

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener("ended", handleEnded);
    const playPromise = video.play();
    if (playPromise) playPromise.catch((err) => console.error("Autoplay falhou:", err));

    return () => video.removeEventListener("ended", handleEnded);
  }, [currentIndex, videos.length, currentVideo]);

  if (isLoading || !currentVideo) {
    return (
      <div className="w-full h-full bg-[#05070D] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
        </div>
        <p className="text-violet-200/80 text-sm font-medium">Carregando conteúdo...</p>
      </div>
    );
  }

  const safeDuration = currentVideo.duration && currentVideo.duration > 0 ? currentVideo.duration : 30;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0, ease: [0.23, 1, 0.32, 1] }}
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

      {/* Barra de progresso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          className="h-full bg-linear-to-r from-violet-500 to-purple-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: safeDuration, ease: "linear" }}
          key={currentVideo.id}
        />
      </div>
    </div>
  );
}