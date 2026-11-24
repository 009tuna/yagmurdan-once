"use client";

import React, { useEffect, useRef } from "react";
import { UNDERPASS_SITES } from "@/data/dossier";
import {
  DISPATCH_DEPOT,
  RESERVE_BASES,
  projectGrid,
  routePath,
} from "@/lib/atlas-geometry";

interface AtlasDispatchCanvasProps {
  mode: "allocate" | "reroute";
  progressRef: React.MutableRefObject<number>;
  roadworkBypass: boolean;
  approved: boolean;
}

const TAU = Math.PI * 2;
const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const ease = (n: number) => {
  const x = clamp(n);
  return x * x * (3 - 2 * x);
};
const mix = (a: number, b: number, x: number) => a + (b - a) * x;

function drawPolygon(
  c: CanvasRenderingContext2D,
  coords: Array<[number, number]>,
  fill: string | null,
  stroke: string | null,
  width = 1,
) {
  c.beginPath();
  coords.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}

function drawText(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  size: number,
  color: string,
  weight = "500",
  align: CanvasTextAlign = "left",
  halo = false,
) {
  c.font = `${weight} ${size}px "DM Sans", Arial, sans-serif`;
  c.textAlign = align;
  c.textBaseline = "middle";
  if (halo) {
    c.lineJoin = "round";
    c.strokeStyle = "#f0f0e3";
    c.lineWidth = 3.2;
    c.strokeText(text, x, y);
  }
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function drawWeatherCell(
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  centerX: number,
  centerY: number,
  power: number,
) {
  const colors = [
    "rgba(91,134,119,0.13)",
    "rgba(72,128,113,0.16)",
    "rgba(63,125,111,0.18)",
    "rgba(48,118,102,0.22)",
    "rgba(38,104,91,0.23)",
    "rgba(36,92,83,0.25)",
    "rgba(27,81,70,0.27)",
  ];
  c.save();
  c.translate(centerX * w, centerY * h);
  c.scale(w, h);
  c.rotate(-0.22);
  for (let q = 0; q < 7; q++) {
    const r = (1 - 0.094 * q) * power;
    const outline: Array<[number, number]> = [];
    for (let j = 0; j <= 100; j++) {
      const a = (j / 100) * TAU;
      const n =
        1 +
        0.12 * Math.sin(3 * a + 0.4) +
        0.085 * Math.cos(5 * a - 0.5) +
        0.043 * Math.sin(9 * a + q * 0.06) +
        0.027 * Math.cos(14 * a);
      const x = r * (0.375 * n * Math.cos(a) + 0.045 * Math.sin(a * 2));
      const y = r * (0.195 * n * Math.sin(a) + 0.028 * Math.cos(a * 3));
      outline.push([x + 0.007 * q, y + 0.002 * q]);
    }
    drawPolygon(c, outline, colors[q], "rgba(54,98,81,0.34)", 0.00075);
  }
  c.restore();
}

function drawAnimatedRoute(
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  coords: Array<[number, number]>,
  pct: number,
  color: string,
  thick: number,
  dashed = false,
): [number, number] {
  const line = coords.map(([x, y]): [number, number] => [x * w, y * h]);
  const lengths = [0];
  for (let k = 1; k < line.length; k++) {
    lengths.push(
      lengths[k - 1] +
        Math.hypot(line[k][0] - line[k - 1][0], line[k][1] - line[k - 1][1]),
    );
  }
  const totalLen = lengths[lengths.length - 1] || 1;
  const target = clamp(pct) * totalLen;
  let tip: [number, number] = line[0];

  c.beginPath();
  c.moveTo(tip[0], tip[1]);
  c.lineCap = "round";
  c.lineJoin = "round";
  for (let k = 1; k < line.length; k++) {
    const segLen = lengths[k] - lengths[k - 1] || 1;
    const f = clamp((target - lengths[k - 1]) / segLen);
    tip = [mix(line[k - 1][0], line[k][0], f), mix(line[k - 1][1], line[k][1], f)];
    c.lineTo(tip[0], tip[1]);
    if (f < 1) break;
  }
  c.setLineDash(dashed ? [5, 4] : []);
  c.strokeStyle = color;
  c.lineWidth = thick;
  c.stroke();
  c.setLineDash([]);
  return tip;
}

export function AtlasDispatchCanvas({
  mode,
  progressRef,
  roadworkBypass,
  approved,
}: AtlasDispatchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const flagsRef = useRef({ mode, roadworkBypass, approved });
  flagsRef.current = { mode, roadworkBypass, approved };

  useEffect(() => {
    const img = new Image();
    img.src = "/media/ankara-atlas.webp";
    baseImageRef.current = img;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let visible = true;
    let rafId = 0;

    const draw = () => {
      if (!visible) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 1 && h > 1) {
        const dpr = Math.min(1.75, window.devicePixelRatio || 1);
        const px = Math.round(w * dpr);
        const py = Math.round(h * dpr);
        if (canvas.width !== px || canvas.height !== py) {
          canvas.width = px;
          canvas.height = py;
        }
        const c = canvas.getContext("2d");
        if (c) {
          c.setTransform(px / w, 0, 0, py / h, 0, 0);
          c.save();
          c.beginPath();
          c.rect(0, 0, w, h);
          c.clip();

          const { mode: m, roadworkBypass: bypass, approved: isApproved } =
            flagsRef.current;
          const t = clamp(progressRef.current);
          const small = Math.min(w, h);
          const s = clamp(small * 0.023, 9, 13);

          const img = baseImageRef.current;
          if (img && img.complete && img.naturalWidth > 0) {
            c.drawImage(img, 0, 0, w, h);
          } else {
            c.fillStyle = "#f4f3ed";
            c.fillRect(0, 0, w, h);
          }

          // District labels
          const cities: Array<[string, number, number]> = [
            ["Ç A N K A Y A", 0.76, 0.34],
            ["B İ L K E N T", 0.23, 0.81],
            ["O D T Ü", 0.21, 0.39],
            ["S Ö Ğ Ü T Ö Z Ü", 0.44, 0.24],
          ];
          for (const [name, x, y] of cities) {
            drawText(
              c,
              w * x,
              h * y,
              name,
              w < 480 ? 8 : 11,
              "#667261",
              "600",
              "center",
              true,
            );
          }

          // Storm cell
          const cx = m === "reroute" ? mix(0.48, 0.77, ease(t * 1.25)) : 0.48;
          const cy = m === "reroute" ? mix(0.47, 0.42, ease(t * 1.25)) : 0.47;
          c.save();
          c.globalAlpha = m === "reroute" ? 0.68 : 0.35;
          drawWeatherCell(c, w, h, cx, cy, 1.12);
          c.restore();

          // Reserve buffer zones (P5 & P6)
          for (let i = 0; i < 2; i++) {
            const [rx, ry] = projectGrid(
              RESERVE_BASES[i][0],
              RESERVE_BASES[i][1],
            );
            const radius = m === "allocate" ? ease(t * 2.1) : 1;
            c.beginPath();
            c.ellipse(
              rx * w,
              ry * h,
              w * 0.084 * radius,
              h * 0.093 * radius,
              0,
              0,
              TAU,
            );
            c.fillStyle = "rgba(35,106,82,0.11)";
            c.fill();
            c.strokeStyle = "#507b61";
            c.setLineDash([3, 4]);
            c.lineWidth = 1;
            c.stroke();
            c.setLineDash([]);
          }

          // Roadwork marker near Çetin Emeç if active
          if (m === "allocate" && bypass) {
            const [bx, by] = projectGrid(15, 10);
            drawText(
              c,
              bx * w,
              by * h - 10,
              "YOL ÇALIŞMASI",
              9,
              "#be4528",
              "700",
              "center",
              true,
            );
          }

          // All 12 underpass nodes
          const nodeR = clamp(small * 0.012, 3.2, 6.6);
          UNDERPASS_SITES.forEach((site, i) => {
            const [ux, uy] = projectGrid(site.grid[0], site.grid[1]);
            const x = ux * w;
            const y = uy * h;
            const direct = i < 4;
            const easternTarget = m === "reroute" && (i === 6 || i === 7);

            c.beginPath();
            c.arc(
              x,
              y,
              direct || easternTarget ? nodeR * 1.32 : nodeR * 0.78,
              0,
              TAU,
            );
            c.fillStyle = direct
              ? "#be4528"
              : easternTarget
                ? "#236a52"
                : "#f7f6e9";
            c.strokeStyle = direct || easternTarget ? "#fff9e7" : "#566b60";
            c.lineWidth = 1.4;
            c.fill();
            c.stroke();
          });

          // Dispatch Routes P1..P6
          const ends = UNDERPASS_SITES.slice(0, 4)
            .map((site) => site.grid)
            .concat(RESERVE_BASES);

          for (let i = 0; i < 6; i++) {
            const f = m === "allocate" ? ease((t - i * 0.055) * 1.6) : 1;
            // Toggle turnFirst for P3 (index 2) when coordinator bypasses roadwork!
            const turn: 0 | 1 =
              i === 2 && bypass ? 1 : ((i % 2) as 0 | 1);

            if (i === 5 && m === "reroute" && t > 0.25) {
              const reroutePct = ease((t - 0.25) / 0.65);
              const path = routePath(
                RESERVE_BASES[1],
                UNDERPASS_SITES[6].grid,
                0,
              );
              const tip = drawAnimatedRoute(
                c,
                w,
                h,
                path,
                reroutePct,
                "#be4528",
                clamp(small * 0.0065, 2.5, 4.2),
                false,
              );
              const r = clamp(small * 0.022, 9, 13.5);
              c.fillStyle = "#236a52";
              c.fillRect(tip[0] - r, tip[1] - r * 0.72, r * 2, r * 1.44);
              drawText(c, tip[0], tip[1], "P6", 10, "#fff", "700", "center");
            } else if (f > 0) {
              const path = routePath(DISPATCH_DEPOT, ends[i], turn);
              const isDirect = i < 4;
              const routeColor = isDirect ? "#be4528" : "#236a52";
              const tip = drawAnimatedRoute(
                c,
                w,
                h,
                path,
                isApproved ? 1 : f,
                routeColor,
                clamp(small * 0.006, 2.2, 4),
                !isDirect,
              );
              const r = clamp(small * 0.021, 8.5, 13);
              c.fillStyle = routeColor;
              c.fillRect(tip[0] - r, tip[1] - r * 0.72, r * 2, r * 1.44);
              drawText(
                c,
                tip[0],
                tip[1],
                `P${i + 1}`,
                10,
                "#fff",
                "700",
                "center",
              );
            }
          }

          if (m === "reroute") {
            const [gx, gy] = projectGrid(
              UNDERPASS_SITES[6].grid[0],
              UNDERPASS_SITES[6].grid[1],
            );
            drawText(
              c,
              gx * w + 10,
              gy * h + 15,
              "Küçükesat (N11)",
              s,
              "#132825",
              "700",
              "left",
              true,
            );
          }

          // Legend strip inside canvas bottom-left
          const pad = w < 520 ? 10 : 16;
          const ly = h - pad - 28;
          c.fillStyle = "rgba(244,243,237,0.94)";
          c.fillRect(pad, ly, w < 440 ? 228 : 285, 26);
          c.strokeStyle = "rgba(19,40,37,0.2)";
          c.strokeRect(pad + 0.5, ly + 0.5, (w < 440 ? 228 : 285) - 1, 25);

          c.fillStyle = "#be4528";
          c.fillRect(pad + 10, ly + 10, 10, 6);
          drawText(
            c,
            pad + 25,
            ly + 13,
            m === "allocate" ? "Doğrudan (P1–P4)" : "Yerindeki P1",
            10,
            "#132825",
          );
          c.fillStyle = "#236a52";
          c.fillRect(pad + (w < 440 ? 120 : 145), ly + 10, 10, 6);
          drawText(
            c,
            pad + (w < 440 ? 135 : 160),
            ly + 13,
            m === "allocate" ? "Tampon (P5–P6)" : "P6 Rezerv Sevki",
            10,
            "#132825",
          );

          c.restore();
        }
      }
      rafId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(canvas);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Çankaya şematik koordinatör haritası ve pompa rotaları"
      className="block h-full w-full"
    />
  );
}
