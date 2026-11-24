"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

const ROOT_CAUSES = [
  {
    code: "01",
    title: "Geç kalan ihbar refleksi",
    body: "Ekipler çoğu zaman vatandaş \u201cyol su altında\u201d dediğinde yola çıkar; o sırada trafik kilitlenmiş olduğu için pompa olay yerine geç ulaşır.",
  },
  {
    code: "02",
    title: "Ezbere sabit nokta listesi",
    body: "Hazırlık yapılan kentlerde bile karar, her yağışta aynı kalan listeye dayanır. Yağış başka bölgeyi vurduğunda ekipler kuru noktada bekler, beklenmedik alt geçit korumasız kalır.",
  },
  {
    code: "03",
    title: "Sabit altyapıdan kopuk karar",
    body: "Alt geçitlerdeki sabit pompa istasyonunun tıkalı olup olmadığı ya da o günkü yağışa yetip yetmeyeceği, mobil pompa sevk kararına girmez.",
  },
] as const;

export function ProblemSection() {
  const { setSceneMeta } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 42%",
      end: "bottom 42%",
      onEnter: () => setSceneMeta("problem", "BAĞLAM", "paper"),
      onEnterBack: () => setSceneMeta("problem", "BAĞLAM", "paper"),
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

  return (
    <section
      ref={sectionRef}
      id="problem"
      aria-labelledby="problem-heading"
      className="deck-slide relative isolate overflow-hidden scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
    >
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-center lg:gap-12 xl:gap-16">
        {/* Left: problem statement and root causes */}
        <div>
          <span className="eyebrow-label text-[var(--pine)]">
            01 · Problem Tanımı
          </span>
          <h2
            id="problem-heading"
            className="font-display mt-2 max-w-[22ch] text-[clamp(26px,min(3.2vw,5svh),52px)] leading-[0.98] tracking-[-0.045em] text-[var(--ink)]"
          >
            Sorun pompa eksikliği değil;{" "}
            <em className="font-normal italic">
              pompanın yağmurdan önce doğru yerde olmaması.
            </em>
          </h2>
          <p className="mt-3 max-w-[60ch] text-[clamp(12.5px,1.7svh,15.5px)] leading-[1.5] text-[var(--ink-muted)]">
            Ani ve yoğun sağanaklarda su baskınları hep benzer zayıf noktalarda
            yaşanır: alt geçitler, çukurda kalan caddeler ve bodrum katlar.
            Belediyelerin elinde mobil pompa ve ekip vardır, ama sayıları
            sınırlıdır ve bugün nereye gönderilecekleri yağıştan sonra belirlenir.
          </p>

          {/* The precise problem question */}
          <div className="mt-4 border-l-2 border-[var(--signal)] bg-[var(--paper-subtle)] py-2.5 pl-4 pr-3 xl:mt-5">
            <span className="eyebrow-label block text-[10px] text-[var(--signal)]">
              Çözmeye çalıştığımız soru
            </span>
            <p className="mt-1 text-[clamp(13.5px,1.9svh,17px)] font-medium leading-snug text-[var(--ink)]">
              Sınırlı sayıdaki mobil pompayı, yağmur başlamadan hangi alt
              geçitlere ve hangi kapasiteyle yerleştirmeliyiz?
            </p>
          </div>

          <ol className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--hairline)] pt-3 md:grid-cols-3 xl:mt-5 xl:gap-5">
            {ROOT_CAUSES.map((c) => (
              <li key={c.code}>
                <span className="font-mono-num text-[11px] font-semibold text-[var(--signal)]">
                  {c.code}
                </span>
                <strong className="mt-0.5 block text-[13px] font-semibold leading-snug text-[var(--ink)] xl:text-[13.5px]">
                  {c.title}
                </strong>
                <p className="mt-1 text-[12px] leading-snug text-[var(--ink-muted)] xl:text-[12.5px]">
                  {c.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: real-world scale proof */}
        <div>
          <span className="eyebrow-label text-[var(--ink-muted)]">
            Sahadaki ölçek
          </span>
          <dl className="mt-2 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            <div className="py-3 xl:py-4">
              <dt className="font-mono-num text-[clamp(24px,3.4svh,36px)] font-medium tracking-tight text-[var(--ink)]">
                2.518
              </dt>
              <dd className="mt-1 text-[12px] leading-snug text-[var(--ink-muted)] xl:text-[12.5px]">
                <strong className="font-medium text-[var(--ink)]">
                  İstanbul, tek sağanakta ihbar
                </strong>{" "}
                · 14–15 Ekim 2026 sağanağında 1.277 su baskını ve 8.564
                personel koordinasyonu (Nefes / Foreks, 2026).
              </dd>
            </div>
            <div className="py-3 xl:py-4">
              <dt className="font-mono-num text-[clamp(24px,3.4svh,36px)] font-medium tracking-tight text-[var(--signal)]">
                ~12 mr TL
              </dt>
              <dd className="mt-1 text-[12px] leading-snug text-[var(--ink-muted)] xl:text-[12.5px]">
                <strong className="font-medium text-[var(--ink)]">
                  Sel hasarı bilançosu
                </strong>{" "}
                · Ekim 2026 sellerinde 10.130 hasar ihbarı (Türkiye Sigorta
                Birliği / Gazete Oksijen).
              </dd>
            </div>
            <div className="py-3 xl:py-4">
              <dt className="font-mono-num text-[clamp(24px,3.4svh,36px)] font-medium tracking-tight text-[var(--pine)]">
                15 / 116
              </dt>
              <dd className="mt-1 text-[12px] leading-snug text-[var(--ink-muted)] xl:text-[12.5px]">
                <strong className="font-medium text-[var(--ink)]">
                  Ankara&apos;nın mevcut algılama ağı
                </strong>{" "}
                · 15 alt geçitte 116 sensör 10/20/35 cm&apos;de uyarı verir;
                ancak bu uyarı su birikmeye başladıktan sonra gelir.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
