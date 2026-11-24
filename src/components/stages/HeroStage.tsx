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
          <div />

          <div
            ref={typeRef}
            className="max-w-[760px] will-change-transform"
          >
            <span className="eyebrow-label inline-flex items-center gap-2 text-[#eef1e5]/90">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[#ff8955]"
                aria-hidden="true"
              />
              <span>16.30</span>
              <span className="opacity-45">/</span>
              <span>Çankaya · MGM Turuncu Uyarı</span>
            </span>

            <h1
              id="hero-title"
              className="font-display mt-[clamp(10px,2svh,20px)] text-[clamp(52px,min(8.8vw,13.5svh),148px)] font-normal leading-[0.86] tracking-[-0.055em] text-[#fffdf4]"
            >
              Henüz
              <br />
              <em className="font-normal italic">yağmadı.</em>
            </h1>

            <p className="mt-[clamp(12px,2.2svh,24px)] max-w-[46ch] text-[clamp(15px,1.32vw,21px)] leading-[1.48] text-[#eef1e5]/92">
              Yarım saat sonra sağanak bekleniyor.
              <br />
              On iki aday alt geçit, altı mobil pompa. İlk ekip nereye?
            </p>
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
              <span className="block">WİLO × İMECE WATER AI HACKATHON 2026</span>
              <span className="block opacity-75">
                SABİT VE MOBİL POMPA KARAR DESTEK SUNUMU
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
