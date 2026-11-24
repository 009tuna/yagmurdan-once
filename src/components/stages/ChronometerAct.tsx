"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UNDERPASS_SITES } from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

const PHASES = ["Tespit", "Karar", "Ulaşım", "Kurulum"] as const;
const PHASE_COLORS = ["#8fada4", "#e8ad8d", "#82bd9d", "#eceee0"] as const;
const TRACKS = [
  { name: "İhbar sonrası", stages: [5, 5, 25, 10], total: 45 },
  { name: "Ön yerleşim (4 pompa)", stages: [2, 0, 0, 3], total: 5 },
  { name: "Tampon ekip (2 pompa)", stages: [2, 1, 5, 7], total: 15 },
] as const;

const TAU = Math.PI * 2;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => {
  const n = clamp(v);
  return n * n * (3 - 2 * n);
};

export function ChronometerAct() {
  const { setSceneMeta } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef<number>(0);

  // Cost-loss ratio: how many times worse a missed flood is than a false alarm (PDF p. 13)
  const [costRatio, setCostRatio] = useState<number>(4);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const trigger = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = Math.min(1, Math.max(0, self.progress));
        const rect = sec.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          setSceneMeta("compare", "SONRASI", "night");
        }
      },
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

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
          c.fillStyle = "#10231f";
          c.fillRect(0, 0, w, h);

          const ink = "#edf1df";
          const muted = "#b9cbbc";
          const faint = "#354d43";
          const orange = "#be4528";
          const small = w < 500;
          const split = w >= 720 && w / h > 1.35;
          const pad = clamp(w * 0.055, 16, 40);
          const t = progressRef.current;
          const elapsed = 45 * smooth(0.14 + t * 0.92);

          const cap = Math.min(h * 0.94, 560);
          const inset = (h - cap) / 2;
          const headerY = inset + Math.max(18, cap * 0.07);

          const label = (
            val: string,
            x: number,
            y: number,
            size: number,
            color: string,
            weight = 400,
            mono = false,
            align: CanvasTextAlign = "left",
          ) => {
            c.fillStyle = color;
            c.textAlign = align;
            c.textBaseline = "middle";
            c.font = `${weight} ${size}px ${
              mono
                ? '"IBM Plex Mono", ui-monospace, monospace'
                : '"DM Sans", Arial, sans-serif'
            }`;
            c.fillText(val, x, y);
          };

          const drawLine = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            col: string,
            lw = 1,
          ) => {
            c.strokeStyle = col;
            c.lineWidth = lw;
            c.beginPath();
            c.moveTo(x1, y1);
            c.lineTo(x2, y2);
            c.stroke();
          };

          label("ÖRNEK SÜRE HESABI (s. 10)", pad, headerY, small ? 10 : 11, muted, 500, true);
          label("DAKİKA", w - pad, headerY, small ? 10 : 11, muted, 500, true, "right");
          drawLine(pad, headerY + 12, w - pad, headerY + 12, faint);

          let left = pad;
          const right = w - pad;
          const railWidth = split ? clamp(w * 0.27, 165, 260) : 0;

          if (split) {
            left += railWidth + pad * 0.45;
            const dialX = pad + railWidth * 0.47;
            const dialY = inset + cap * 0.45;
            const r = Math.min(railWidth * 0.4, cap * 0.26);
            const start = -Math.PI / 2;
            for (let m = 0; m < 60; m++) {
              const a = start + (m * TAU) / 60;
              const inner = r - (m % 5 === 0 ? 8 : 3);
              drawLine(
                dialX + inner * Math.cos(a),
                dialY + inner * Math.sin(a),
                dialX + r * Math.cos(a),
                dialY + r * Math.sin(a),
                m % 5 === 0 ? muted : faint,
                m % 5 === 0 ? 1.1 : 0.75,
              );
            }
            const end = start + (TAU * elapsed) / 60;
            c.beginPath();
            c.arc(dialX, dialY, r - 12, start, end);
            c.lineWidth = 2.6;
            c.strokeStyle = orange;
            c.stroke();
            drawLine(
              dialX,
              dialY,
              dialX + Math.cos(end) * (r - 20),
              dialY + Math.sin(end) * (r - 20),
              orange,
              1.6,
            );
            c.beginPath();
            c.arc(dialX, dialY, 3.6, 0, TAU);
            c.fillStyle = orange;
            c.fill();
            label("00", dialX, dialY - r + 23, 10, muted, 400, true, "center");
            label("15", dialX + r - 23, dialY, 10, muted, 400, true, "center");
            label("30", dialX, dialY + r - 21, 10, muted, 400, true, "center");
            label("45", dialX - r + 23, dialY, 10, muted, 400, true, "center");
            label(
              `${String(Math.floor(elapsed)).padStart(2, "0")}′`,
              dialX,
              dialY + r + Math.min(52, cap * 0.14),
              Math.min(48, cap * 0.12),
              ink,
              500,
              true,
              "center",
            );
          }

          const top = inset + cap * 0.25;
          const bottom = inset + cap * 0.78;
          const chartW = right - left;
          const axisY = top - Math.min(25, cap * 0.065);
          const ticks =
            chartW < 360 ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

          ticks.forEach((minute) => {
            const x = left + (chartW * minute) / 45;
            label(
              String(minute),
              x,
              axisY - 8,
              small ? 10 : 11,
              muted,
              400,
              true,
              minute === 0 ? "left" : minute === 45 ? "right" : "center",
            );
            drawLine(x, axisY, x, axisY + 4, muted, 0.8);
          });
          drawLine(left, axisY, right, axisY, faint, 0.8);

          const rowH = (bottom - top) / 3;
          TRACKS.forEach((row, index) => {
            const y = top + rowH * index;
            const rowTime = Math.min(row.total, elapsed);
            const bandH = clamp(rowH * 0.19, 6, 15);
            const barY = y + clamp(rowH * 0.24, 11, 19);

            label(row.name, left, y, clamp(rowH * 0.23, 12, 17), ink, 500);
            label(`${row.total} dk`, right, y, clamp(rowH * 0.25, 13, 19), ink, 500, true, "right");
            drawLine(left, barY + bandH * 0.5, right, barY + bandH * 0.5, faint, 0.8);

            let startMin = 0;
            row.stages.forEach((duration, phaseIdx) => {
              const shown = clamp(rowTime - startMin, 0, duration);
              if (shown > 0) {
                const x = left + (startMin / 45) * chartW;
                const width = (shown / 45) * chartW;
                c.fillStyle = PHASE_COLORS[phaseIdx];
                c.fillRect(x, barY, Math.max(1, width - 0.8), bandH);
                if (width > 32 && bandH >= 10 && shown >= duration) {
                  label(
                    String(duration),
                    x + width / 2,
                    barY + bandH * 0.5 + 0.5,
                    10,
                    "#142d24",
                    600,
                    true,
                    "center",
                  );
                }
              }
              startMin += duration;
            });

            const endX = left + (chartW * rowTime) / 45;
            const atEnd = elapsed >= row.total - 0.001;
            drawLine(endX, barY - 3, endX, barY + bandH + 3, atEnd ? ink : orange, 1.3);
            if (rowH > 38) {
              label(
                `${row.stages.join(" + ")} dk`,
                left,
                barY + bandH + clamp(rowH * 0.23, 12, 16),
                small ? 10 : 11,
                muted,
                400,
                true,
              );
            }
          });

          const legendsY = inset + cap * 0.91;
          drawLine(pad, legendsY - 16, right, legendsY - 16, faint, 0.8);
          const legW = right - pad;
          for (let i = 0; i < 4; i++) {
            const lx = pad + (i * legW) / 4;
            c.fillStyle = PHASE_COLORS[i];
            c.fillRect(lx, legendsY - 4, 7, 7);
            label(PHASES[i], lx + 12, legendsY, small ? 10 : 12, ink, 450);
          }
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
  }, []);

  // Taggart vd. (2022) threshold formula: C / (C + L) = 1 / (1 + costRatio)
  const thresholdPct = Math.round((1 / (1 + costRatio)) * 100);
  const activeCount = UNDERPASS_SITES.filter(
    (s) => s.riskPct >= thresholdPct,
  ).length;

  return (
    <section
      ref={sectionRef}
      id="sure"
      aria-label="IV / Zamanın Hesabı ve Yanlış Alarm Eşiği"
      className="relative h-[165svh] scroll-mt-[var(--head)] bg-[var(--night)] text-[var(--night-ink)]"
    >
      <div className="sticky top-0 h-[100svh] min-h-0 overflow-hidden">
        <div className="stage-pad mx-auto flex h-full w-full max-w-[1680px] flex-col px-[var(--edge)] pb-4 pt-[calc(var(--head)+14px)]">
          <div className="stage-head flex items-center justify-between gap-4 border-b border-[var(--hairline-dark)] pb-2.5">
            <span className="eyebrow-label text-[var(--night-muted)]">
              IV <span className="opacity-45">/</span> Zamanın Hesabı ve Yanlış
              Alarm Dengesi
            </span>
            <span className="font-mono-num text-[11px] text-[#b7dbc7]">
              Ağırlıklı Ortalama: 8,33 dk (Hedef ≥ %50 Azalma)
            </span>
          </div>

          <div className="stage-grid grid min-h-0 flex-1 grid-cols-1 gap-4 pt-3 lg:grid-cols-[0.88fr_1.62fr] lg:items-center lg:gap-11">
            {/* Left Copy + Interactive Cost-Loss Threshold Simulator */}
            <div className="stage-copy flex flex-col justify-center">
              <span className="eyebrow-label inline-flex items-center gap-2 text-[#b7dbc7]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                  aria-hidden="true"
                />
                OLAY SONRASI DEĞERLENDİRME
              </span>

              <h2 className="stage-h2 font-display mt-2.5 text-[clamp(30px,3.6vw,58px)] font-normal leading-[0.98] tracking-[-0.048em] text-[#eef1e5]">
                Dakikalar nerede kazanıldı?
              </h2>

              <p className="stage-body mt-2.5 max-w-[44ch] text-[14px] leading-relaxed text-[var(--night-muted)] sm:text-[15.5px]">
                İhbarı bekleyen ekip için 45 dakikanın 25’i yağışlı trafikte
                geçer. Doğrudan yerleşen dört ekip 5 dakikada, ara noktadan
                çıkan iki ekip 15 dakikada tahliyeye başlar.
              </p>

              {/* Taggart et al. (2022) Cost-Loss Ratio Control (Sans + Mono) */}
              <div className="stage-sim mt-4 border border-[var(--hairline-dark)] bg-[#142c27] p-4">
                <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline-dark)] pb-2">
                  <span className="font-mono-num text-[11px] font-medium uppercase tracking-wider text-[#b7dbc7]">
                    Yanlış Alarm Eşik Kuralı (s. 13)
                  </span>
                  <span className="font-mono-num text-[11px] text-[#ff8955]">
                    Eşik: %{thresholdPct}
                  </span>
                </div>

                <label
                  htmlFor="cost-ratio-slider"
                  className="mt-3 flex items-center justify-between text-[12px] text-[var(--night-ink)]"
                >
                  <span>Kaçırılan Baskın / Yanlış Alarm Bedeli</span>
                  <span className="font-mono-num font-semibold text-[#ff8955]">
                    {costRatio}× daha ağır
                  </span>
                </label>

                <input
                  id="cost-ratio-slider"
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={costRatio}
                  onChange={(e) => setCostRatio(Number(e.target.value))}
                  className="telemetry-slider mt-2.5 w-full"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono-num text-[11px] text-[var(--night-muted)]">
                  <span>Formül: 1 / (1 + {costRatio}) = %{thresholdPct}</span>
                  <span className="text-[#eef1e5]">
                    12 noktadan{" "}
                    <strong className="text-[#b7dbc7]">{activeCount}</strong>{" "}
                    tanesi aksiyon eşiğinde
                  </span>
                </div>
              </div>
            </div>

            {/* Right Chronometer Canvas */}
            <figure className="stage-figure flex h-[35svh] min-h-[195px] flex-col lg:h-[calc(100svh-var(--head)-80px)] lg:max-h-[660px]">
              <div className="min-h-0 flex-1 border border-[var(--hairline-dark)] bg-[#10231f]">
                <canvas
                  ref={canvasRef}
                  aria-label="Müdahale süreleri karşılaştırma kronometresi"
                  className="block h-full w-full"
                />
              </div>
              <figcaption className="mt-2 border-t border-[var(--hairline-dark)] pt-2 font-mono-num text-[10px] tracking-wide text-[var(--night-muted)]">
                Tahliyenin başlamasına kadar geçen süre · proje dosyası s. 10
                örnek varsayımları
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
