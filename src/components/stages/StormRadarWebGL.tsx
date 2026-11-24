"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { PACKED_STORM_B64, STORM_GROUP_LENGTHS } from "@/data/storm-surface";
import { UNDERPASS_SITES, type UnderpassSite } from "@/data/dossier";
import { projectGrid } from "@/lib/atlas-geometry";

interface StormSurface {
  ink: Float32Array[];
  showers: Float32Array;
}

const TAU = Math.PI * 2;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (v: number) => {
  const n = clamp(v);
  return n * n * (3 - 2 * n);
};
const mix = (a: number, b: number, s: number) => a + (b - a) * s;

function decodeStormSurface(): StormSurface {
  const binary = atob(PACKED_STORM_B64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const values = new Int16Array(bytes.buffer);
  const samples = new Float32Array(values.length);
  for (let i = 0; i < values.length; i++) {
    samples[i] = values[i] / 27000;
  }
  let offset = 0;
  const ink = STORM_GROUP_LENGTHS.map((len) => {
    const sub = samples.subarray(offset, offset + len);
    offset += len;
    return sub;
  });
  return { ink, showers: samples.subarray(offset) };
}

function radarPoint(a: number, level: number): [number, number] {
  const bump =
    1 +
    0.105 * Math.sin(a * 3 + 0.4 + level * 1.65) +
    0.057 * Math.cos(a * 5 + level * 0.5) +
    0.027 * Math.sin(9 * a - 1 + level * 2);
  const radius = level * bump;
  const cc = Math.cos(a);
  const ss = Math.sin(a);
  return [
    cc * 0.87 * radius + 0.12 * ss * radius + 0.13 * (1 - level),
    ss * 0.44 * radius + 0.12 * Math.sin(2 * a + 0.9) * radius - 0.04 * (1 - level),
  ];
}

// Convert schematic atlas grid [0..1, 0..1] into centered 3D radar ground coordinates
function gridToWorld(grid: readonly [number, number]): [number, number] {
  const [u, v] = projectGrid(grid[0], grid[1]);
  return [(u - 0.52) * 1.85, (v - 0.48) * 1.15];
}

interface StormRadarWebGLProps {
  progressRef: React.MutableRefObject<number>;
  selectedSiteId: string;
  onSelectSite: (site: UnderpassSite) => void;
}

export function StormRadarWebGL({
  progressRef,
  selectedSiteId,
  onSelectSite,
}: StormRadarWebGLProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedIdRef = useRef(selectedSiteId);
  selectedIdRef.current = selectedSiteId;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const surface = decodeStormSurface();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Attempt WebGL context creation; fall back cleanly to 2D Canvas if unavailable
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      renderer = null;
    }

    let isVisible = true;
    let rafId = 0;
    const pointer = { targetX: 0, targetY: 0, curX: 0, curY: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (reduced.matches) return;
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      pointer.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const handlePointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    if (!renderer) {
      // Deterministic 2D Canvas Fallback so visuals never fail without WebGL
      const ctx = canvas.getContext("2d");
      const isolines = Array.from({ length: 24 }, (_, i) => {
        const ring: Array<[number, number]> = [];
        for (let k = 0; k <= 120; k++) {
          ring.push(radarPoint((k * TAU) / 120, 0.09 + i * 0.04));
        }
        return ring;
      });
      const shades = ["#7a8881", "#637770", "#38564b", "#183e32"];

      const render2D = () => {
        if (!ctx || !isVisible) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 1 && h > 1) {
          const dpr = Math.min(1.6, window.devicePixelRatio || 1);
          const px = Math.round(w * dpr);
          const py = Math.round(h * dpr);
          if (canvas.width !== px || canvas.height !== py) {
            canvas.width = px;
            canvas.height = py;
          }
          ctx.setTransform(px / w, 0, 0, py / h, 0, 0);
          ctx.fillStyle = "#f4f3ed";
          ctx.fillRect(0, 0, w, h);

          const p = progressRef.current;
          const beat0 = clamp(p * 3);
          const beat1 = clamp((p - 0.33) * 3);
          const orbit = ease(p / 0.52);
          const resolve = ease((p - 0.2) / 0.36);
          const scale = Math.min(w * 0.44, h * 0.68);
          const angle = mix(0.08, Math.PI / 2, orbit);
          const sn = Math.sin(angle);
          const cs = Math.cos(angle);
          const cx = w * 0.5;
          const cy = mix(h * 0.66, h * 0.5, orbit);

          if (resolve < 0.99) {
            const grain = Math.max(0.9, scale * 0.004);
            for (let s = 0; s < 4; s++) {
              ctx.fillStyle = shades[s];
              ctx.globalAlpha = (1 - resolve) * (0.55 + s * 0.12);
              const d = surface.ink[s];
              for (let i = 0; i < d.length; i += 3) {
                const x = d[i];
                const y = d[i + 1] * (1 - resolve * 0.65);
                const z = d[i + 2];
                ctx.fillRect(cx + x * scale, cy + (-y * cs + z * sn) * scale, grain, grain);
              }
            }
          }
          if (orbit > 0.05) {
            for (let i = isolines.length - 1; i >= 0; i--) {
              const line = isolines[i];
              const r = 0.09 + i * 0.04;
              const lift = (1 - r) * (0.65 - 0.15 * r);
              ctx.globalAlpha = (0.3 + resolve * 0.7) * orbit;
              ctx.strokeStyle = i < 4 ? "#be4528" : i < 12 ? "#236a52" : "#758b7d";
              ctx.lineWidth = i % 4 === 0 ? 1.4 : 0.75;
              ctx.beginPath();
              for (let j = 0; j < line.length; j++) {
                const x = cx + line[j][0] * scale;
                const y = cy + (-lift * cs + line[j][1] * sn) * scale;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;

          // Position HTML site pins in 2D mode
          const siteAlpha = clamp((p - 0.55) * 4);
          UNDERPASS_SITES.forEach((site) => {
            const btn = markerRefs.current[site.id];
            if (!btn) return;
            const [wx, wz] = gridToWorld(site.grid);
            const sx = cx + wx * scale * 0.86;
            const sy = cy + wz * scale * sn * 0.92;
            btn.style.opacity = String(siteAlpha * (beat0 >= 0 ? 1 : 0));
            btn.style.pointerEvents = siteAlpha > 0.35 ? "auto" : "none";
            btn.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`;
          });
          void beat1;
        }
        rafId = requestAnimationFrame(render2D);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
          if (isVisible) {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(render2D);
          } else {
            cancelAnimationFrame(rafId);
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(container);
      rafId = requestAnimationFrame(render2D);

      return () => {
        cancelAnimationFrame(rafId);
        observer.disconnect();
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
      };
    }

    // --- THREE.JS WEBGL 3D ENGINE ---
    renderer.setPixelRatio(Math.min(1.8, window.devicePixelRatio || 1));
    renderer.setClearColor(0xf4f3ed, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    const rig = new THREE.Group();
    scene.add(rig);

    // 1. Storm Anvil Particle Cloud (~16,800 particles from Int16 baked envelope)
    const totalPoints = surface.ink.reduce((acc, arr) => acc + arr.length / 3, 0);
    const positions = new Float32Array(totalPoints * 3);
    const shadesAttr = new Float32Array(totalPoints);
    const seedsAttr = new Float32Array(totalPoints);
    let ptr = 0;
    surface.ink.forEach((group, shadeIdx) => {
      for (let i = 0; i < group.length; i += 3) {
        positions[ptr * 3] = group[i];
        positions[ptr * 3 + 1] = group[i + 1];
        positions[ptr * 3 + 2] = group[i + 2];
        shadesAttr[ptr] = shadeIdx / 3;
        seedsAttr[ptr] = ((ptr * 0.6180339) % 1) * TAU;
        ptr++;
      }
    });

    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    cloudGeo.setAttribute("aShade", new THREE.BufferAttribute(shadesAttr, 1));
    cloudGeo.setAttribute("aSeed", new THREE.BufferAttribute(seedsAttr, 1));

    const cloudUniforms = {
      uTime: { value: 0 },
      uResolve: { value: 0 },
      uPointScale: { value: 3.4 },
    };

    const cloudMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: cloudUniforms,
      vertexShader: `
        attribute float aShade;
        attribute float aSeed;
        uniform float uTime;
        uniform float uResolve;
        uniform float uPointScale;
        varying float vShade;
        varying float vAlpha;
        void main() {
          vShade = aShade;
          vec3 pos = position;
          // Flatten cloud vertically into radar plane as resolve progresses
          pos.y = mix(pos.y, pos.y * 0.14, uResolve);
          pos.x += sin(uTime * 0.7 + aSeed) * 0.008 * (1.0 - uResolve);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = max(1.5, uPointScale * (0.85 + aShade * 0.42) * (2.6 / max(0.8, -mv.z)));
          vAlpha = (1.0 - uResolve * 0.94) * (0.54 + aShade * 0.14);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vShade;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = dot(uv, uv);
          if (d > 0.25) discard;
          float soft = smoothstep(0.25, 0.05, d);
          vec3 lightInk = vec3(0.478, 0.533, 0.506);
          vec3 deepPine = vec3(0.094, 0.243, 0.196);
          vec3 color = mix(lightInk, deepPine, vShade);
          gl_FragColor = vec4(color, vAlpha * soft);
        }
      `,
    });

    const cloudPoints = new THREE.Points(cloudGeo, cloudMat);
    rig.add(cloudPoints);

    // 2. Rain Curtains under the Cloud Base
    const showerCount = surface.showers.length / 5;
    const rainPos = new Float32Array(showerCount * 6);
    for (let i = 0; i < showerCount; i++) {
      const x = surface.showers[i * 5];
      const y = surface.showers[i * 5 + 1];
      const z = surface.showers[i * 5 + 2];
      const len = surface.showers[i * 5 + 3];
      rainPos[i * 6] = x;
      rainPos[i * 6 + 1] = y;
      rainPos[i * 6 + 2] = z;
      rainPos[i * 6 + 3] = x + len * 0.18;
      rainPos[i * 6 + 4] = Math.max(0, y - len);
      rainPos[i * 6 + 5] = z;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.LineBasicMaterial({
      color: 0x3b6154,
      transparent: true,
      opacity: 0.42,
    });
    const rainSegments = new THREE.LineSegments(rainGeo, rainMat);
    rig.add(rainSegments);

    // 3. Topographic Ground Graticule
    const gridLines: number[] = [];
    for (let n = -5; n <= 5; n++) {
      const x = n * 0.2;
      gridLines.push(x, 0, -0.62, x, 0, 0.62);
    }
    for (let n = -3; n <= 3; n++) {
      const z = n * 0.18;
      gridLines.push(-1.05, 0, z, 1.05, 0, z);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridLines, 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x6c8274,
      transparent: true,
      opacity: 0,
    });
    const gridMesh = new THREE.LineSegments(gridGeo, gridMat);
    rig.add(gridMesh);

    // 4. 27 Radar Reflectivity Isolines on Ground Plane
    const isolineGroup = new THREE.Group();
    const isolineMats: THREE.LineBasicMaterial[] = [];
    const isolineGeos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 27; i++) {
      const r = 0.09 + i * 0.038;
      const lift = (1 - r) * 0.11;
      const pts: number[] = [];
      for (let k = 0; k < 140; k++) {
        const [rx, rz] = radarPoint((k * TAU) / 140, r);
        pts.push(rx, lift, rz);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const color =
        i < 4 ? 0xbe4528 : i < 12 ? 0x236a52 : i % 4 === 0 ? 0x36614d : 0x82978b;
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
      });
      isolineGeos.push(geo);
      isolineMats.push(mat);
      isolineGroup.add(new THREE.LineLoop(geo, mat));
    }
    rig.add(isolineGroup);

    // 5. Three Open-Meteo Ensemble Storm Corridors (West, Central, East)
    const corridorGroup = new THREE.Group();
    const corridorMats: THREE.LineBasicMaterial[] = [];
    const corridorGeos: THREE.BufferGeometry[] = [];
    [-1, 0, 1].forEach((branch) => {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.34, 0.025, -0.05),
        new THREE.Vector3(-0.08, 0.03, branch * 0.16),
        new THREE.Vector3(0.26, 0.03, branch * 0.34),
        new THREE.Vector3(0.66, 0.025, branch * 0.36 + 0.05),
      );
      const pts = curve.getPoints(48);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: branch === 0 ? 0xbe4528 : 0x236a52,
        transparent: true,
        opacity: 0,
      });
      corridorGeos.push(geo);
      corridorMats.push(mat);
      corridorGroup.add(new THREE.Line(geo, mat));
    });
    rig.add(corridorGroup);

    // Resize sync
    const syncSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) return;
      renderer!.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      cloudUniforms.uPointScale.value = Math.min(4.2, Math.max(2.3, w / 250));
    };
    syncSize();
    const resizeObs = new ResizeObserver(syncSize);
    resizeObs.observe(container);

    const worldVec = new THREE.Vector3();
    const clock = new THREE.Clock();

    const tick = () => {
      if (!isVisible) return;
      const elapsed = reduced.matches ? 0 : clock.getElapsedTime();
      const p = progressRef.current;

      // Scroll-scrubbed phases across 3 beats:
      // 0.00-0.33 front (side view) -> 0.33-0.67 forecast (top-down + corridors) -> 0.67-1.00 sites (Akay zoom)
      const orbit = ease(p / 0.56);
      const resolve = ease((p - 0.14) / 0.38);
      const forecastVisible = ease((p - 0.31) / 0.18) * (1 - ease((p - 0.78) / 0.2));
      const siteAlpha = ease((p - 0.56) / 0.14);
      const akayBridge = ease((p - 0.85) / 0.15);

      cloudUniforms.uTime.value = elapsed;
      cloudUniforms.uResolve.value = resolve;

      rainMat.opacity = (1 - orbit) * 0.45;
      gridMat.opacity = orbit * 0.28;

      isolineMats.forEach((mat, i) => {
        const base = i % 4 === 0 ? 0.85 : 0.48;
        mat.opacity = orbit * (0.3 + resolve * 0.7) * base;
      });

      corridorMats.forEach((mat, idx) => {
        mat.opacity = forecastVisible * (idx === 1 ? 0.92 : 0.62);
      });

      // Spring-smoothed pointer parallax
      pointer.curX += (pointer.targetX - pointer.curX) * 0.075;
      pointer.curY += (pointer.targetY - pointer.curY) * 0.075;

      // Camera spherical orbit from low horizon elevation to radar plan & Akay dive
      const polar = mix(1.28, 0.14, orbit);
      const radius = mix(2.55, 2.25, orbit) - akayBridge * 0.65;
      const azimuth = pointer.curX * 0.08 + (reduced.matches ? 0 : Math.sin(elapsed * 0.25) * 0.03);
      const [akayX, akayZ] = gridToWorld(UNDERPASS_SITES[0].grid);

      const lookX = mix(0, akayX * 0.45, akayBridge);
      const lookY = mix(0.16, 0.0, orbit);
      const lookZ = mix(0, akayZ * 0.45, akayBridge);

      camera.position.set(
        lookX + Math.sin(azimuth) * Math.sin(polar) * radius,
        lookY + Math.cos(polar) * radius + pointer.curY * 0.06,
        lookZ + Math.cos(azimuth) * Math.sin(polar) * radius,
      );
      camera.lookAt(lookX, lookY, lookZ);

      // Gentle storm cell drift across Çankaya
      const cellShift = mix(-0.18, 0.04, ease(p / 0.7));
      cloudPoints.position.x = cellShift;
      rainSegments.position.x = cellShift;
      isolineGroup.position.x = cellShift * 0.45;

      renderer!.render(scene, camera);

      // Project 3D underpass markers cleanly into overlay button transforms
      const w = container.clientWidth;
      const h = container.clientHeight;
      UNDERPASS_SITES.forEach((site) => {
        const btn = markerRefs.current[site.id];
        if (!btn) return;
        const [wx, wz] = gridToWorld(site.grid);
        worldVec.set(wx, 0.025, wz).project(camera);
        const sx = (worldVec.x * 0.5 + 0.5) * w;
        const sy = (-worldVec.y * 0.5 + 0.5) * h;
        const inView =
          worldVec.z < 1 && sx > 16 && sx < w - 16 && sy > 16 && sy < h - 16;
        const isSelected = selectedIdRef.current === site.id;
        const alpha = inView ? siteAlpha : 0;
        btn.style.opacity = String(alpha);
        btn.style.pointerEvents = alpha > 0.35 ? "auto" : "none";
        btn.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(${
          isSelected ? 1.15 : 1
        })`;
      });

      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(container);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObs.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      cloudGeo.dispose();
      cloudMat.dispose();
      rainGeo.dispose();
      rainMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      isolineGeos.forEach((g) => g.dispose());
      isolineMats.forEach((m) => m.dispose());
      corridorGeos.forEach((g) => g.dispose());
      corridorMats.forEach((m) => m.dispose());
      renderer?.dispose();
    };
  }, [progressRef]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden border border-[var(--hairline)] bg-[var(--paper)]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full"
      />

      {/* Interactive 3D Projected Reticle Pins (only active during Beat 3: sites) */}
      <div className="pointer-events-none absolute inset-0">
        {UNDERPASS_SITES.map((site) => {
          const isDirect = site.tier === "direct";
          const isSelected = selectedSiteId === site.id;
          return (
            <button
              key={site.id}
              ref={(el) => {
                markerRefs.current[site.id] = el;
              }}
              type="button"
              onClick={() => onSelectSite(site)}
              aria-label={`${site.name} (%${site.riskPct} risk)`}
              style={{ opacity: 0, transition: "opacity 140ms ease" }}
              className="group absolute left-0 top-0 flex items-center gap-1.5 will-change-transform"
            >
              <span
                className={`relative grid place-items-center rounded-full border ${
                  isDirect
                    ? "h-3.5 w-3.5 border-[#f4f3ed] bg-[var(--signal)]"
                    : site.tier === "buffer"
                      ? "h-2.5 w-2.5 border-[#f4f3ed] bg-[var(--pine)]"
                      : "h-2 w-2 border-[var(--ink-muted)] bg-[var(--paper)]"
                }`}
              >
                {isSelected ? (
                  <span className="absolute -inset-1.5 rounded-full border border-[var(--signal)]" />
                ) : null}
              </span>
              {isDirect || isSelected ? (
                <span
                  className={`font-mono-num whitespace-nowrap border px-1.5 py-0.5 text-[10px] leading-none shadow-sm ${
                    isSelected
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-[var(--hairline)] bg-[var(--paper)]/92 text-[var(--ink)]"
                  }`}
                >
                  {site.id} · {site.shortName} %{site.riskPct}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Subtle corner orientation reticle */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 bg-[var(--paper)]/85 px-2 py-1 backdrop-blur-xs">
        <span className="eyebrow-label text-[10px] text-[var(--pine)]">
          WebGL 3B · Çankaya Radar Projeksiyonu
        </span>
      </div>
    </div>
  );
}
