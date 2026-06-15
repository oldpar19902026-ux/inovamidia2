import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { VideoPlayerEnhanced } from "@/components/VideoPlayerEnhanced";
import { InstitutionalOverlay } from "@/components/InstitutionalOverlay";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Newspaper,
  Cloud,
  CloudRain,
  Sun,
  Snowflake,
  CloudLightning,
  Droplets,
  Wind,
  Clock,
  MapPin,
} from "lucide-react";

import type { Video } from "@shared/types";

// ───────────────────────────── Tipos auxiliares ─────────────────
interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function Display() {
  const { data: allVideos = [], isLoading } =
    trpc.localVideos.listAll.useQuery(undefined, {
      refetchInterval: 60000,
    });

  const videos: Video[] = allVideos
    .filter((v: any) => v.isActive === 1)
    .map((v: any) => ({
      ...v,
      url: `/local-media/${v.filename}`,
    }));

  const [currentVideo, setCurrentVideo] = useState<Video | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // ───── Notícias e clima ─────
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  const handleVideoChange = (index: number, video: Video) => {
    setCurrentIndex(index);
    setCurrentVideo(video);
  };

  // ───────────────────────────── Notícias ─────────────────────────────
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;

        if (!apiKey) return;

        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?country=br&pageSize=10&apiKey=${apiKey}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setNews(
          data.articles.map((a: any) => ({
            title: a.title,
            description: a.description || "",
            url: a.url,
            source: a.source?.name || "Desconhecido",
          }))
        );
      } catch (err) {
        console.error("[News] Erro:", err);
      }
    };

    fetchNews();

    const interval = setInterval(fetchNews, 300000);

    return () => clearInterval(interval);
  }, []);

  // ───────────────────────────── Rotação notícias ─────────────────────────────
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % news.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [news.length]);

  // ───────────────────────────── Clima ─────────────────────────────
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        if (!apiKey) return;

        const lat = -20.3155;
        const lon = -40.3128;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          city: data.name,
        });
      } catch (err) {
        console.error("[Weather] Erro:", err);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, []);

  // ───────────────────────────── Ícone clima ─────────────────────────────
  const WeatherIcon = ({ icon }: { icon: string }) => {
    const map: Record<string, React.ElementType> = {
      "01d": Sun,
      "01n": Sun,

      "02d": Cloud,
      "02n": Cloud,

      "03d": Cloud,
      "04d": Cloud,

      "09d": CloudRain,
      "10d": CloudRain,

      "11d": CloudLightning,

      "13d": Snowflake,

      "50d": Wind,
    };

    const Comp = map[icon] || Cloud;

    return <Comp className="w-5 h-5 text-violet-300" />;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Fundo */}
      <div className="absolute inset-0 bg-[#03060D] z-0" />

      {/* Vídeo */}
      <VideoPlayerEnhanced
        videos={videos}
        isLoading={isLoading}
        onVideoChange={handleVideoChange}
      />

      {/* Overlay institucional */}
      <InstitutionalOverlay
        currentVideo={currentVideo}
        videoIndex={currentIndex}
        totalVideos={videos.length}
      />

      {/* Conteúdo */}
      <AnimatePresence>
        {currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* ════════════════════════════════════════════════ */}
            {/* LOGO FIXA */}
            {/* ════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed top-4 left-4 md:top-6 md:left-6 z-50"
            >
              <div className="flex items-center gap-4">
                <motion.img
                  src="/logo4.png"
                  alt="Logo Inova Mídia"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                  style={{
                    filter:
                      "drop-shadow(0 0 15px rgba(124,58,237,0.8)) drop-shadow(0 0 35px rgba(124,58,237,0.45))",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                />

                <div className="hidden md:flex flex-col">
                  <span className="text-white text-lg font-bold tracking-tight">
                    Inova Mídia
                  </span>

                  <span className="text-xs text-gray-400 tracking-[0.15em] uppercase">
                    Comunicação Institucional
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ════════════════════════════════════════════════ */}
            {/* RELÓGIO FIXO */}
            {/* ════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-50"
            >
              <div className="bg-black/35 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/[0.06] shadow-2xl shadow-black/50">
                <ClockWidget />
              </div>
            </motion.div>

            {/* ════════════════════════════════════════════════ */}
            {/* CLIMA FIXO */}
            {/* ════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50"
            >
              <div className="flex items-center gap-3 bg-black/35 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/[0.06] shadow-2xl shadow-black/50">
                {weather ? (
                  <>
                    <div className="flex items-center gap-2">
                      <WeatherIcon icon={weather.icon} />

                      <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                        {weather.temp}°
                      </span>
                    </div>

                    <div className="flex flex-col text-xs text-gray-300">
                      <span className="capitalize font-medium">
                        {weather.description}
                      </span>

                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-violet-400" />
                          {weather.humidity}%
                        </span>

                        <span className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-violet-400" />
                          {weather.windSpeed} m/s
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
                      <MapPin className="w-3 h-3 text-violet-400" />
                      {weather.city}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Carregando clima...</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ════════════════════════════════════════════════ */}
            {/* NOTÍCIAS */}
            {/* ════════════════════════════════════════════════ */}
            {news.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90vw] md:w-[70vw] lg:w-[60vw]"
              >
                <div className="bg-black/30 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/[0.05] shadow-lg shadow-black/40 overflow-hidden">
                  <div className="flex items-center gap-2 text-sm">
                    <Newspaper className="w-4 h-4 text-violet-400 flex-shrink-0" />

                    <AnimatePresence mode="wait">
                      <motion.p
                        key={newsIndex}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-200 truncate"
                      >
                        <span className="font-semibold text-violet-300 mr-2">
                          {news[newsIndex]?.source}
                        </span>

                        {news[newsIndex]?.title}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Global */}
      <style>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RELÓGIO
// ─────────────────────────────────────────────────────────────────
function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 text-white">
      <Clock className="w-5 h-5 text-violet-400" />

      <span className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold tracking-wider drop-shadow-[0_0_12px_rgba(124,58,237,0.5)]">
        {time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </div>
  );
}