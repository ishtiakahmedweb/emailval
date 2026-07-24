"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 15 }, (_, i) => ({
  x: 5 + (i * 7) % 90,
  y: 5 + (i * 13) % 90,
  size: 1.5 + (i % 3) * 0.8,
  duration: 16 + (i % 5) * 3,
  delay: (i * 0.7) % 8,
  color: i % 4 === 0
    ? "rgba(116,88,219,0.5)"
    : i % 4 === 1
      ? "rgba(34,211,238,0.35)"
      : i % 4 === 2
        ? "rgba(217,70,239,0.3)"
        : "rgba(180,164,239,0.35)",
  glow: i % 4 === 0
    ? "0 0 8px rgba(116,88,219,0.25)"
    : i % 4 === 1
      ? "0 0 8px rgba(34,211,238,0.15)"
      : i % 4 === 2
        ? "0 0 8px rgba(217,70,239,0.15)"
        : "0 0 8px rgba(180,164,239,0.15)",
}));

const gridDots = Array.from({ length: 25 }, (_, i) => ({
  row: Math.floor(i / 5),
  col: i % 5,
  delay: i * 0.12,
}));

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#04030a]" />

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(116,88,219,0.35) 0%, transparent 60%)",
            "radial-gradient(ellipse 70% 50% at 80% 70%, rgba(34,211,238,0.20) 0%, transparent 55%)",
            "radial-gradient(ellipse 60% 70% at 50% 20%, rgba(217,70,239,0.15) 0%, transparent 55%)",
            "radial-gradient(ellipse 65% 50% at 30% 80%, rgba(180,164,239,0.12) 0%, transparent 50%)",
          ].join(", "),
          backgroundSize: "300% 300%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ perspective: "900px" }}>
        <motion.div
          className="rounded-full"
          style={{
            width: "800px", height: "280px",
            border: "1px solid rgba(116,88,219,0.15)",
            transformStyle: "preserve-3d",
            transform: "rotateX(65deg)",
            boxShadow: "0 0 40px rgba(116,88,219,0.05), inset 0 0 40px rgba(116,88,219,0.03)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ perspective: "900px" }}>
        <motion.div
          className="rounded-full"
          style={{
            width: "550px", height: "200px",
            border: "1px solid rgba(34,211,238,0.10)",
            transformStyle: "preserve-3d",
            transform: "rotateX(65deg)",
            boxShadow: "0 0 30px rgba(34,211,238,0.03), inset 0 0 30px rgba(34,211,238,0.02)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ perspective: "900px" }}>
        <motion.div
          className="rounded-full"
          style={{
            width: "350px", height: "140px",
            border: "1px solid rgba(217,70,239,0.08)",
            transformStyle: "preserve-3d",
            transform: "rotateX(65deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(116,88,219,0.4) 20%, rgba(34,211,238,0.4) 50%, rgba(116,88,219,0.4) 80%, transparent 100%)",
          filter: "blur(1.5px)",
          top: "-2%",
        }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.15) 30%, transparent 100%)",
          filter: "blur(3px)",
          top: "30%",
        }}
        animate={{ top: ["30%", "70%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
      />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(116,88,219,0.10) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(116,88,219,0.10) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "80px 80px",
        }}
      />

      {gridDots.map((dot) => (
        <motion.div
          key={`${dot.row}-${dot.col}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `calc(${12.5 + dot.col * 25}% - 2px)`,
            top: `calc(${12.5 + dot.row * 25}% - 2px)`,
            background: "rgba(116,88,219,0.4)",
            boxShadow: "0 0 4px rgba(116,88,219,0.2)",
          }}
          animate={{ opacity: [0, 0.7, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color,
            boxShadow: p.glow,
          }}
          animate={{
            y: [-20, 25, -15, 20, -20],
            x: [-10, 15, -20, 10, -10],
            opacity: [0.15, 0.55, 0.2, 0.5, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
