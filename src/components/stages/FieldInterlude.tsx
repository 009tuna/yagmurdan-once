"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

export function FieldInterlude() {
  const { setSceneMeta } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 45%",
      end: "bottom 42%",
      onEnter: () => setSceneMeta("field", "16.36", "paper"),
      onEnterBack: () => setSceneMeta("field", "16.36", "paper"),
    });

    const parallax = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (imgRef.current && !reduced.matches) {
          const shift = (self.progress - 0.5) * -28;
          imgRef.current.style.transform = `scale(1.07) translate3d(0, ${shift}px, 0)`;
        }
      },
    });

    return () => {
      trigger.kill();
      parallax.kill();
    };
  }, [setSceneMeta]);

  return (
    <aside
      ref={sectionRef}
      aria-label="Saha kurulum kısıtları"
      className="relative isolate overflow-hidden grid grid-cols-1 border-b border-[var(--hairline)] bg-[#dce3d8] lg:min-h-[calc(100svh-var(--head))] lg:grid-cols-[1.35fr_0.9fr]"
    >
      <div className="relative min-h-[40svh] overflow-hidden bg-[#182924] lg:min-h-full">
        <div
          ref={imgRef}
          role="img"
          aria-label="Saha görevlisi, mobil pompanın hortum bağlantısını sıkarken temsili yakın plan"
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: "url('/media/film-pump.webp')",
            transform: "scale(1.07)",
          }}
        />
      </div>

      <div className="flex flex-col justify-center px-[var(--edge)] py-6 lg:py-6 xl:py-10">
        <span className="eyebrow-label text-[var(--pine)]">
          16.36 · Hidrolik ve Trafik Kısıtları
        </span>
        <h2 className="font-display mt-2.5 text-[clamp(30px,min(3.8vw,5.6svh),62px)] font-normal leading-[0.98] tracking-[-0.048em] text-[var(--ink)]">
          Hortum <em className="font-normal italic">nereye</em> çıkıyor?
        </h2>
        <p className="mt-3 xl:mt-3.5 max-w-[42ch] text-[clamp(13px,1.7svh,16px)] leading-relaxed text-[var(--ink-muted)]">
          Yolun yanına gelebilmek işin yarısıdır. Ekip çektiği suyu aynı çukura
          geri döndürmeden güvenli deşarj noktasına basabilmelidir. Optimizasyon;
          kuru hız yerine yağışlı trafik hızını, kurulum süresini ve uygun
          deşarj hattını hesaba katar.
        </p>

        <dl className="mt-4 xl:mt-6 grid grid-cols-2 gap-4 border-t border-[#bcc6b7] pt-3 xl:pt-4 text-[12px]">
          <div>
            <dt className="eyebrow-label text-[10px] text-[var(--pine)]">
              Ekip Başına Güç
            </dt>
            <dd className="font-mono-num mt-1 font-medium text-[var(--ink)]">
              100 m³/saat etkin (Padus PRO)
            </dd>
          </div>
          <div>
            <dt className="eyebrow-label text-[10px] text-[var(--pine)]">
              Kurulum Penceresi
            </dt>
            <dd className="font-mono-num mt-1 font-medium text-[var(--ink)]">
              3–7 dk · Üst kot emniyeti
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
