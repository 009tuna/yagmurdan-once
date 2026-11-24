"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export type FixedStationState = "healthy" | "clogged" | "failed";

interface AkaySectionCanvasProps {
  phaseRef: React.MutableRefObject<number>;
  stationState: FixedStationState;
  rainIntensity: 20 | 30 | 40;
}

const PAPER = "#f4f3ed";
const INK = "#203932";
const GREEN = "#226953";
const ORANGE = "#be4528";
const AMBER = "#c47d24";
const BLUE = "#348b97";
const WATER = "#9bc9c4";
const EARTH = "#c8bc9e";
const WORLD_DEPTH = 162;
const X0 = 51;
const X1 = 872;

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const smooth = (x: number) => {
  const n = clamp(x);
  return n * n * (3 - 2 * n);
};
const range = (x: number, lo: number, hi: number) =>
  smooth((x - lo) / (hi - lo));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const jitter = (k: number) => {
  const x = Math.sin(k * 97.17 + 1.123) * 18753.77;
  return x - Math.floor(x);
};
const project = (x: number, y: number, z = 0): [number, number] => [
  x + z * 0.42,
  368 - y - z * 0.29,
];
const elevation = (x: number) =>
  94 - 81 * Math.pow(Math.max(0, Math.cos(((x - 452) * Math.PI) / 710)), 2);
const groundPair = (x: number, z: number) => project(x, elevation(x), z);

function shell(
  g: CanvasRenderingContext2D,
  pts: Array<[number, number]>,
  fill: string | null,
  stroke: string | null,
  width = 1,
  close = true,
) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (close) g.closePath();
  if (fill) {
    g.fillStyle = fill;
    g.fill();
  }
  if (stroke) {
    g.strokeStyle = stroke;
    g.lineWidth = width;
    g.stroke();
  }
}

function drawLine(
  g: CanvasRenderingContext2D,
  a: [number, number],
  b: [number, number],
  color: string,
  width = 1,
) {
  shell(g, [a, b], null, color, width, false);
}

function drawCircle(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill: string | null,
  stroke: string | null,
  width = 1,
) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    g.fillStyle = fill;
    g.fill();
  }
  if (stroke) {
    g.lineWidth = width;
    g.strokeStyle = stroke;
    g.stroke();
  }
}

function drawShape3(
  g: CanvasRenderingContext2D,
  vertices: Array<[number, number, number]>,
  fill: string | null,
  stroke: string | null,
  width = 1,
) {
  shell(
    g,
    vertices.map((p) => project(p[0], p[1], p[2])),
    fill,
    stroke,
    width,
  );
}

function drawPrism(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  face: string,
  top: string,
  side: string,
  outline = INK,
  lw = 0.7,
) {
  drawShape3(
    g,
    [
      [x + w, y, z],
      [x + w, y, z + d],
      [x + w, y + h, z + d],
      [x + w, y + h, z],
    ],
    side,
    outline,
    lw,
  );
  drawShape3(
    g,
    [
      [x, y, z],
      [x + w, y, z],
      [x + w, y + h, z],
      [x, y + h, z],
    ],
    face,
    outline,
    lw,
  );
  drawShape3(
    g,
    [
      [x, y + h, z],
      [x + w, y + h, z],
      [x + w, y + h, z + d],
      [x, y + h, z + d],
    ],
    top,
    outline,
    lw,
  );
}

function drawPipe(
  g: CanvasRenderingContext2D,
  pts: Array<[number, number]>,
  thickness: number,
  color = "#657972",
) {
  g.lineJoin = "round";
  g.lineCap = "round";
  shell(g, pts, null, "#3d534b", thickness + 2.2, false);
  shell(g, pts, null, color, thickness, false);
  shell(
    g,
    pts.map(([x, y]) => [x, y - thickness * 0.24] as [number, number]),
    null,
    "#a5b5aa",
    Math.max(0.8, thickness * 0.15),
    false,
  );
  g.lineCap = "butt";
}

function drawVehicle(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  z: number,
  truck = false,
) {
  const [px, py] = project(x, y, z);
  const s = truck ? 1.25 : 0.79;
  g.save();
  g.translate(px, py);
  g.scale(s, s);
  const body = truck ? ORANGE : "#9daca2";
  shell(
    g,
    [
      [-16, -2],
      [15, -2],
      [17, -6],
      [12, -12],
      [-2, -12],
      [-3, -8],
      [-16, -8],
    ],
    body,
    INK,
    0.9,
  );
  shell(
    g,
    [
      [-1, -8],
      [1, -11],
      [10, -11],
      [13, -8],
    ],
    "#c6d9d0",
    INK,
    0.6,
  );
  if (truck) {
    g.fillStyle = "#9d3921";
    g.fillRect(-16, -9, 12, 7);
    for (let i = 0; i < 4; i++) {
      drawLine(g, [-15 + i * 3, -8], [-15 + i * 3, -4], "#e38d62", 0.8);
    }
    g.fillStyle = "#f5b84f";
    g.fillRect(4, -14, 3, 2);
    shell(
      g,
      [
        [-31, -3],
        [-20, -3],
        [-20, -8],
        [-23, -11],
        [-30, -11],
      ],
      "#d47f4f",
      INK,
      0.75,
    );
    drawLine(g, [-20, -3], [-16, -3], INK, 1.2);
    drawCircle(g, -26, -2, 2.6, INK, null);
  }
  for (const a of [-10, 10]) {
    drawCircle(g, a, -2, 3.1, INK, null);
    drawCircle(g, a, -2, 1.4, "#e3dfc8", null);
  }
  g.restore();
}

function drawCallout(
  g: CanvasRenderingContext2D,
  anchor: [number, number],
  elbow: [number, number],
  end: [number, number],
  labelText: string,
  size: number,
  accent = INK,
  align: "left" | "right" = "left",
) {
  shell(g, [anchor, elbow, end], null, accent, 1.05, false);
  drawCircle(g, anchor[0], anchor[1], 2.4, PAPER, accent, 1.1);
  g.font = `600 ${size}px "DM Sans", Arial, sans-serif`;
  const w = g.measureText(labelText).width;
  g.fillStyle = "rgba(244,243,237,0.94)";
  g.fillRect(
    align === "left" ? end[0] + 2 : end[0] - w - 7,
    end[1] - size * 0.68,
    w + 6,
    size * 1.36,
  );
  g.textAlign = align;
  g.textBaseline = "middle";
  g.fillStyle = accent;
  g.fillText(labelText, end[0] + (align === "left" ? 5 : -5), end[1]);
}

export function AkaySectionCanvas({
  phaseRef,
  stationState,
  rainIntensity,
}: AkaySectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backdropRef = useRef<HTMLCanvasElement | null>(null);
  const soilRef = useRef<HTMLCanvasElement | null>(null);
  const simTweenRef = useRef({
    fixedCapacity: 180,
    inflow: 255,
    mobileUnits: 1,
    healthNum: 1, // 1 healthy, 0.5 clogged, 0 failed
  });
  const stateRef = useRef({ stationState, rainIntensity });
  stateRef.current = { stationState, rainIntensity };

  // Smooth GSAP tween whenever user changes DDI station health or storm intensity
  useEffect(() => {
    const fixedCapacity =
      stationState === "healthy" ? 180 : stationState === "clogged" ? 90 : 0;
    const inflow = Math.round(0.85 * rainIntensity * 10);
    const deficit = Math.max(0, inflow - fixedCapacity);
    const mobileUnits = Math.ceil(deficit / 100);
    const healthNum =
      stationState === "healthy" ? 1 : stationState === "clogged" ? 0.5 : 0;

    gsap.to(simTweenRef.current, {
      fixedCapacity,
      inflow,
      mobileUnits,
      healthNum,
      duration: 0.55,
      ease: "power3.out",
    });
  }, [stationState, rainIntensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Offscreen static backdrop (foothills + city buildings + trees)
    if (!backdropRef.current) {
      const b = document.createElement("canvas");
      b.width = 1800;
      b.height = 920;
      const g = b.getContext("2d");
      if (g) {
        g.scale(1.8, 1.8);
        for (let k = 0; k < 5; k++) {
          const pts: Array<[number, number]> = [];
          for (let x = 35; x < 975; x += 7) {
            pts.push([
              x,
              210 +
                k * 5 +
                Math.sin(x * 0.009 + k * 0.11) * 14 +
                Math.cos(x * 0.029) * 2,
            ]);
          }
          shell(g, pts, null, "#c0c8b8", 0.8, false);
        }
        const parcels = [
          [65, 149, 43, 24, 46],
          [130, 148, 48, 30, 68],
          [202, 150, 37, 21, 57],
          [260, 147, 49, 25, 43],
          [332, 150, 37, 24, 64],
          [403, 149, 51, 23, 51],
          [479, 149, 40, 27, 71],
          [554, 148, 44, 24, 47],
          [623, 151, 53, 25, 69],
          [698, 148, 35, 26, 51],
          [764, 149, 43, 23, 61],
          [827, 150, 28, 20, 43],
        ] as const;
        const walls = ["#d5d6c9", "#dbdcd1", "#c3cabc", "#dcd9cb"];
        parcels.forEach(([x, z, w, d, h], variant) => {
          const y = 94;
          drawPrism(
            g,
            x,
            y,
            z,
            w,
            h,
            d,
            walls[variant % 4],
            "#eae9df",
            "#b6bfb2",
            "#667668",
            0.85,
          );
          const floors = Math.floor(h / 13);
          const columns = Math.max(2, Math.floor(w / 12));
          for (let f = 0; f < floors; f++) {
            const fy = y + 4 + f * 12;
            for (let c = 0; c < columns; c++) {
              const left = x + 4 + (c * (w - 6)) / columns;
              drawShape3(
                g,
                [
                  [left, fy, z],
                  [left + 4.9, fy, z],
                  [left + 4.9, fy + 6.2, z],
                  [left, fy + 6.2, z],
                ],
                (f + c + variant) % 5 === 0 ? "#7e9286" : "#9aa89a",
                null,
              );
            }
          }
          drawPrism(
            g,
            x - 1,
            y + h,
            z - 1,
            w + 2,
            1.7,
            d + 2,
            "#b6bfaf",
            "#e8e8dc",
            "#b8c0b3",
            "#899785",
            0.55,
          );
        });
        for (let i = 0; i < 25; i++) {
          const [px, py] = project(
            80 + i * 31 + jitter(i) * 7,
            94,
            133 + jitter(i + 24) * 7,
          );
          const height = 14 + jitter(i + 4) * 10;
          drawLine(g, [px, py], [px, py - height * 0.7], "#697762", 1.7);
          for (let j = 0; j < 14; j++) {
            const angle = j * 2.4;
            const rad = Math.sqrt(j / 14) * height * 0.27;
            const r = height * (0.12 + jitter(i + 4 + j) * 0.09);
            drawCircle(
              g,
              px + Math.cos(angle) * rad,
              py - height * 0.7 + Math.sin(angle) * rad,
              r,
              ["#adb9a1", "#9fad96", "#bfc7b1", "#a2b098"][j % 4],
              null,
            );
          }
        }
      }
      backdropRef.current = b;
    }

    // Offscreen soil strata plate
    if (!soilRef.current) {
      const s = document.createElement("canvas");
      s.width = 1800;
      s.height = 1000;
      const g = s.getContext("2d");
      if (g) {
        g.scale(1.8, 1.8);
        for (let row = 0; row < 21; row++) {
          const pts: Array<[number, number]> = [];
          for (let x = X0 - 10; x < X1 + 10; x += 9) {
            const yy =
              99 -
              row * 12 +
              0.18 * elevation(x) +
              4 * Math.sin(x * 0.013 + row * 0.18) +
              2.3 * Math.sin(x * 0.028 - row * 0.12);
            pts.push(project(x, yy));
          }
          shell(
            g,
            pts,
            null,
            row % 4 === 0 ? "#a99777" : "#b5a788",
            row % 4 === 0 ? 1.3 : 0.65,
            false,
          );
        }
        for (let i = 0; i < 820; i++) {
          const x = X0 + jitter(i * 2) * (X1 - X0);
          const y = 272 + jitter(i * 2 + 1) * 220;
          drawLine(
            g,
            [x, y],
            [x + 1 + jitter(i + 5) * 2, y - 0.6],
            i % 3 === 0 ? "#a99d80" : "#daceb1",
            0.7,
          );
        }
      }
      soilRef.current = s;
    }

    let visible = true;
    let rafId = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animClock = 0;

    const drawFrame = () => {
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
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.setTransform(px / w, 0, 0, py / h, 0, 0);
          ctx.fillStyle = PAPER;
          ctx.fillRect(0, 0, w, h);

          if (!reduced.matches) animClock += 0.016;
          const phase = phaseRef.current; // 0 .. 4
          const reveal = range(phase, 0.14, 1.05);
          const sim = simTweenRef.current;
          const rainScale = sim.inflow / 255;
          const rainfall =
            range(phase, 0.92, 1.6) *
            clamp(rainScale, 0.65, 1.35) *
            (1 - 0.25 * range(phase, 3.4, 4));
          const mobilize = range(phase, 2.85, 3.6);
          const deficitRatio = clamp(
            Math.max(0, sim.inflow - sim.fixedCapacity) / 255,
          );
          const baseLevel = clamp(
            0.14 +
              0.52 * range(phase, 1.05, 2.45) +
              deficitRatio * 0.42 * range(phase, 1.6, 2.6) -
              0.42 * range(phase, 3.5, 4) * (sim.mobileUnits > 0 ? 1 : 0.2),
          );

          const scale = Math.min(w / 990, h / 560);
          const compact = w < 610 && h / w > 0.78;
          let labelSize = clamp(12.5 / scale, 13, 17);
          const closeup =
            range(phase, 1.85, 2.68) * (1 - range(phase, 2.95, 3.65));
          const zoom = 1 + 0.05 * reveal + 1.08 * closeup;

          ctx.save();
          if (compact) {
            const departure = range(phase, 2.95, 3.7);
            const cx = 464 + 72 * reveal + 58 * closeup + 112 * departure;
            const upper = 114 + 9 * reveal + 122 * closeup - 7 * departure;
            const lower = 405 + 78 * reveal + 4 * closeup;
            const viewWidth = 340 - 44 * closeup + 36 * departure;
            const mScale = Math.min(w / viewWidth, h / (lower - upper));
            const headroom = Math.max(0, h - (lower - upper) * mScale) * 0.22;
            ctx.translate(w / 2 - cx * mScale, headroom - upper * mScale);
            ctx.scale(mScale, mScale);
            labelSize = clamp(12 / mScale, 9.5, 17);
          } else {
            ctx.translate((w - 990 * scale) / 2, (h - 560 * scale) / 2);
            ctx.scale(scale, scale);
            ctx.translate(494, 278);
            ctx.scale(zoom, zoom);
            ctx.translate(
              -mix(494, 570, closeup),
              -mix(278, 349, closeup) + 14 * (1 - reveal),
            );
          }

          // Rear plateau + cached skyline
          drawShape3(
            ctx,
            [
              [X0, 94, 127],
              [X1, 94, 127],
              [X1, 94, WORLD_DEPTH],
              [X0, 94, WORLD_DEPTH],
            ],
            "#d7dcce",
            "#a0ac9b",
            0.5,
          );
          if (backdropRef.current) {
            ctx.drawImage(backdropRef.current, 0, 0, 1000, 920 / 1.8);
          }

          const topRear: Array<[number, number]> = [];
          const roadRear: Array<[number, number]> = [];
          for (let x = X0; x < X1; x += 7) {
            topRear.push(project(x, 94, 127));
            roadRear.push(groundPair(x, 110));
          }
          shell(
            ctx,
            topRear.concat(roadRear.reverse()),
            "#c3cabd",
            "#829183",
            0.8,
          );

          // Soil block
          const surfacePts: Array<[number, number]> = [];
          for (let x = X0; x < X1; x += 6) surfacePts.push(groundPair(x, 0));
          surfacePts.push(groundPair(X1, 0));
          const bottom = mix(-20, -138, reveal);
          const soilFace = surfacePts.concat([
            project(X1, bottom),
            project(X0, bottom),
          ]);
          shell(ctx, soilFace, EARTH, "#758276", 1);
          if (soilRef.current) {
            ctx.save();
            ctx.clip();
            ctx.drawImage(soilRef.current, 0, 0, 1000, 1000 / 1.8);
            ctx.restore();
          }
          drawShape3(
            ctx,
            [
              [X1, bottom, 0],
              [X1, bottom, WORLD_DEPTH],
              [X1, 94, WORLD_DEPTH],
              [X1, 94, 0],
            ],
            "#b4ad93",
            "#7a8677",
            0.9,
          );

          // Street surface
          const strip = (
            za: number,
            zb: number,
            fill: string,
            edge: string,
          ) => {
            const a: Array<[number, number]> = [];
            const b: Array<[number, number]> = [];
            for (let x = X0; x < X1; x += 7) {
              a.push(groundPair(x, za));
              b.push(groundPair(x, zb));
            }
            a.push(groundPair(X1, za));
            b.push(groundPair(X1, zb));
            shell(ctx, a.concat(b.reverse()), fill, edge, 0.9);
          };
          strip(0, WORLD_DEPTH, "#deded2", INK);
          strip(21, 94, "#a1aca6", "#566d62");
          for (let x = X0 + 4; x < X1 - 16; x += 26) {
            const hRoad = elevation(x);
            drawLine(
              ctx,
              project(x, hRoad + 0.8, 58),
              project(x + 12, elevation(x + 12) + 0.8, 58),
              "#f5f3d9",
              1.6,
            );
          }

          // ABB 10 / 20 / 35 cm threshold marks at underpass low point
          if (phase > 0.8) {
            const [lx, ly] = project(451, elevation(451) + 2, 18);
            drawLine(ctx, [lx, ly], [lx, ly - 18], INK, 1);
            drawLine(ctx, [lx - 3, ly - 5], [lx + 3, ly - 5], GREEN, 1.3);
            drawLine(ctx, [lx - 3, ly - 10], [lx + 3, ly - 10], AMBER, 1.3);
            drawLine(ctx, [lx - 4, ly - 16], [lx + 4, ly - 16], ORANGE, 1.5);
          }

          // Hydrology & surface runoff
          if (rainfall > 0.01) {
            ctx.save();
            ctx.globalAlpha = 0.56 * clamp(rainfall);
            for (let i = 0; i < 110; i++) {
              const x = 59 + jitter(i + 22) * 827;
              const z = 30 + jitter(i + 186) * 61;
              const pDrop = (animClock * 1.4 + jitter(i + 437)) % 1;
              const yDrop = elevation(x) + (1 - pDrop) * 120;
              drawLine(
                ctx,
                project(x, yDrop + 5, z),
                project(x - 1.8, yDrop, z),
                BLUE,
                0.85,
              );
            }
            ctx.globalAlpha = clamp(rainfall);
            for (let side = 0; side < 2; side++) {
              for (let k = 0; k < 4; k++) {
                const pts: Array<[number, number]> = [];
                const z = 27 + k * 17;
                const start = side === 0 ? 105 + k * 14 : 815 - k * 11;
                for (let j = 0; j <= 32; j++) {
                  const x = mix(start, 454, j / 32);
                  pts.push(project(x, elevation(x) + 1.8, z));
                }
                ctx.setLineDash([14, 8]);
                ctx.lineDashOffset = -animClock * 90;
                shell(ctx, pts, null, "#4298a2", 1.45, false);
                ctx.setLineDash([]);
              }
            }
            const spread = 34 + clamp(rainfall * 0.9) * 56;
            const poolPts: Array<[number, number]> = [];
            for (let a = 0; a <= 48; a++) {
              const r = (a / 48) * Math.PI * 2;
              const x = 451 + Math.cos(r) * spread;
              const z = 59 + Math.sin(r) * 32;
              poolPts.push(project(x, elevation(x) + 1.4, z));
            }
            ctx.globalAlpha = clamp(rainfall) * 0.48;
            shell(ctx, poolPts, "#7dbfc2", "#599ba4", 1.2);
            ctx.restore();
          }

          drawVehicle(ctx, 345, elevation(345), 55);
          drawVehicle(ctx, 531, elevation(531), 76);

          // Overpass bridge
          const bx = 424;
          const deck = 97;
          drawPrism(
            ctx,
            bx + 4,
            19,
            104,
            12,
            deck - 25,
            14,
            "#9aa79b",
            "#d1d7c8",
            "#9bab9e",
            "#596e61",
            0.9,
          );
          drawPrism(
            ctx,
            bx + 5,
            elevation(bx + 5),
            3,
            12,
            deck - 6 - elevation(bx + 5),
            12,
            "#bac3b6",
            "#d1d7c8",
            "#98a99b",
            "#677b6d",
            0.9,
          );
          drawPrism(
            ctx,
            bx,
            deck - 6,
            -1,
            51,
            6,
            WORLD_DEPTH + 1,
            "#afb9ac",
            "#d1d6c8",
            "#aab5a8",
            "#647766",
          );
          for (const xx of [bx + 2, bx + 49]) {
            for (let z = 0; z <= WORLD_DEPTH; z += 14) {
              drawLine(
                ctx,
                project(xx, deck, z),
                project(xx, deck + 5.7, z),
                "#637969",
                0.9,
              );
            }
            drawLine(
              ctx,
              project(xx, deck + 6, 0),
              project(xx, deck + 6, WORLD_DEPTH),
              "#637969",
              1.15,
            );
          }

          // Underground Sump Chamber & Wilo Rexa SOLID-Q DDI Pump
          const cutDepth = range(phase, 0.3, 1.05);
          if (cutDepth > 0.01) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(452, 335, 339, 142 * cutDepth);
            ctx.clip();

            const left = 549;
            const right = 704;
            const roof = 345;
            const base = 464;
            const wall: Array<[number, number]> = [
              [left, roof],
              [right, roof],
              [right, base],
              [left, base],
            ];
            shell(ctx, wall, "#e0e0d1", "#5d7164", 1.1);
            const room: Array<[number, number]> = [
              [left + 7, roof + 7],
              [right - 7, roof + 7],
              [right - 7, base - 6],
              [left + 7, base - 6],
            ];
            shell(ctx, room, "#829289", "#5e7568", 1);

            const waterline = mix(441, 366, baseLevel);
            ctx.save();
            shell(ctx, room, null, null);
            ctx.clip();
            ctx.fillStyle = WATER;
            ctx.globalAlpha = 0.76;
            ctx.fillRect(left, waterline, right - left, base - waterline);
            ctx.globalAlpha = 1;
            for (let l = 0; l < 4; l++) {
              const pts: Array<[number, number]> = [];
              for (let x = left; x <= right; x += 4) {
                pts.push([
                  x,
                  waterline +
                    1 +
                    l * 6 +
                    Math.sin(x * 0.09 + animClock * 4.5 + l) * 1.1,
                ]);
              }
              shell(
                ctx,
                pts,
                null,
                l === 0 ? "#e1faf2" : "#83b4af",
                l === 0 ? 1.6 : 0.6,
                false,
              );
            }
            ctx.restore();

            drawPipe(
              ctx,
              [
                [465, 353],
                [465, 368],
                [549, 388],
                [568, 388],
              ],
              5.5,
            );
            drawPipe(
              ctx,
              [
                [633, 420],
                [658, 420],
                [658, 361],
                [685, 361],
                [685, 339],
                [773, 339],
              ],
              7,
            );

            // Wilo Rexa pump body tinted by live health state
            const { stationState: st } = stateRef.current;
            const pumpColor =
              st === "healthy" ? GREEN : st === "clogged" ? AMBER : ORANGE;
            ctx.fillStyle = "#4d6055";
            ctx.fillRect(600, 445, 43, 5);
            shell(
              ctx,
              [
                [605, 444],
                [605, 420],
                [611, 416],
                [611, 404],
                [617, 396],
                [628, 396],
                [634, 404],
                [634, 416],
                [640, 420],
                [640, 444],
              ],
              pumpColor,
              INK,
              1.4,
            );
            drawCircle(ctx, 622, 414, 6, "#899b8e", INK, 1);
            drawCircle(
              ctx,
              622,
              414,
              2.5,
              st === "failed" ? "#ffbfa8" : "#c5f4dc",
              null,
            );

            if (rainfall > 0.1) {
              ctx.save();
              ctx.globalAlpha = clamp(rainfall);
              ctx.setLineDash([5, 9]);
              ctx.lineDashOffset = -animClock * 50;
              shell(
                ctx,
                [
                  [467, 359],
                  [467, 367],
                  [560, 388],
                ],
                null,
                "#8cd2d5",
                2.5,
                false,
              );
              ctx.restore();
            }
            ctx.restore();
          }

          // Upper-deck Mobile Wilo Padus PRO units (1, 2, or 3 trucks depending on capacity gap!)
          const neededCount = Math.max(0, Math.round(sim.mobileUnits));
          if (mobilize > 0 && neededCount > 0) {
            const parkPositions = [748, 795, 842];
            ctx.save();
            ctx.globalAlpha = range(phase, 2.85, 3.15);
            for (let u = 0; u < Math.min(3, neededCount); u++) {
              const targetX = parkPositions[u];
              const tx = mix(865, targetX, mobilize);
              drawVehicle(ctx, tx, elevation(tx) + 1, 43 + u * 16, true);
            }
            if (phase > 3.45) {
              const hose = range(phase, 3.45, 3.88);
              const linePath: Array<[number, number]> = [];
              for (let i = 0; i <= Math.round(36 * hose); i++) {
                const u = i / 36;
                const x = mix(730, 476, u);
                linePath.push(
                  project(x, elevation(x) + 1, 28 + Math.sin(u * 10) * 6),
                );
              }
              if (linePath.length > 1) {
                shell(ctx, linePath, null, "#793f2c", 3.2, false);
                shell(ctx, linePath, null, "#d2764a", 1.6, false);
              }
            }
            ctx.restore();
          }

          // Engineering callouts per beat
          const idx = Math.min(3, Math.floor(clamp(phase, 0, 3.99)));
          if (idx === 0) {
            drawCallout(
              ctx,
              project(451, 98, 107),
              [524, 148],
              [542, 148],
              "Üst geçit",
              labelSize,
            );
            if (phase > 0.45) {
              drawCallout(
                ctx,
                [618, 413],
                [581, 463],
                [548, 463],
                "Sabit pompa kuyusu",
                labelSize,
                GREEN,
                "right",
              );
            }
          } else if (idx === 1) {
            drawCallout(
              ctx,
              project(265, elevation(265) + 2, 40),
              [219, 399],
              [205, 399],
              `${Math.round(sim.inflow)} m³/sa yüzey akışı`,
              labelSize,
              GREEN,
              "right",
            );
            drawCallout(
              ctx,
              [644, mix(441, 366, baseLevel)],
              [702, 456],
              [716, 456],
              "Kuyu seviyesi",
              labelSize,
              GREEN,
            );
          } else if (idx === 2) {
            const annSize = compact ? labelSize : labelSize / Math.sqrt(zoom);
            const { stationState: st } = stateRef.current;
            const stText =
              st === "healthy"
                ? `${Math.round(sim.fixedCapacity)} m³/sa sabit`
                : st === "clogged"
                  ? "Tıkanma · 90 m³/sa"
                  : "Arızalı · 0 m³/sa";
            drawCallout(
              ctx,
              [620, 423],
              [593, 450],
              [575, 450],
              stText,
              annSize,
              st === "healthy" ? GREEN : ORANGE,
              "right",
            );
            drawCallout(
              ctx,
              project(480, elevation(480) + 2, 60),
              [522, 290],
              [546, 290],
              `${Math.round(sim.inflow)} m³/sa pik debi`,
              annSize,
              BLUE,
            );
          } else {
            drawCallout(
              ctx,
              project(mix(865, 748, mobilize), elevation(748) + 9, 43),
              compact ? [745, 214] : [787, 143],
              compact ? [730, 214] : [731, 143],
              `${Math.max(0, Math.round(sim.mobileUnits))}× Mobil Padus PRO`,
              labelSize,
              ORANGE,
              "right",
            );
            drawCallout(
              ctx,
              [623, 420],
              [580, 451],
              [565, 451],
              "Wilo Rexa DDI",
              compact ? labelSize : labelSize / Math.sqrt(zoom),
              GREEN,
              "right",
            );
          }

          ctx.restore();
        }
      }
      rafId = requestAnimationFrame(drawFrame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(drawFrame);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(canvas);
    rafId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [phaseRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Akay Alt Geçidi boylamasına mühendislik kesiti ve kuyu kapasite simülasyonu"
      className="block h-full w-full"
    />
  );
}
