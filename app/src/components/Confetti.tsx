"use client";

import { FC, useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  variant?: "bet" | "win";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  life: number;
}

const BET_COLORS = ["#9333EA", "#14B8A6", "#A855F7", "#2DD4BF", "#7C3AED", "#5EEAD4"];
const WIN_COLORS = ["#FFD700", "#FFA500", "#FFEC44", "#14B8A6", "#9333EA", "#FF6B6B", "#FFD700", "#FFFFFF"];

export const Confetti: FC<ConfettiProps> = ({ active, variant = "bet" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = variant === "win" ? WIN_COLORS : BET_COLORS;
    const count = variant === "win" ? 150 : 80;

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.4;
      const angle = Math.random() * Math.PI * 2;
      const speed = variant === "win" ? 8 + Math.random() * 12 : 4 + Math.random() * 8;

      particles.push({
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (variant === "win" ? 6 : 3),
        size: variant === "win" ? 6 + Math.random() * 10 : 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        life: 1,
      });
    }

    let startTime = Date.now();
    const duration = variant === "win" ? 3000 : 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.life = Math.max(0, 1 - elapsed / duration);
        p.opacity = p.life;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Mix of rectangles and circles for variety
        if (Math.random() > 0.5) {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [active, variant]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
