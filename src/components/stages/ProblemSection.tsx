"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROBLEM_MATRIX } from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

type MethodTab = "reactive" | "fixedList" | "smartSystem";

const TAB_ITEMS: Array<{ id: MethodTab; label: string; tag: string }> = [
  { id: "reactive", label: "İhbar Odaklı", tag: "45 dk tepki" },
  { id: "fixedList", label: "Sabit Liste", tag: "Boşa bekleme" },
  { id: "smartSystem", label: "Yağmurdan Önce", tag: "Dinamik karar" },
];

export function ProblemSection() {
  const { setSceneMeta } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<MethodTab>("smartSystem");

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

  const activeIdx = TAB_ITEMS.findIndex((t) => t.id === activeTab);

  return (
    <section
      ref={sectionRef}
      id="problem"
      aria-labelledby="problem-heading"
      className="deck-slide relative isolate overflow-hidden scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
    >
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-6 lg:grid-cols-[0.88fr_1.35fr] lg:items-center lg:gap-10 xl:gap-14">
        {/* Left asymmetric thesis column */}
        <div>
          <span className="eyebrow-label text-[var(--pine)]">
            01 · Problem Tanımı ve Saha Ölçeği
          </span>
          <h2
            id="problem-heading"
            className="font-display mt-2 text-[clamp(26px,min(3.3vw,5svh),54px)] leading-[0.96] tracking-[-0.045em] text-[var(--ink)]"
          >
            Suyu sonradan{" "}
            <em className="font-normal italic">kovalamak</em> pahalıdır.
          </h2>
          <p className="mt-2.5 xl:mt-3 max-w-[44ch] text-[clamp(12.5px,1.65svh,15.5px)] leading-[1.48] text-[var(--ink-muted)]">
            Belediyelerin elinde pompa ve ekip bulunmasına rağmen karar üç
            noktada tıkanır: ihbar bekleyip yağış trafiğine takılmak, sabit
            listelerle kuru yerde beklemek ve yer altındaki sabit pompa
            sağlığını mobil sevkle eşleştirmemek.
          </p>

          {/* Hairline-separated real-world scale proof (no SaaS cards, tabular-nums) */}
          <dl className="mt-4 xl:mt-5 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            <div className="grid grid-cols-[112px_1fr] items-baseline gap-3 py-2 xl:py-2.5">
              <dt className="font-mono-num text-[clamp(17px,2.2svh,22px)] font-medium tracking-tight text-[var(--ink)]">
                2.518
              </dt>
              <dd className="text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink-muted)]">
                <strong className="font-medium text-[var(--ink)]">
                  İstanbul tek yağış ihbarı
                </strong>{" "}
                · 14–15 Ekim 2026 sağanağında 1.277 su baskını ve 8.564
                personel koordinasyonu (Nefes / Foreks, 2026).
              </dd>
            </div>
            <div className="grid grid-cols-[112px_1fr] items-baseline gap-3 py-2 xl:py-2.5">
              <dt className="font-mono-num text-[clamp(17px,2.2svh,22px)] font-medium tracking-tight text-[var(--signal)]">
                ~12 mr TL
              </dt>
              <dd className="text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink-muted)]">
                <strong className="font-medium text-[var(--ink)]">
                  Sel hasarı bilançosu
                </strong>{" "}
                · Ekim 2026 sellerinde 10.130 hasar ihbarı (Türkiye Sigorta
                Birliği / Gazete Oksijen).
              </dd>
            </div>
            <div className="grid grid-cols-[112px_1fr] items-baseline gap-3 py-2 xl:py-2.5">
              <dt className="font-mono-num text-[clamp(17px,2.2svh,22px)] font-medium tracking-tight text-[var(--pine)]">
                15 / 116
              </dt>
              <dd className="text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink-muted)]">
                <strong className="font-medium text-[var(--ink)]">
                  Ankara mevcut algılama ağı
                </strong>{" "}
                · 15 alt geçitte 116 sensör 10/20/35 cm&apos;de uyarı verir;
                sistemimiz 35 cm trafik durdurma eşiğinden önce sahaya iner.
              </dd>
            </div>
          </dl>
        </div>

        {/* Right interactive comparison ledger */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-2.5 xl:pb-3">
            <span className="eyebrow-label text-[var(--ink-muted)]">
              Müdahale Yaklaşımları Karşılaştırması
            </span>

            {/* Emil Kowalski duplicated-layer smooth tab control */}
            <div
              role="tablist"
              aria-label="Müdahale yöntemi vurgusu"
              className="relative grid grid-cols-3 border border-[var(--hairline)] bg-[var(--paper-subtle)] p-0.5"
            >
              {TAB_ITEMS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="tactile-btn relative z-0 px-2.5 py-1.5 text-center text-[11px] font-medium tracking-tight text-[var(--ink)] sm:px-3.5 sm:text-[12px]"
                >
                  {tab.label}
                </button>
              ))}
              <div
                aria-hidden="true"
                style={{
                  clipPath: `inset(0 ${(2 - activeIdx) * 33.333}% 0 ${activeIdx * 33.333}%)`,
                  transition: "clip-path 260ms var(--ease-out)",
                }}
                className="pointer-events-none absolute inset-0.5 z-10 grid grid-cols-3 bg-[var(--ink)] text-[var(--paper)]"
              >
                {TAB_ITEMS.map((tab) => (
                  <span
                    key={tab.id}
                    className="flex items-center justify-center px-2.5 py-1.5 text-[11px] font-medium tracking-tight sm:px-3.5 sm:text-[12px]"
                  >
                    {tab.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile single-column readout for narrow viewports (< 768px) */}
          <div className="mt-3 divide-y divide-[var(--hairline)] border-b border-[var(--hairline)] md:hidden">
            {PROBLEM_MATRIX.map((row) => (
              <div key={row.criterion} className="py-3">
                <span className="eyebrow-label text-[var(--pine)]">
                  {row.criterion}
                </span>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ink)]">
                  {row[activeTab]}
                </p>
              </div>
            ))}
          </div>

          {/* Full 3-column architectural matrix on md+ */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[136px_1fr_1fr_1fr] border-b border-[var(--ink)]/25 py-2 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)]">
              <span>Ölçüt</span>
              <span
                className={
                  activeTab === "reactive"
                    ? "text-[var(--signal)] font-semibold"
                    : ""
                }
              >
                İhbar Odaklı
              </span>
              <span
                className={
                  activeTab === "fixedList"
                    ? "text-[var(--ink)] font-semibold"
                    : ""
                }
              >
                Sabit Liste
              </span>
              <span
                className={
                  activeTab === "smartSystem"
                    ? "text-[var(--pine)] font-semibold"
                    : ""
                }
              >
                Önerilen Akıllı Sistem
              </span>
            </div>

            <div className="divide-y divide-[var(--hairline)] border-b border-[var(--hairline)]">
              {PROBLEM_MATRIX.map((row) => (
                <div
                  key={row.criterion}
                  className="grid grid-cols-[136px_1fr_1fr_1fr] gap-3.5 py-2 xl:py-2.5 text-[12px] xl:text-[12.5px] leading-snug"
                >
                  <div className="font-medium text-[var(--ink)]">
                    {row.criterion}
                  </div>
                  <div
                    className={`transition-opacity duration-200 ${
                      activeTab === "reactive"
                        ? "text-[var(--ink)] opacity-100 font-medium"
                        : "text-[var(--ink-muted)] opacity-55"
                    }`}
                  >
                    {row.reactive}
                  </div>
                  <div
                    className={`transition-opacity duration-200 ${
                      activeTab === "fixedList"
                        ? "text-[var(--ink)] opacity-100 font-medium"
                        : "text-[var(--ink-muted)] opacity-55"
                    }`}
                  >
                    {row.fixedList}
                  </div>
                  <div
                    className={`transition-opacity duration-200 ${
                      activeTab === "smartSystem"
                        ? "text-[var(--pine)] opacity-100 font-medium"
                        : "text-[var(--ink-muted)] opacity-60"
                    }`}
                  >
                    {row.smartSystem}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-2.5 xl:mt-3.5 text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink-muted)]">
            <strong className="font-medium text-[var(--ink)]">
              Tek cümlede proje:
            </strong>{" "}
            Yaklaşan yağışın yönüne, şiddetine ve mevcut sabit istasyonların
            sağlık/kapasite durumuna göre sınırlı mobil filoyu yağmurdan önce
            en doğru noktalara yerleştirip fırtına boyunca operatör onayıyla
            dinamik yöneten karar destek sistemi.
          </p>
        </div>
      </div>
    </section>
  );
}
