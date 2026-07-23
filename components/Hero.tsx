/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

// ── 3D type helpers ─────────────────────────────────────────────────────────
type Vec3 = [number, number, number];

const rotX = ([x, y, z]: Vec3, a: number): Vec3 => [
  x,
  y * Math.cos(a) - z * Math.sin(a),
  y * Math.sin(a) + z * Math.cos(a),
];
const rotY = ([x, y, z]: Vec3, a: number): Vec3 => [
  x * Math.cos(a) + z * Math.sin(a),
  y,
  -x * Math.sin(a) + z * Math.cos(a),
];
const rotZ = ([x, y, z]: Vec3, a: number): Vec3 => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a),
  z,
];

// ── Shape definitions ────────────────────────────────────────────────────────
const SHAPES = [
  // Cube
  {
    verts: [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ] as Vec3[],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ] as [number, number][],
  },
  // Tetrahedron
  {
    verts: [
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1],
    ] as Vec3[],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3],
    ] as [number, number][],
  },
  // Octahedron
  {
    verts: [
      [1.4, 0, 0],
      [-1.4, 0, 0],
      [0, 1.4, 0],
      [0, -1.4, 0],
      [0, 0, 1.4],
      [0, 0, -1.4],
    ] as Vec3[],
    edges: [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 4],
      [2, 5],
      [3, 4],
      [3, 5],
    ] as [number, number][],
  },
  // Diamond
  {
    verts: [
      [0, 2, 0],
      [0, -2, 0],
      [1, 0, 0.8],
      [1, 0, -0.8],
      [-1, 0, 0.8],
      [-1, 0, -0.8],
    ] as Vec3[],
    edges: [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 4],
      [2, 3],
      [3, 5],
      [4, 5],
    ] as [number, number][],
  },
];

// ── Floating 3D shapes canvas ────────────────────────────────────────────────
const FloatingShapes3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Floater = {
      shapeIdx: number;
      x: number;
      y: number;
      size: number;
      rx: number;
      ry: number;
      rz: number;
      vrx: number;
      vry: number;
      vrz: number;
      vx: number;
      vy: number;
      color: [number, number, number];
      opacity: number;
    };

    const PALETTE: [number, number, number][] = [
      [56, 189, 248], // sky-400
      [99, 102, 241], // indigo-500
      [147, 197, 253], // blue-300
      [165, 180, 252], // indigo-300
      [224, 231, 255], // indigo-100
    ];

    const floaters: Floater[] = Array.from({ length: 14 }, (_, i) => ({
      shapeIdx: i % SHAPES.length,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 16 + Math.random() * 58,
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      vrx: (Math.random() - 0.5) * 0.007,
      vry: (Math.random() - 0.5) * 0.009,
      vrz: (Math.random() - 0.5) * 0.005,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.16,
      color: PALETTE[i % PALETTE.length],
      opacity: 0.08 + Math.random() * 0.22,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      floaters.forEach((fl) => {
        fl.rx += fl.vrx;
        fl.ry += fl.vry;
        fl.rz += fl.vrz;
        fl.x += fl.vx;
        fl.y += fl.vy;

        const pad = 130;
        if (fl.x < -pad) fl.x = canvas.width + pad;
        if (fl.x > canvas.width + pad) fl.x = -pad;
        if (fl.y < -pad) fl.y = canvas.height + pad;
        if (fl.y > canvas.height + pad) fl.y = -pad;

        const shape = SHAPES[fl.shapeIdx];
        const fov = 5;

        const projected = shape.verts.map((v) => {
          let rv = rotX(v, fl.rx);
          rv = rotY(rv, fl.ry);
          rv = rotZ(rv, fl.rz);
          const d = fov / (fov + rv[2] * 0.4);
          return {
            px: fl.x + rv[0] * d * fl.size,
            py: fl.y + rv[1] * d * fl.size,
            z: rv[2],
          };
        });

        shape.edges.forEach(([a, b]) => {
          const pa = projected[a];
          const pb = projected[b];
          const depthAlpha = Math.max(0.12, ((pa.z + pb.z) / 2 + 1.5) / 3);
          const alpha = fl.opacity * depthAlpha;
          ctx.beginPath();
          ctx.moveTo(pa.px, pa.py);
          ctx.lineTo(pb.px, pb.py);
          ctx.strokeStyle = `rgba(${fl.color[0]},${fl.color[1]},${
            fl.color[2]
          },${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

// ── Wireframe Globe ──────────────────────────────────────────────────────────
const WireframeGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const rotRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const R = Math.min(canvas.width, canvas.height) * 0.26;
    const LATITUDES = 12;
    const LONGITUDES = 18;
    const NODES: { lat: number; lon: number }[] = [];

    for (let la = 0; la <= LATITUDES; la++)
      for (let lo = 0; lo < LONGITUDES; lo++)
        NODES.push({
          lat: (la / LATITUDES) * Math.PI,
          lon: (lo / LONGITUDES) * 2 * Math.PI,
        });

    const project = (lat: number, lon: number, rot: number) => {
      const x3 = Math.sin(lat) * Math.cos(lon + rot);
      const y3 = Math.cos(lat);
      const z3 = Math.sin(lat) * Math.sin(lon + rot);
      return { x: x3 * R, y: y3 * R, z: z3 };
    };

    const pulseNodes = NODES.filter((_, i) => i % 7 === 0).map((n) => ({
      ...n,
      phase: Math.random() * Math.PI * 2,
      speed: 0.03 + Math.random() * 0.02,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rot = rotRef.current;
      t += 0.016;

      for (let la = 1; la < LATITUDES; la++) {
        const lat = (la / LATITUDES) * Math.PI;
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= 360; a += 3) {
          const lon = (a / 360) * 2 * Math.PI;
          const p = project(lat, lon, rot);
          const alpha = Math.max(0, p.z * 0.6 + 0.15);
          if (first) {
            ctx.moveTo(cx + p.x, cy + p.y);
            first = false;
          } else ctx.lineTo(cx + p.x, cy + p.y);
          ctx.strokeStyle = `rgba(56,189,248,${alpha.toFixed(2)})`;
        }
        ctx.closePath();
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      for (let lo = 0; lo < LONGITUDES; lo++) {
        const lon = (lo / LONGITUDES) * 2 * Math.PI;
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= 180; a += 3) {
          const lat = (a / 180) * Math.PI;
          const p = project(lat, lon, rot);
          const alpha = Math.max(0, p.z * 0.6 + 0.15);
          ctx.strokeStyle = `rgba(99,102,241,${alpha.toFixed(2)})`;
          if (first) {
            ctx.moveTo(cx + p.x, cy + p.y);
            first = false;
          } else ctx.lineTo(cx + p.x, cy + p.y);
        }
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      pulseNodes.forEach((n) => {
        const p = project(n.lat, n.lon, rot);
        if (p.z < -0.1) return;
        const alpha = Math.max(0, p.z * 0.8 + 0.2);
        const pulse = 0.5 + 0.5 * Math.sin(t * n.speed * 60 + n.phase);
        const r = 2.5 + pulse * 3;

        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${(alpha * pulse * 0.15).toFixed(3)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,230,253,${(alpha * 0.9).toFixed(2)})`;
        ctx.fill();

        pulseNodes.forEach((n2) => {
          if (n2 === n) return;
          const p2 = project(n2.lat, n2.lon, rot);
          if (p2.z < 0) return;
          const dx = p.x - p2.x,
            dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < R * 0.55) {
            const lineAlpha = (1 - dist / (R * 0.55)) * alpha * 0.25;
            ctx.beginPath();
            ctx.moveTo(cx + p.x, cy + p.y);
            ctx.lineTo(cx + p2.x, cy + p2.y);
            ctx.strokeStyle = `rgba(147,197,253,${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      rotRef.current += 0.0022;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

// ── Main Hero ────────────────────────────────────────────────────────────────
export const Hero: React.FC = () => {
  const fontStack = '"the-seasons", "The Seasons", "Bodoni Moda", serif';

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 overflow-hidden bg-[#050505]">
      {/* Globe */}
      <WireframeGlobe />

      {/* Floating 3D geometric shapes */}
      <FloatingShapes3D />

      {/* Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 38%, #050505 82%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center text-center max-w-6xl w-full"
        style={{ zIndex: 10, gap: "1.8rem" }}
      >
        {/* Status badge */}
        <div className="hero-enter" style={{ animationDelay: "0.3s" }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl"
            style={{
              background: "rgba(56,189,248,0.05)",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <span className="text-xs font-mono text-sky-400 tracking-widest uppercase">
              Open to Work
            </span>
          </div>
        </div>

        {/* ── Name — all on one line ── */}
        <div className="w-full">
          <svg
            viewBox="0 0 1000 140"
            className="w-full h-auto drop-shadow-2xl"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient
                id="silverGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#d4d4d8" />
                <stop offset="100%" stopColor="#a1a1aa" />
              </linearGradient>
            </defs>

            {/* Stroke draw layer */}
            <text
              x="50%"
              y="72%"
              textAnchor="middle"
              fontSize="78"
              style={{
                fontFamily: fontStack,
                stroke: "#d4d4d8",
                fill: "transparent",
                strokeWidth: "0.6px",
                letterSpacing: "0.04em",
                animation: "drawName 2s cubic-bezier(0.4,0,0.2,1) forwards",
              }}
            >
              Salome Avsa Miller
            </text>

            {/* Fill layer */}
            <text
              x="50%"
              y="72%"
              textAnchor="middle"
              fontSize="78"
              style={{
                fontFamily: fontStack,
                fill: "url(#silverGrad)",
                fillOpacity: 0,
                stroke: "none",
                letterSpacing: "0.04em",
                animation: "fillName 1s ease-out 1.8s forwards",
              }}
            >
              Salome Avsa Miller
            </text>
          </svg>
        </div>

        {/* Thin rule */}
        <div
          className="hero-enter w-24 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"
          style={{ animationDelay: "2.1s" }}
        />

        {/* Roles */}
        <div
          className="hero-enter flex items-center gap-5 text-zinc-300 text-xs tracking-[0.28em] uppercase font-light"
          style={{ animationDelay: "2.2s", fontFamily: "Inter, sans-serif" }}
        >
          <span className="hover:text-zinc-200 transition-colors duration-300">
            Software Engineer
          </span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="hover:text-zinc-200 transition-colors duration-300">
            Brand Developer
          </span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="hover:text-zinc-200 transition-colors duration-300">
            Visual Artist
          </span>
        </div>

        {/* Bio */}
        <p
          className="hero-enter max-w-xl text-base leading-8 text-zinc-300 font-light"
          style={{ animationDelay: "2.5s", fontFamily: "Inter, sans-serif" }}
        >
          Merging technical precision with fluid aesthetics.
          <br className="hidden md:block" />
          Specializing in full-stack applications, interactive tools, and brand
          strategy.
        </p>

        {/* CTAs */}
        <div
          className="hero-enter flex flex-wrap gap-4"
          style={{ animationDelay: "2.8s" }}
        >
          <Link
            to="/experience"
            className="group relative px-8 py-3.5 bg-zinc-100 text-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(255,255,255,0.25)]"
          >
            <span
              className="relative z-10 tracking-wide text-sm"
              style={{ fontFamily: fontStack }}
            >
              View Experience
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-300 via-white to-zinc-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          </Link>
          <a
            href="#contact"
            className="px-8 py-3.5 bg-transparent border border-zinc-800 text-zinc-300 text-sm font-light rounded-full hover:bg-zinc-900/60 hover:border-zinc-600 hover:text-white backdrop-blur-md transition-all duration-300 tracking-wide"
            style={{ fontFamily: fontStack }}
          >
            Contact Me
          </a>
        </div>

        {/* Social links */}
        <div
          className="hero-enter flex items-center gap-5"
          style={{ animationDelay: "3.0s" }}
        >
          <a
            href="https://www.linkedin.com/in/salome-avsa-miller"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-sky-400 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <span className="w-px h-4 bg-zinc-800" />
          <a
            href="https://github.com/AvsaStudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-200 transition-colors duration-300"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-enter absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-700 z-20 animate-bounce"
        style={{ animationDelay: "3.2s" }}
      >
        <ArrowDownIcon className="w-5 h-5" />
      </div>

      <style>{`
        @keyframes drawName {
          from { stroke-dashoffset: 12000; stroke-dasharray: 12000; }
          to   { stroke-dashoffset: 0;     stroke-dasharray: 12000; }
        }
        @keyframes fillName {
          to { fill-opacity: 1; }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        .hero-enter {
          opacity: 0;
          animation: heroFadeUp 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </section>
  );
};
