"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Lightning, ShieldCheck } from "@phosphor-icons/react";
import {
  DATA_LEVELS,
  FEATURE_GROUPS,
  LOW_DATA_PLAN_B,
  UNDERPASS_SITES,
  type DataLevel,
} from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

const XAI_SHOWCASE_SITES = [
  UNDERPASS_SITES[0], // N01 Akay %92
  UNDERPASS_SITES[4], // N02 Polis Evi %65
  UNDERPASS_SITES[9], // N06 Konutkent %35
];

export function ArchitectureSection() {
  const { setSceneMeta } = useStory();
  const dataSlideRef = useRef<HTMLElement | null>(null);
  const aiSlideRef = useRef<HTMLElement | null>(null);
  const [activeLevel, setActiveLevel] = useState<DataLevel["id"]>("seviye-1");
  const [selectedXaiIdx, setSelectedXaiIdx] = useState<number>(0);

  useEffect(() => {
    const t1 = dataSlideRef.current
      ? ScrollTrigger.create({
          trigger: dataSlideRef.current,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setSceneMeta("architecture", "MİMARİ", "paper"),
          onEnterBack: () => setSceneMeta("architecture", "MİMARİ", "paper"),
        })
      : null;

    const t2 = aiSlideRef.current
      ? ScrollTrigger.create({
          trigger: aiSlideRef.current,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setSceneMeta("architecture", "YAPAY ZEKÂ", "paper"),
          onEnterBack: () => setSceneMeta("architecture", "YAPAY ZEKÂ", "paper"),
        })
      : null;

    return () => {
      t1?.kill();
      t2?.kill();
    };
  }, [setSceneMeta]);

  const currentLevel =
    DATA_LEVELS.find((l) => l.id === activeLevel) ?? DATA_LEVELS[1];
  const currentXai = XAI_SHOWCASE_SITES[selectedXaiIdx];

  return (
    <>
      {/* Slide A: 3-Level Hardware-Agnostic Data Architecture + Plan B */}
      <section
        ref={dataSlideRef}
        id="mimari"
        aria-labelledby="arch-heading"
        className="deck-slide relative isolate overflow-hidden scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
      >
        <div className="mx-auto w-full max-w-[1680px]">
          <div className="grid grid-cols-1 gap-4 border-b border-[var(--hairline)] pb-3.5 xl:pb-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-8 xl:gap-10">
            <div>
              <span className="eyebrow-label text-[var(--pine)]">
                Teknik Çekirdek · Veri ve Donanım Uyumu
              </span>
              <h2
                id="arch-heading"
                className="font-display mt-1.5 text-[clamp(26px,min(3.2vw,4.8svh),50px)] font-normal leading-[0.98] tracking-[-0.045em] text-[var(--ink)]"
              >
                Yeni donanım beklemeden{" "}
                <em className="font-normal italic">açık veriyle</em> başlar.
              </h2>
            </div>
            <p className="max-w-[54ch] text-[12.5px] xl:text-[13.5px] leading-relaxed text-[var(--ink-muted)]">
              Sistem mevcut SCADA ve Wilo DDI (Ethernet, ModBus TCP, OPC UA)
              verisini doğrudan karara çevirir; telemetri olmayan kentlerde bile
              açık meteoroloji ve topoğrafya verisiyle ilk günden çalışır.
            </p>
          </div>

          <div className="mt-4 xl:mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.28fr_0.92fr] lg:items-stretch lg:gap-8 xl:gap-10">
            {/* Left: 3-Level Selector */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="eyebrow-label text-[var(--ink-muted)]">
                  3 Seviyeli Veri Yaklaşımı (s. 5)
                </span>
                <span className="font-mono-num text-[11px] text-[var(--pine)]">
                  10 veri kaleminin 7&apos;si açık kaynak
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Veri mimarisi seviyesi"
                className="mt-2.5 xl:mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3"
              >
                {DATA_LEVELS.map((lvl) => {
                  const selected = lvl.id === activeLevel;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveLevel(lvl.id)}
                      className={`tactile-btn border px-3 py-2 xl:py-2.5 text-left ${
                        selected
                          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                          : "border-[var(--hairline)] bg-[var(--paper-subtle)] text-[var(--ink)] hover:border-[var(--pine)]"
                      }`}
                    >
                      <span className="font-mono-num block text-[10px] uppercase tracking-wider opacity-75">
                        {lvl.badge}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] xl:text-[13px] font-medium tracking-tight">
                        {lvl.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 xl:mt-3 flex-1 border border-[var(--hairline)] bg-[var(--paper-subtle)] p-3.5 xl:p-4">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="eyebrow-label text-[10px] text-[var(--ink-muted)]">
                      Yeni Donanım
                    </dt>
                    <dd className="mt-0.5 text-[13px] xl:text-[13.5px] font-medium text-[var(--ink)]">
                      {currentLevel.newHardware}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="eyebrow-label text-[10px] text-[var(--ink-muted)]">
                      Kullanılan Veri ve Protokoller
                    </dt>
                    <dd className="mt-0.5 text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink)]">
                      {currentLevel.sources}
                    </dd>
                  </div>
                </dl>

                <div className="mt-2.5 xl:mt-3 border-t border-[var(--hairline)] pt-2.5 xl:pt-3">
                  <span className="eyebrow-label text-[10px] text-[var(--pine)]">
                    Sisteme Katkısı
                  </span>
                  <p className="mt-0.5 text-[13px] xl:text-[13.5px] font-medium text-[var(--ink)]">
                    {currentLevel.contribution}
                  </p>
                  <ul className="mt-1.5 xl:mt-2 space-y-1 text-[12px] xl:text-[12.5px] text-[var(--ink-muted)]">
                    {currentLevel.notes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <Check
                          size={13}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-[var(--pine)]"
                        />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: 4-Step Low-Data Plan B */}
            <div className="flex flex-col justify-between border border-[var(--hairline)] bg-[var(--paper)] p-3.5 sm:p-4 xl:p-5">
              <div>
                <span className="eyebrow-label text-[var(--signal)]">
                  Az Veri B Planı · Soğuk Başlangıç (s. 11)
                </span>
                <h3 className="mt-1 text-[16px] xl:text-[17px] font-medium tracking-tight text-[var(--ink)]">
                  Geçmiş kayıt sınırlıysa 4 adımlı kalibrasyon
                </h3>
                <p className="mt-1 text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink-muted)]">
                  Kayıtsız günlerin &ldquo;kesin kuru geçtiği&rdquo;
                  varsayılmaz; LightGBM + Pozitif-Etiketsiz (PU) öğrenme
                  yapısal benzerlikten olasılık üretir.
                </p>
                <ol className="mt-3 divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
                  {LOW_DATA_PLAN_B.map((step, i) => (
                    <li
                      key={step}
                      className="grid grid-cols-[26px_1fr] gap-2 py-2 xl:py-2.5 text-[12px] xl:text-[12.5px] leading-snug text-[var(--ink)]"
                    >
                      <span className="font-mono-num text-[11px] font-semibold text-[var(--pine)]">
                        0{i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide B: 16-Feature ML Matrix (2x2 Grid) + XAI Coordinator Decision Output */}
      <section
        ref={aiSlideRef}
        id="yapay-zeka"
        aria-labelledby="ai-heading"
        className="deck-slide relative isolate overflow-hidden scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
      >
        <div className="mx-auto w-full max-w-[1680px]">
          <div className="ai-head grid grid-cols-1 gap-4 border-b border-[var(--hairline)] pb-3.5 xl:pb-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-8 xl:gap-10">
            <div>
              <span className="eyebrow-label text-[var(--pine)]">
                Yapay Zekâ Katmanı · LightGBM + PU Öğrenme + Ensemble
              </span>
              <h2
                id="ai-heading"
                className="font-display mt-1.5 text-[clamp(26px,min(3.2vw,4.8svh),50px)] font-normal leading-[0.98] tracking-[-0.045em] text-[var(--ink)]"
              >
                On altı sinyal, tek{" "}
                <em className="font-normal italic">açıklanabilir</em> karar.
              </h2>
            </div>
            <p className="max-w-[54ch] text-[12.5px] xl:text-[13.5px] leading-relaxed text-[var(--ink-muted)]">
              Özelliklerin yarısından fazlası statik olduğundan yağış günü
              önceden hesaplanan kent haritası canlı saatlik meteoroloji ve Wilo
              DDI sinyalleriyle birleşerek iki dakikadan kısa sürede plan
              üretir.
            </p>
          </div>

          <div className="ai-body mt-4 xl:mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.28fr_0.92fr] lg:items-stretch lg:gap-8 xl:gap-10">
            {/* Left: 2x2 Compact Feature Grid */}
            <div className="grid grid-cols-1 gap-2.5 xl:gap-3 sm:grid-cols-2">
              {FEATURE_GROUPS.map((grp) => (
                <div
                  key={grp.group}
                  className="ai-card flex flex-col justify-between border border-[var(--hairline)] bg-[var(--paper-subtle)] p-3 xl:p-3.5"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2 border-b border-[var(--hairline)] pb-1.5">
                      <h3 className="text-[12.5px] xl:text-[13px] font-semibold tracking-tight text-[var(--ink)]">
                        {grp.group}
                      </h3>
                      <span className="font-mono-num shrink-0 text-[10px] text-[var(--pine)]">
                        {grp.refresh}
                      </span>
                    </div>
                    <ul className="mt-1.5 xl:mt-2 space-y-0.5 xl:space-y-1 text-[11.5px] xl:text-[12px] leading-snug text-[var(--ink)]">
                      {grp.features.map((f) => (
                        <li key={f}>· {f}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-2 border-t border-[var(--hairline)] pt-1.5 text-[10.5px] xl:text-[11px] leading-snug text-[var(--ink-muted)]">
                    Katkı: {grp.contribution}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Dark XAI Coordinator Card */}
            <div className="xai-card flex flex-col justify-between border border-[#28423b] bg-[var(--night)] p-4 xl:p-5 text-[var(--night-ink)]">
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-[var(--hairline-dark)] pb-2 xl:pb-2.5">
                  <span className="font-mono-num inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#b7dbc7]">
                    <ShieldCheck size={15} weight="bold" />
                    Açıklanabilir Karar Çıktısı (XAI)
                  </span>
                  <span className="font-mono-num text-[10px] text-[var(--night-muted)]">
                    p(i, t, s)
                  </span>
                </div>

                <p className="mt-2 xl:mt-2.5 text-[12px] xl:text-[12.5px] leading-snug text-[var(--night-muted)]">
                  Model tek tip{" "}
                  <span className="font-mono-num text-[#eef1e5]">
                    &ldquo;Yağış &gt; 20 mm/sa&rdquo;
                  </span>{" "}
                  kuralı yerine 16 değişkeni ve istasyon durumunu birlikte
                  tartarak koordinatöre gerekçeli yüzdeler sunar.
                </p>

                <div className="mt-2.5 xl:mt-3 flex flex-wrap gap-1.5">
                  {XAI_SHOWCASE_SITES.map((site, idx) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => setSelectedXaiIdx(idx)}
                      className={`tactile-btn font-mono-num border px-2.5 py-1 text-[11px] ${
                        selectedXaiIdx === idx
                          ? "border-[var(--signal)] bg-[var(--signal)] text-[#f4f3ed]"
                          : "border-[var(--hairline-dark)] bg-[#142c27] text-[var(--night-muted)] hover:text-[#eef1e5]"
                      }`}
                    >
                      {site.id} · %{site.riskPct}
                    </button>
                  ))}
                </div>

                <div className="mt-3 xl:mt-3.5 border-t border-[var(--hairline-dark)] pt-2.5 xl:pt-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="font-mono-num text-[10.5px] uppercase tracking-wider text-[var(--night-muted)]">
                        {currentXai.id} · {currentXai.assignment}
                      </span>
                      <h4 className="mt-0.5 text-[17px] xl:text-[18px] font-medium tracking-tight text-[#eef1e5]">
                        {currentXai.name}
                      </h4>
                    </div>
                    <span className="font-mono-num text-[26px] xl:text-[30px] font-semibold leading-none text-[#ff8955]">
                      %{currentXai.riskPct}
                    </span>
                  </div>

                  <ul className="mt-2.5 space-y-1 xl:space-y-1.5 text-[12px] xl:text-[12.5px] leading-snug text-[#dce5db]">
                    {currentXai.xaiDrivers.map((drv) => (
                      <li key={drv} className="flex items-start gap-2">
                        <Lightning
                          size={13}
                          weight="fill"
                          className="mt-0.5 shrink-0 text-[#ff8955]"
                        />
                        <span>{drv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 xl:mt-4 border-t border-[var(--hairline-dark)] pt-2 xl:pt-2.5 font-mono-num text-[10.5px] leading-snug text-[var(--night-muted)]">
                Basit kural: 12 nokta eşiği aşınca 6 pompayı sıralayamaz ·{" "}
                <span className="text-[#b7dbc7]">
                  Stokastik Optimizasyon (Rawls &amp; Turnquist, 2010): kısıtlı
                  filo ile en yüksek risk kapsaması.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
