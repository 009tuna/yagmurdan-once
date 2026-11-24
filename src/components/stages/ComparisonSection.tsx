"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROBLEM_MATRIX } from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

type MethodTab = "reactive" | "fixedList" | "smartSystem";

const TAB_ITEMS: Array<{ id: MethodTab; label: string }> = [
  { id: "reactive", label: "İhbar Odaklı" },
  { id: "fixedList", label: "Sabit Liste" },
  { id: "smartSystem", label: "Yağmurdan Önce" },
];

const SUMMARY_PILLARS = [
  { k: "Öngör", v: "Yağışın yönü ve şiddetine göre her alt geçidin su basma olasılığı" },
  { k: "Eşleştir", v: "Sabit pompa sağlığı ve kapasite açığıyla mobil destek ihtiyacı" },
  { k: "Yerleştir", v: "Riskli noktalara doğrudan, belirsiz bölgelere tampon ekip" },
  { k: "Uyarla", v: "Yağış sırasında koordinatör onayıyla yeniden yönlendirme" },
] as const;

export function ComparisonSection() {
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
      onEnter: () => setSceneMeta("problem", "ÇÖZÜM", "paper"),
      onEnterBack: () => setSceneMeta("problem", "ÇÖZÜM", "paper"),
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

  const activeIdx = TAB_ITEMS.findIndex((t) => t.id === activeTab);

  return (
    <section
      ref={sectionRef}
      id="karsilastirma"
      aria-labelledby="comparison-heading"
      className="deck-slide relative isolate overflow-hidden scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
    >
      <div className="mx-auto w-full max-w-[1680px]">
        {/* Core project summary — foregrounded */}
        <div className="bg-[var(--ink)] px-[clamp(16px,2.4vw,40px)] py-[clamp(16px,3svh,36px)] text-[var(--paper)]">
          <span className="eyebrow-label text-[#ffb08a]">
            02 · Proje Özeti · Tek cümlede Yağmurdan Önce
          </span>
          <p
            id="comparison-heading"
            className="font-display mt-2 max-w-[48ch] text-[clamp(20px,min(2.3vw,3.7svh),38px)] font-normal leading-[1.14] tracking-[-0.03em]"
          >
            Yaklaşan yağışın yönüne, şiddetine ve sabit istasyonların
            sağlık/kapasite durumuna göre sınırlı mobil pompa filosunu{" "}
            <em className="italic text-[#ffb08a]">yağmurdan önce</em> en doğru
            noktalara yerleştiren ve fırtına boyunca operatör onayıyla yöneten
            karar destek sistemi.
          </p>

          <dl className="mt-[clamp(12px,2.4svh,24px)] grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/20 pt-[clamp(10px,1.8svh,18px)] lg:grid-cols-4">
            {SUMMARY_PILLARS.map((p, i) => (
              <div key={p.k}>
                <dt className="flex items-baseline gap-2 text-[13px] font-semibold tracking-tight xl:text-[14px]">
                  <span className="font-mono-num text-[11px] text-[#ffb08a]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.k}
                </dt>
                <dd className="mt-0.5 text-[11.5px] leading-snug text-[#e3ebe4]/85 xl:text-[12.5px]">
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Comparison ledger */}
        <div className="mt-[clamp(14px,2.6svh,30px)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-2.5 xl:pb-3">
            <div>
              <span className="eyebrow-label text-[var(--pine)]">
                Mevcut yöntemlerden farkı
              </span>
              <h2 className="font-display mt-1 text-[clamp(20px,min(2.2vw,3.4svh),32px)] leading-tight tracking-[-0.035em] text-[var(--ink)]">
                Müdahale yaklaşımları karşılaştırması
              </h2>
            </div>

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

          {/* Mobile single-column readout */}
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

          {/* Full matrix on md+ */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[170px_1fr_1fr_1fr] gap-4 border-b border-[var(--ink)]/25 py-2 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)]">
              <span>Ölçüt</span>
              <span className={activeTab === "reactive" ? "font-semibold text-[var(--signal)]" : ""}>
                İhbar Odaklı
              </span>
              <span className={activeTab === "fixedList" ? "font-semibold text-[var(--ink)]" : ""}>
                Sabit Liste
              </span>
              <span className={activeTab === "smartSystem" ? "font-semibold text-[var(--pine)]" : ""}>
                Yağmurdan Önce (önerilen)
              </span>
            </div>

            <div className="divide-y divide-[var(--hairline)] border-b border-[var(--hairline)]">
              {PROBLEM_MATRIX.map((row) => (
                <div
                  key={row.criterion}
                  className="grid grid-cols-[170px_1fr_1fr_1fr] gap-4 py-2 text-[12px] leading-snug xl:py-2.5 xl:text-[13px]"
                >
                  <div className="font-medium text-[var(--ink)]">{row.criterion}</div>
                  <div
                    className={`transition-opacity duration-200 ${
                      activeTab === "reactive"
                        ? "font-medium text-[var(--ink)] opacity-100"
                        : "text-[var(--ink-muted)] opacity-55"
                    }`}
                  >
                    {row.reactive}
                  </div>
                  <div
                    className={`transition-opacity duration-200 ${
                      activeTab === "fixedList"
                        ? "font-medium text-[var(--ink)] opacity-100"
                        : "text-[var(--ink-muted)] opacity-55"
                    }`}
                  >
                    {row.fixedList}
                  </div>
                  <div
                    className={`transition-opacity duration-200 ${
                      activeTab === "smartSystem"
                        ? "font-medium text-[var(--pine)] opacity-100"
                        : "text-[var(--ink-muted)] opacity-60"
                    }`}
                  >
                    {row.smartSystem}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
