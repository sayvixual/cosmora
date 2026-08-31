"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hasGlow?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let shootingStar: ShootingStar | null = null;
    let lastShootingStarTime = Date.now();

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      if (width <= 0 || height <= 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Clean, tasteful count of bright white stars (~35-50 on desktop, ~20-25 on mobile)
      const count = Math.min(Math.floor((width * height) / 32000), 50);
      stars = [];

      for (let i = 0; i < count; i++) {
        const isBrightGlowStar = i % 7 === 0;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: isBrightGlowStar ? Math.random() * 0.6 + 1.2 : Math.random() * 0.6 + 0.6,
          baseAlpha: Math.random() * 0.35 + 0.65,
          twinkleSpeed: Math.random() * 0.0025 + 0.0012,
          twinkleOffset: Math.random() * Math.PI * 2,
          hasGlow: isBrightGlowStar,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const spawnShootingStar = (width: number, height: number) => {
      shootingStar = {
        x: Math.random() * (width * 0.75) + width * 0.1,
        y: Math.random() * (height * 0.35),
        length: Math.random() * 60 + 50,
        speed: Math.random() * 6 + 10,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1), // ~45 degrees diagonal
        opacity: 1,
        active: true,
      };
    };

    const render = (time: number) => {
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        if (width <= 0 || height <= 0) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(dpr, dpr);

        // 1. Draw Twinkling Ambient Stars
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          const alphaFactor = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
          const currentAlpha = Math.max(0.2, Math.min(1.0, star.baseAlpha + alphaFactor * 0.35));

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
          ctx.shadowBlur = star.hasGlow ? 5 : 2;
          ctx.fill();

          // Subtle diffraction cross spike on bright stars when peaked
          if (star.hasGlow && currentAlpha > 0.82) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${(currentAlpha - 0.7) * 0.75})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x - star.radius * 3, star.y);
            ctx.lineTo(star.x + star.radius * 3, star.y);
            ctx.moveTo(star.x, star.y - star.radius * 3);
            ctx.lineTo(star.x, star.y + star.radius * 3);
            ctx.stroke();
          }
        }

        ctx.shadowBlur = 0;

        // 2. Occasional Subtle Shooting Star (every 8 - 14 seconds)
        const now = Date.now();
        if (!shootingStar && now - lastShootingStarTime > 8000) {
          if (Math.random() < 0.02) {
            spawnShootingStar(width, height);
            lastShootingStarTime = now;
          }
        }

        if (shootingStar && shootingStar.active) {
          const safeOpacity = Math.max(0, Math.min(1, shootingStar.opacity));

          if (safeOpacity > 0.02) {
            const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
            const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

            const gradient = ctx.createLinearGradient(
              tailX,
              tailY,
              shootingStar.x,
              shootingStar.y
            );
            gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.7, `rgba(255, 255, 255, ${Math.max(0, safeOpacity * 0.35)})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${Math.max(0, safeOpacity * 0.9)})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(shootingStar.x, shootingStar.y);
            ctx.stroke();

            // Head bright particle point with glow
            ctx.beginPath();
            ctx.arc(shootingStar.x, shootingStar.y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${safeOpacity})`;
            ctx.shadowColor = "rgba(255, 255, 255, 1)";
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Advance shooting star position and smoothly decay opacity
          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.opacity -= 0.016;

          if (
            shootingStar.opacity <= 0.02 ||
            shootingStar.x > width + 150 ||
            shootingStar.y > height + 150
          ) {
            shootingStar.active = false;
            shootingStar = null;
            lastShootingStarTime = Date.now();
          }
        }

        ctx.restore();
      } catch (err) {
        console.warn("Starfield render warning:", err);
      } finally {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
