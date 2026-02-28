"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";
import {
  Camera,
  User,
  Activity,
  Shield,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- TYPES ---------------- */

type PageType = "home" | "insights" | "camera";
type InsightMode = "emotion" | "driver";
type CameraMode = "emotion" | "driver";

/* ---------------- DEMO DATA SIMULATION ---------------- */

function useTelemetry() {
  const [data, setData] = useState({
    fatigueScore: 28,
    blinkRate: 14,
    eyeClosureTime: 180,
    safetyScore: 92,
    alertness: 88,
    emotionalRisk: 22,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((d) => ({
        fatigueScore: Math.max(5, Math.min(95, d.fatigueScore + (Math.random() * 10 - 5))),
        blinkRate: Math.max(5, Math.min(30, d.blinkRate + (Math.random() * 4 - 2))),
        eyeClosureTime: Math.max(100, Math.min(400, d.eyeClosureTime + (Math.random() * 40 - 20))),
        safetyScore: Math.max(50, Math.min(100, d.safetyScore + (Math.random() * 6 - 3))),
        alertness: Math.max(40, Math.min(100, d.alertness + (Math.random() * 8 - 4))),
        emotionalRisk: Math.max(5, Math.min(95, d.emotionalRisk + (Math.random() * 8 - 4))),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
}

/* ---------------- UTILS ---------------- */

const getStatusColor = (value: number) => {
  if (value > 70) return "text-green-600";
  if (value > 40) return "text-orange-500";
  return "text-red-500";
};

const getRiskColor = (value: number) => {
  if (value < 30) return "#16a34a";
  if (value < 60) return "#f59e0b";
  return "#dc2626";
};

/* ---------------- COMPONENT ---------------- */

export default function Page() {
  const [page, setPage] = useState<PageType>("home");
  const [insightMode, setInsightMode] = useState<InsightMode>("emotion");
  const [cameraMode, setCameraMode] = useState<CameraMode>("emotion");
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const telemetry = useTelemetry();

  const emotions = [
    { name: "Happy", value: 72, color: "#22c55e" },
    { name: "Sad", value: 48, color: "#3b82f6" },
    { name: "Angry", value: 35, color: "#ef4444" },
    { name: "Neutral", value: 60, color: "#9ca3af" },
    { name: "Fear", value: 25, color: "#a855f7" },
  ];

  const getSuggestion = (emotion: string) => {
    switch (emotion) {
      case "Sad":
        return "Take a short mindful break. Deep breathing may help reset mood.";
      case "Angry":
        return "Pause driving if possible. Practice slow breathing to regain focus.";
      case "Fear":
        return "Ground yourself. Focus on steady breathing and safe surroundings.";
      case "Neutral":
        return "You are stable. Maintain calm focus for safe driving.";
      case "Happy":
        return "Positive mood detected. Stay attentive and avoid overconfidence.";
      default:
        return null;
    }
  };

  const timeline = [
    { t: "10:00", risk: 10 },
    { t: "10:05", risk: 22 },
    { t: "10:10", risk: 18 },
    { t: "10:15", risk: 35 },
    { t: "10:20", risk: 28 },
    { t: "10:25", risk: 48 },
  ];

  const pageAnim = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 overflow-hidden">

      {/* ================= NAVBAR  ================= */}
      <div className="fixed top-6 left-0 right-0 flex justify-center z-50">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-[95%] max-w-[1600px] rounded-full px-10 py-3 flex justify-between items-center bg-white/80 backdrop-blur border border-gray-200"
        >
          <div className="flex items-center gap-10">
            <div className="text-xl font-medium tracking-wide">CongniRide</div>
            

            <div className="relative flex gap-4 bg-gray-100 rounded-full p-2">
              {["home", "insights", "camera"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPage(item as PageType)}
                  className="relative px-6 py-2 text-sm font-medium"
                >
                  {page === item && (
                    <motion.div
                      layoutId="activeSegment"
                      className="absolute inset-0 bg-blue-600 rounded-full"
                    />
                  )}
                  <span
                    className={`relative ${
                      page === item ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <button onClick={() => setOpen(!open)}>
              <User size={20} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-md border py-2">
                <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                  Profile
                </button>
                <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                  Logout
                </button>
              </div>
            )}
          </div>
        </motion.nav>
      </div>

      <div className="pt-32 relative z-10 px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ================= HOME (REPLACED) ================= */}
          {page === "home" && (
            <motion.div key="home" {...pageAnim} className="pt-10">
              <div className="grid md:grid-cols-2 gap-16 items-center">

                <div>
                  <h2 className="text-5xl font-bold leading-tight mb-6">
                    AI Stress Intelligence & <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Driver Safety Monitoring</span>
                  </h2>

                  <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                    CongniRide uses real-time Al analysis to monitor emotional stress, fatigue,
                    and cognitive alertness- helping prevent accidents and promote safer 
                    driving.
                  </p>

                  <div className="flex gap-6">
  <motion.button
    whileHover={{ scale: 1.05 }}
    onClick={() => setAuthMode("login")}
    className="px-8 py-4 rounded-xl bg-blue-600 text-white border-2 border-blue-400 shadow-xl"
  >
    Log In
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    onClick={() => setAuthMode("signup")}
    className="px-8 py-4 rounded-xl bg-white text-blue-600 border-2 border-blue-600 shadow-lg"
  >
    Sign Up
  </motion.button>
</div>
                </div>

                <div className="relative flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 blur-3xl opacity-40 absolute"
                  />
                  <div className="w-72 h-72 rounded-full bg-white shadow-2xl border border-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                    AI Emotion Core
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-24">
                {["Real-Time Detection", "Smart Suggestions", "Emotion Analytics"].map((feature, i) => (
                  <motion.div key={i} whileHover={{ y: -8 }} className="bg-white/70 backdrop-blur border border-blue-100 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold mb-3">{feature}</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced AI-driven system providing intelligent insights
                      into emotional patterns and stress behavior.
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* INSIGHTS AND CAMERA PAGES REMAIN 100% UNCHANGED BELOW */}

          {/* INSIGHTS */}
          {page === "insights" && (
            <motion.div key="insights" {...pageAnim}>
              {/* toggle */}
              <div className="flex gap-3 mb-10">
                {["emotion", "driver"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setInsightMode(m as InsightMode)}
                    className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                      insightMode === m
                        ? "bg-white shadow"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {m} insights
                  </button>
                ))}
              </div>

              {/* Emotion Mode */}
              {insightMode === "emotion" && (
  <>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {emotions.map((emotion) => {
        const suggestion = getSuggestion(emotion.name);

        return (
          <motion.div
            key={emotion.name}
            whileHover={{ y: -4 }}
            onClick={() => {
              if (emotion.name !== "Happy" && emotion.name !== "Neutral") {
                setDialog(suggestion);
              }
            }}
            className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer"
          >
            <div
              className="h-1 w-full rounded-full mb-5"
              style={{ backgroundColor: emotion.color }}
            />

            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">{emotion.name}</h4>
              <span className="text-sm text-gray-500">
                {emotion.value}%
              </span>
            </div>

            <div className="h-32">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[emotion]} dataKey="value" outerRadius={45}>
                    <Cell fill={emotion.color} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-gray-500 mt-3">{suggestion}</p>
          </motion.div>
        );
      })}
    </div>

    {/* Dialog Alert */}
    <AnimatePresence>
      {dialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            className="bg-white rounded-2xl p-6 shadow-xl max-w-sm mx-4"
          >
            <h3 className="font-semibold text-lg mb-2">
              ⚠ Emotional Alert
            </h3>

            <p className="text-sm text-gray-600 mb-6">{dialog}</p>

            <button
              onClick={() => setDialog(null)}
              className="w-full py-2 rounded-xl bg-blue-600 text-white text-sm"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
)}

              {/* Driver Mode */}
              {insightMode === "driver" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { label: "Safety Score", value: telemetry.safetyScore },
                      { label: "Fatigue Level", value: telemetry.fatigueScore },
                      { label: "Alertness", value: telemetry.alertness },
                    ].map((card) => (
                      <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className={`text-3xl font-semibold ${getStatusColor(card.value)}`}>
                          {Math.round(card.value)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h4 className="mb-4 font-medium">Risk Events Timeline</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={timeline}>
                        <XAxis dataKey="t" />
                        <Tooltip />
                        <Line type="monotone" dataKey="risk" stroke="#3b82f6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* CAMERA */}
          {page === "camera" && (
            <motion.div key="camera" {...pageAnim}>
              <div className="flex gap-3 mb-8">
                {["emotion", "driver"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setCameraMode(m as CameraMode)}
                    className={`px-4 py-1.5 rounded-full capitalize ${
                      cameraMode === m ? "bg-white shadow" : "bg-gray-200"
                    }`}
                  >
                    {m} mode
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="relative bg-white rounded-2xl p-4 shadow-sm">
                  <Webcam ref={webcamRef} className="rounded-xl w-full" />

                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full">
                    LIVE
                  </div>
                </div>

                {/* Emotion Mode */}
                {cameraMode === "emotion" && (
                  <div className="space-y-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <p className="text-sm text-gray-500">Emotion</p>
                      <p className="text-xl font-semibold">Calm</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-2">Stress Level</p>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${telemetry.fatigueScore}%` }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Driver Mode */}
                {cameraMode === "driver" && (
                  <div className="space-y-5">
                    {[
                      {
                        label: "Alertness",
                        value: telemetry.alertness,
                      },
                      {
                        label: "Eye Closure",
                        value: telemetry.eyeClosureTime,
                      },
                      {
                        label: "Emotional Risk",
                        value: telemetry.emotionalRisk,
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className={`text-xl font-semibold ${getStatusColor(item.value)}`}>
                          {Math.round(item.value)}
                        </p>
                      </div>
                    ))}

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <p className="text-sm text-gray-500">Safety Intervention</p>
                      <p className="text-green-600 font-medium">
                        Monitoring — No intervention required
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      {/* ================= ENHANCED AUTH MODAL ================= */}
<AnimatePresence>
  {authMode && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.94, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 40 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4 
                   bg-white rounded-3xl p-10 
                   shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] 
                   border border-gray-100"
      >
        {/* CROSS BUTTON */}
        <button
          onClick={() => setAuthMode(null)}
          className="absolute top-6 right-6 
                     w-9 h-9 rounded-full 
                     bg-gray-100 hover:bg-gray-200 
                     flex items-center justify-center 
                     text-gray-500 hover:text-gray-700 
                     transition-all duration-200"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {authMode === "login"
              ? "Sign in to continue intelligent driver monitoring."
              : "Join CongniRide and experience smarter driving."}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">
          {authMode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-5 py-3 rounded-2xl 
                         border border-gray-200 
                         bg-gray-50
                         focus:bg-white 
                         focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-100 
                         outline-none transition-all text-sm"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-5 py-3 rounded-2xl 
                       border border-gray-200 
                       bg-gray-50
                       focus:bg-white 
                       focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-100 
                       outline-none transition-all text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 rounded-2xl 
                       border border-gray-200 
                       bg-gray-50
                       focus:bg-white 
                       focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-100 
                       outline-none transition-all text-sm"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-2xl 
                       bg-blue-600 hover:bg-blue-700 
                       text-white font-medium tracking-wide 
                       shadow-lg transition-all duration-200"
          >
            {authMode === "login" ? "Log In" : "Create Account"}
          </motion.button>
        </div>

        {/* SWITCH */}
        <div className="text-center text-sm text-gray-500 mt-8">
          {authMode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setAuthMode("signup")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setAuthMode("login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}