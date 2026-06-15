import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Tv,
  Clock,
  Cloud,
  CloudRain,
  Sun,
  Snowflake,
  CloudLightning,
  Newspaper,
  Droplets,
  Wind,
  MapPin,
} from "lucide-react";

// ───────────────────────────── Tipos ─────────────────────────────
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

type VideoItem = {
  id: number;
  title: string;
  description: string | null;
  duration: number | null;
  filename: string;
  isActive: number;
};

// ──────────────────────────────────────────────────────────────────
// COMPONENTES DECORATIVOS
// ──────────────────────────────────────────────────────────────────
function GlowOrb({
  color,
  position,
  size,
  opacity = 0.08,
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
        scale: [1, 1.05, 1],
        opacity: [opacity, opacity * 1.2, opacity],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function GridPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────────
export default function DisplayEnhanced() {
  const { data: allVideos = [], isLoading } =
    trpc.localVideos.listAll.useQuery(undefined, {
      refetchInterval: 60000,
    });

  const videos = allVideos.filter((v: VideoItem) => v.isActive === 1);

  const [currentIndex, setCurrentIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // ───────────────── Notícias e Clima ─────────────────
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  // ───────────────── WebSocket ─────────────────
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let mounted = true;

    const connect = () => {
      if (!mounted) return;

      const protocol =
        window.location.protocol === "https:" ? "wss:" : "ws:";

      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        ws = new WebSocket(wsUrl);
      } catch (err) {
        console.warn("[Display] WebSocket não suportado.");
        return;
      }

      ws.onopen = () =>
        console.log("[Display] Conectado ao servidor");

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          const video = videoRef.current;

          if (!video) return;

          switch (msg.type) {
            case "load":
              const idx = videos.findIndex(
                (v: VideoItem) =>
                  `/local-media/${v.filename}` === msg.videoUrl
              );

              if (idx !== -1) {
                setCurrentIndex(idx);
              }

              break;

            case "play":
              video.currentTime = msg.currentTime || 0;
              video.play().catch(() => {});
              break;

            case "pause":
              video.currentTime = msg.currentTime || 0;
              video.pause();
              break;

            case "seek":
              video.currentTime = msg.currentTime || 0;
              break;
          }
        } catch (err) {
          console.error("[Display] Erro WS:", err);
        }
      };

      ws.onclose = () => {
        if (mounted) {
          reconnectTimeout = setTimeout(connect, 5000);
        }
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      mounted = false;
      ws?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [videos]);

  // ───────────────── Notícias ─────────────────
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

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % news.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [news.length]);

  // ───────────────── Clima ─────────────────
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey =
          import.meta.env.VITE_OPENWEATHER_API_KEY;

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

  // ───────────────── Vídeo ─────────────────
  const currentVideo = videos[currentIndex];

  const getVideoUrl = (filename: string) => {
    if (!filename) return "";

    if (filename.includes(".")) {
      return `/local-media/${filename}`;
    }

    return `/local-media/${filename}.mp4`;
  };

  const videoUrl = currentVideo
    ? getVideoUrl(currentVideo.filename)
    : "";

  const nextVideo = useCallback(() => {
    if (videos.length === 0) return;

    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (videos.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= videos.length) {
      setCurrentIndex(0);
    }
  }, [videos.length, currentIndex]);

  const handleVideoEnded = useCallback(() => {
    nextVideo();
  }, [nextVideo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onEnded = () => {
      nextVideo();
    };

    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("ended", onEnded);
    };
  }, [nextVideo]);

  // Ensure the video starts playing when the source changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoUrl) return;

    try {
      v.pause();
      v.src = videoUrl;
      v.load();
      v.currentTime = 0;
      const p = v.play();
      if (p) p.catch(() => {});
    } catch (err) {
      // ignore playback errors
    }
  }, [videoUrl]);

  // ───────────────── Ícone clima ─────────────────
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

    return (
      <Comp className="w-8 h-8 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
    );
  };

  // ───────────────── RENDER ─────────────────
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#03060D] font-sans antialiased">
      {/* Fundo */}
      <GridPattern />

      <GlowOrb
        color="#7c3aed"
        position="top-[-10%] left-[-5%]"
        size="w-[800px] h-[800px]"
        opacity={0.06}
      />

      <GlowOrb
        color="#059669"
        position="bottom-[-8%] right-[-4%]"
        size="w-[600px] h-[600px]"
        opacity={0.05}
      />

      {/* PLAYER */}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
        </div>
      ) : videos.length > 0 ? (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src={videoUrl}
            preload="auto"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />

            <p className="text-gray-400">
              Nenhum vídeo ativo
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* LOGO FIXA */}
      {/* ═══════════════════════════════════════════════ */}
      <motion.div
       initial={{ opacity: 0, x: -20 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.5 }}
       className="fixed top-4 left-4 md:top-6 md:left-6 z-9999"
       >
       <div className="flex items-center">
       <img
       src="/logo4.png"
       alt="Logo Inova Mídia"
       className="h-20 md:h-24 w-auto object-contain"
       style={{
        filter:
          "drop-shadow(0 0 15px rgba(124,58,237,0.8)) drop-shadow(0 0 45px rgba(124,58,237,0.45))",
       }}
       />
       </div>
       </motion.div>
      {/* ═══════════════════════════════════════════════ */}
      {/* RELÓGIO FIXO */}
      {/* ═══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-9999"
      >
        <ClockWidget />
      </motion.div>

      {/* ═══════════════════════════════════════════════ */}
      {/* CLIMA FIXO */}
      {/* ═══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-9999"
      >
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/6 shadow-2xl shadow-black/50">
          {weather ? (
            <>
              <div className="flex items-center gap-2">
                <WeatherIcon icon={weather.icon} />

                <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                  {weather.temp}°
                </span>
              </div>

              <div className="flex flex-col text-sm text-gray-300">
                <span className="capitalize text-base font-medium text-white">
                  {weather.description}
                </span>

                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-violet-400" />
                    {weather.humidity}%
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-violet-400" />
                    {weather.windSpeed} m/s
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-400 ml-2">
                <MapPin className="w-4 h-4 text-violet-400" />
                {weather.city}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">
                Carregando clima...
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════ */}
      {/* NOTÍCIAS */}
      {/* ═══════════════════════════════════════════════ */}
      {news.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92vw] md:w-[75vw] lg:w-[60vw] z-9999"
        >
          <div className="bg-black/30 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/5 shadow-lg shadow-black/40 overflow-hidden">
            <div className="flex items-center gap-2 text-sm">
              <Newspaper className="w-4 h-4 text-violet-400 shrink-0" />

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

      {/* GLOBAL */}
      <style>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #03060D;
        }
      `}</style>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// RELÓGIO
// ──────────────────────────────────────────────────────────────────
function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/6 shadow-2xl shadow-black/50">
      <Clock className="w-5 h-5 text-violet-400" />

      <span className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(124,58,237,0.5)]">
        {time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </div>
  );
}