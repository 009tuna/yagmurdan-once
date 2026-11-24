"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "@phosphor-icons/react";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

export function HeroStage() {
  const { setSceneMeta, scrollToTarget } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const typeRef = useRef<HTMLDivElement | null>(null);
  const isobarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const progressRef = { value: 0 };

    const drawIsobars = (t: number) => {
      const canvas = isobarCanvasRef.current;
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

      // Faint barometric pressure contours drifting slowly over the horizon
      ctx.strokeStyle = "rgba(244, 243, 237, 0.14)";
      ctx.lineWidth = 0.85;
      const drift = reduced.matches ? 0 : t * 48;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const baseY = h * (0.14 + i * 0.058);
        for (let x = -20; x <= w + 20; x += 28) {
          const wave =
            Math.sin(x * 0.0045 + i * 0.65 - drift * 0.012) * (16 + i * 3) +
            Math.cos(x * 0.011 - i * 0.4) * 6;
          const y = baseY + wave;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    drawIsobars(0);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const rect = section.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          setSceneMeta("hero", "16.30", "hero");
        }

        const p = Math.min(1, Math.max(0, self.progress));
        progressRef.value = p;
        if (bgRef.current && !reduced.matches) {
          bgRef.current.style.transform = `scale(${1 + 0.055 * p})`;
        }
        if (typeRef.current && !reduced.matches) {
          const fade = Math.min(1, p * 1.45);
          typeRef.current.style.opacity = String(1 - 0.85 * fade);
          typeRef.current.style.transform = `translate3d(0, ${-28 * fade}px, 0)`;
        }
        drawIsobars(p);
      },
    });

    const onResize = () => drawIsobars(progressRef.value);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      trigger.kill();
    };
  }, [setSceneMeta]);

  return (
    <section
      ref={sectionRef}
      id="giris"
      aria-labelledby="hero-title"
      className="relative h-[158svh] min-h-[100dvh] bg-[var(--ink)]"
    >
      <div className="sticky top-0 h-[100svh] min-h-0 overflow-hidden bg-[#182924] text-[#fffdf4]">
        <div
          ref={bgRef}
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-[58%_55%] will-change-transform"
          style={{ backgroundImage: "url('/media/film-start.webp')" }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,27,22,0.82) 0%, rgba(11,27,22,0.42) 55%, rgba(11,27,22,0.12) 100%), linear-gradient(0deg, rgba(10,23,18,0.82) 0%, rgba(10,23,18,0.18) 46%, rgba(10,23,18,0.35) 100%)",
          }}
        />

        <canvas
          ref={isobarCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1680px] flex-col justify-between px-[var(--edge)] pb-[clamp(16px,3.2svh,32px)] pt-[calc(var(--head)+clamp(12px,3.2svh,36px))]">
          <div
            ref={typeRef}
            className="flex min-h-0 flex-1 max-w-[860px] flex-col justify-between gap-[clamp(14px,3svh,40px)] will-change-transform"
          >
            {/* Project title: clearly stated on the first screen */}
            <div className="border-l-2 border-[#ff8955] pl-[clamp(12px,1.4vw,20px)]">
              <span className="eyebrow-label block text-[#eef1e5]/80">
                Wilo × imece Water AI Hackathon 2026 · Proje
              </span>
              <h1
                id="hero-title"
                className="font-display mt-[clamp(4px,1svh,10px)] text-[clamp(38px,min(5.6vw,8.6svh),96px)] font-normal leading-[0.92] tracking-[-0.045em] text-[#fffdf4]"
              >
                Yağmurdan Önce
              </h1>
              <p className="mt-[clamp(4px,0.9svh,10px)] text-[clamp(17px,min(1.9vw,3svh),30px)] font-medium leading-tight tracking-[-0.02em] text-[#fffdf4]">
                Akıllı Mobil Pompa Konuşlandırma Sistemi
              </p>
              <p className="mt-[clamp(6px,1.2svh,12px)] max-w-[58ch] text-[clamp(13px,1.05vw,16px)] leading-[1.45] text-[#eef1e5]/85">
                Sağanak başlamadan riskli alt geçitleri öngören; sabit ve mobil
                pompaları birlikte yöneten yapay zekâ destekli karar sistemi.
              </p>
            </div>

            <div>
              <span className="eyebrow-label inline-flex items-center gap-2 text-[#eef1e5]/90">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#ff8955]"
                  aria-hidden="true"
                />
                <span>16.30</span>
                <span className="opacity-45">/</span>
                <span>Çankaya · MGM Turuncu Uyarı</span>
              </span>

              <p className="font-display mt-[clamp(6px,1.4svh,14px)] text-[clamp(36px,min(5vw,8svh),88px)] font-normal leading-[0.9] tracking-[-0.05em] text-[#fffdf4]">
                Henüz <em className="font-normal italic">yağmadı.</em>
              </p>

              <p className="mt-[clamp(8px,1.6svh,18px)] max-w-[46ch] text-[clamp(14px,1.2vw,19px)] leading-[1.45] text-[#eef1e5]/92">
                Yarım saat sonra sağanak bekleniyor.
                <br />
                On iki aday alt geçit, altı mobil pompa. İlk ekip nereye?
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-5 text-[#fff9e9]">
            <button
              type="button"
              onClick={() => scrollToTarget("#problem")}
              className="tactile-btn group inline-flex items-center gap-3 text-[13px] font-medium tracking-tight"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/60 transition-transform duration-200 group-hover:translate-y-0.5">
                <ArrowDown size={15} weight="bold" />
              </span>
              <span className="group-hover:underline group-hover:underline-offset-4">
                Hikâyeyi kaydır
              </span>
            </button>

            <div className="eyebrow-label text-right text-[10px] text-[#e3ebe4]/80">
              <span className="block">SABİT VE MOBİL POMPA</span>
              <span className="block opacity-75">KARAR DESTEK SUNUMU</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
