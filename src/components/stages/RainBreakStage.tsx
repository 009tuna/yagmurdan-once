"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck } from "@phosphor-icons/react";
import { useStory } from "@/components/shell/StoryContext";
import { AtlasDispatchCanvas } from "./AtlasDispatchCanvas";

gsap.registerPlugin(ScrollTrigger);

export function RainBreakStage() {
  const { setSceneMeta } = useStory();
  const rainSectionRef = useRef<HTMLElement | null>(null);
  const wetOverlayRef = useRef<HTMLDivElement | null>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const rerouteSectionRef = useRef<HTMLElement | null>(null);
  const rerouteProgressRef = useRef<number>(0);

  useEffect(() => {
    const rainSec = rainSectionRef.current;
    if (!rainSec) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const drawRain = (t: number) => {
      const canvas = rainCanvasRef.current;
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 1 || h < 1) return;
      const dpr = Math.min(1.6, window.devicePixelRatio || 1);
      const px = Math.round(w * dpr);
      const py = Math.round(h * dpr);
      if (canvas.width !== px || canvas.height !== py) {
        canvas.width = px;
        canvas.height = py;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(px / w, 0, 0, py / h, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (reduced.matches) return;

      ctx.strokeStyle = "rgba(225, 235, 222, 0.45)";
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      for (let i = 0; i < 130; i++) {
        const x = (((i * 0.61803) % 1) * w + w * (1 - t) * 0.22) % (w + 10);
        const y =
          (((i * 0.41421) % 1) * h + h * t * (2 + (i % 3))) % (h + 20);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3.5, y + 7 + (i % 14));
      }
      ctx.stroke();
    };

    drawRain(0.3);

    const rainTrigger = ScrollTrigger.create({
      trigger: rainSec,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const t = Math.min(1, Math.max(0, self.progress));
        if (wetOverlayRef.current) {
          wetOverlayRef.current.style.opacity = String(
            reduced.matches ? 0.75 : t * t * (3 - 2 * t),
          );
        }
        drawRain(t);

        const rect = rainSec.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          setSceneMeta("rain", "17.00", "night");
        }
      },
    });

    return () => rainTrigger.kill();
  }, [setSceneMeta]);

  useEffect(() => {
    const sec = rerouteSectionRef.current;
    if (!sec) return;

    const trigger = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        rerouteProgressRef.current = Math.min(1, Math.max(0, self.progress));
        const rect = sec.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          setSceneMeta("reroute", "17.02", "paper");
        }
      },
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

  return (
    <>
      {/* 17.00 Full-bleed Atmospheric Rain Break */}
      <section
        ref={rainSectionRef}
        id="yagis"
        aria-label="17.00 Yağış Başlıyor"
        className="relative h-[calc(100svh-var(--head))] min-h-[360px] scroll-mt-[var(--head)] overflow-hidden bg-[#172d29] text-[#fffdf4]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-[50%_56%] brightness-[0.65] saturate-[0.68]"
          style={{ backgroundImage: "url('/media/film-start.webp')" }}
        />
        <div
          ref={wetOverlayRef}
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-[50%_56%] brightness-[0.72]"
          style={{
            backgroundImage: "url('/media/film-end.webp')",
            maskImage: "linear-gradient(transparent 36%, #000 78%)",
            WebkitMaskImage: "linear-gradient(transparent 36%, #000 78%)",
            opacity: 0,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,20,14,0.78) 0%, rgba(6,20,14,0.22) 72%, transparent 100%)",
          }}
        />
        <canvas
          ref={rainCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1680px] flex-col justify-end px-[var(--edge)] pb-10 md:pb-16 xl:pb-24">
          <span className="eyebrow-label text-[#eef1e5]/85">
            17.00 · Çankaya · Sağanak Başladı
          </span>
          <h2 className="font-display mt-3 text-[clamp(48px,min(8.5vw,13svh),144px)] font-normal italic leading-[0.88] tracking-[-0.055em] text-[#fffdf4]">
            İlk damlalar.
          </h2>
          <p className="mt-4 max-w-[42ch] text-[clamp(16px,1.4vw,22px)] text-[#eef1e5]/92">
            Dört ekip önceden yerinde. İki ekip tampon bölgede hazır bekliyor.
          </p>
        </div>

        <small className="eyebrow-label absolute bottom-4 right-[var(--edge)] z-10 text-[9px] text-[#eef1e5]/65">
          Temsili sahne
        </small>
      </section>

      {/* 17.02 Eastward Storm Drift & Live Buffer Reroute */}
      <section
        ref={rerouteSectionRef}
        id="donus"
        aria-label="17.02 Yağış Doğuya Kaydı"
        className="relative h-[160svh] scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
      >
        <div className="sticky top-0 h-[100svh] min-h-0 overflow-hidden">
          <div className="stage-pad mx-auto flex h-full w-full max-w-[1680px] flex-col px-[var(--edge)] pb-4 pt-[calc(var(--head)+14px)]">
            <div className="stage-head flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-2.5">
              <span className="eyebrow-label text-[var(--ink-muted)]">
                III <span className="opacity-45">/</span> Canlı Uyum · 17.02
                Doğu Koridoru
              </span>
              <span className="font-mono-num text-[11px] text-[var(--pine)]">
                Tampon Rezerv Sevki (P6 → N11)
              </span>
            </div>

            <div className="stage-grid grid min-h-0 flex-1 grid-cols-1 gap-4 pt-3 lg:grid-cols-[1.58fr_0.92fr] lg:items-center lg:gap-11">
              <figure className="stage-figure order-2 flex h-[36svh] min-h-[195px] flex-col lg:order-1 lg:h-[calc(100svh-var(--head)-80px)] lg:max-h-[660px]">
                <div className="min-h-0 flex-1 border border-[var(--hairline)] bg-[var(--paper)]">
                  <AtlasDispatchCanvas
                    mode="reroute"
                    progressRef={rerouteProgressRef}
                    roadworkBypass={false}
                    approved={true}
                  />
                </div>
                <figcaption className="mt-2 border-t border-[var(--hairline)] pt-2 font-mono-num text-[10px] tracking-wide text-[var(--ink-muted)]">
                  Doğu koridoru · Akay’daki P1 yerinde kalırken P6 tampon birimi
                  Küçükesat’a kaydırılır
                </figcaption>
              </figure>

              <div className="stage-copy order-1 flex flex-col justify-center lg:order-2">
                <span className="eyebrow-label inline-flex items-center gap-2 text-[var(--pine)]">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                    aria-hidden="true"
                  />
                  17.02 · RADAR GÜNCELLEMESİ
                </span>

                <h2 className="stage-h2 font-display mt-2.5 text-[clamp(30px,3.6vw,58px)] font-normal leading-[0.98] tracking-[-0.048em] text-[var(--ink)]">
                  Yağış doğuya döndü.
                </h2>

                <p className="stage-body mt-3 max-w-[44ch] text-[14px] leading-relaxed text-[var(--ink-muted)] sm:text-[15.5px]">
                  Akay’daki sabit pompa ve P1 tahliyeyi kesintisiz sürdürüyor.
                  Radar doğuya kaydığında, çalışan pompayı sökmek gerekmiyor:
                  merkezi tamponda bekleyen P6 ekibi 5 dakikalık mesafedeki
                  Küçükesat (N11) yönüne sevk ediliyor.
                </p>

                <div className="stage-sim mt-5 border border-[var(--hairline)] bg-[var(--paper-subtle)] p-4">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck
                      size={18}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-[var(--pine)]"
                    />
                    <div className="text-[12.5px] leading-relaxed text-[var(--ink)]">
                      <strong className="font-semibold">
                        Alo 153 / 112 Çift Sevk Önleme:
                      </strong>{" "}
                      Vatandaştan Akay veya Taurus için yeni ihbar düştüğünde,
                      nokta zaten kapsama altında olduğu için koordinatör
                      ekranı gereksiz ikinci ekip çıkışını otomatik engeller.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
