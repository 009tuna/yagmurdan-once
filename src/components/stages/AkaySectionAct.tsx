"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, WarningOctagon, Wrench } from "@phosphor-icons/react";
import type { SceneKey } from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";
import {
  AkaySectionCanvas,
  type FixedStationState,
} from "./AkaySectionCanvas";

gsap.registerPlugin(ScrollTrigger);

interface SectionBeat {
  key: SceneKey;
  clock: string;
  heading: string;
  body: string;
  caption: string;
}

const ACT2_BEATS: readonly SectionBeat[] = [
  {
    key: "ground",
    clock: "16.33",
    heading: "Akay’ın altına inelim.",
    body: "Yoldan geçen biri yalnızca köprüyü görür. Yolun çukurunda toplanan suyu yer altındaki bir kuyu karşılar. Sabit pompa istasyonu, yol henüz kuru görünürken bile karar motorunun parçasıdır.",
    caption: "Akay Alt Geçidi · temsili mühendislik kesiti ve 10/20/35 cm eşik ölçeği",
  },
  {
    key: "flow",
    clock: "16.34",
    heading: "Su nereden geliyor?",
    body: "Asfalt, çatılar, kaldırımlar… Rasyonel yöntemde (Q = C · i · A) 10.000 m² alana saatte 30 mm yağış düştüğünde ve akış katsayısı 0,85 alındığında tepe debisi saatte 255 m³ olur.",
    caption: "Yüzey akışı · Q = 0,85 × 0,03 m/sa × 10.000 m² = 255 m³/saat",
  },
  {
    key: "capacity",
    clock: "16.35",
    heading: "Çalışıyor. Yine de yetmiyor.",
    body: "Sabit istasyonun etkin kapasitesi 180 m³/saat ise 75 m³/saat açık kalır. İstasyon tıkanır veya arızalanırsa bu açık büyür; sistem aradaki farkı Wilo DDI sinyaliyle önceden hesaplar.",
    caption: "Wilo Rexa SOLID-Q DDI telemetrisi · giriş ve tahliye kapasite karşılaştırması",
  },
  {
    key: "support",
    clock: "16.36",
    heading: "İlk pompanın yeri belli.",
    body: "Saatte 100 m³ etkin kapasiteli bir mobil ünite (Wilo Padus PRO sınıfı) üst kotta pozisyon alır. Sabit pompa devre dışı kalırsa gereken mobil ünite sayısı anında birden üçe çıkar.",
    caption: "Üst kotta mobil destek · trafik kapanmadan hortum serimi ve güvenli deşarj",
  },
];

export function AkaySectionAct() {
  const { setSceneMeta } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);
  const phaseRef = useRef<number>(0);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeBeat, setActiveBeat] = useState<number>(0);
  const [stationState, setStationState] =
    useState<FixedStationState>("healthy");
  const [rainIntensity, setRainIntensity] = useState<20 | 30 | 40>(30);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = Math.min(1, Math.max(0, self.progress));
        const exact = p * ACT2_BEATS.length;
        phaseRef.current = exact;

        const idx = Math.min(ACT2_BEATS.length - 1, Math.floor(exact));
        setActiveBeat((prev) => (prev === idx ? prev : idx));

        barRefs.current.forEach((bar, i) => {
          if (!bar) return;
          const fill = Math.min(1, Math.max(0, exact - i));
          bar.style.transform = `scaleX(${fill})`;
        });

        const rect = section.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          const beat = ACT2_BEATS[idx];
          setSceneMeta(beat.key, beat.clock, "paper");
        }
      },
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

  const currentBeat = ACT2_BEATS[activeBeat];
  const fixedCapacity =
    stationState === "healthy" ? 180 : stationState === "clogged" ? 90 : 0;
  const inflow = Math.round(0.85 * rainIntensity * 10);
  const deficit = Math.max(0, inflow - fixedCapacity);
  const neededUnits = Math.ceil(deficit / 100);

  return (
    <section
      ref={sectionRef}
      id="kesit"
      aria-label="II / Yerin altı ve Akay DDI Simülasyonu"
      className="relative h-[375svh] scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
    >
      <div className="sticky top-0 h-[100svh] min-h-0 overflow-hidden">
        <div className="stage-pad mx-auto flex h-full w-full max-w-[1680px] flex-col px-[var(--edge)] pb-4 pt-[calc(var(--head)+14px)]">
          {/* Header bar */}
          <div className="stage-head flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-2.5">
            <span className="eyebrow-label text-[var(--ink-muted)]">
              II <span className="opacity-45">/</span> Yerin Altı · Akay
              Hidrolik İkizi
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {ACT2_BEATS.map((beat, i) => (
                <span
                  key={beat.key}
                  className="block h-[3px] w-7 bg-[#cfd5c9] sm:w-10"
                >
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="block h-full w-full origin-left bg-[var(--pine)] will-change-transform"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Reversed Asymmetric Split: Left Engineering Section Canvas, Right Editorial + Live DDI Controls */}
          <div className="stage-grid grid min-h-0 flex-1 grid-cols-1 gap-4 pt-3 lg:grid-cols-[1.58fr_0.92fr] lg:items-center lg:gap-11">
            {/* Cross-Section Plate */}
            <figure className="stage-figure order-2 flex h-[34svh] min-h-[190px] flex-col lg:order-1 lg:h-[calc(100svh-var(--head)-80px)] lg:max-h-[660px]">
              <div className="min-h-0 flex-1 border border-[var(--hairline)] bg-[var(--paper)]">
                <AkaySectionCanvas
                  phaseRef={phaseRef}
                  stationState={stationState}
                  rainIntensity={rainIntensity}
                />
              </div>
              <figcaption className="mt-1.5 border-t border-[var(--hairline)] pt-1.5 font-mono-num text-[10px] tracking-wide text-[var(--ink-muted)]">
                {currentBeat.caption}
              </figcaption>
            </figure>

            {/* Right Narrative + Inline Live DDI Simulation Deck (Strict Sans + Mono per Rule 1) */}
            <div className="stage-copy order-1 flex flex-col justify-center lg:order-2">
              <span className="eyebrow-label inline-flex items-center gap-2 text-[var(--pine)]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                  aria-hidden="true"
                />
                {currentBeat.clock} · N01 AKAY ALT GEÇİDİ
              </span>

              <h2 className="stage-h2 font-display mt-2 text-[clamp(28px,3.6vw,58px)] font-normal leading-[0.98] tracking-[-0.048em] text-[var(--ink)]">
                {currentBeat.heading}
              </h2>

              <p className="stage-body mt-2 max-w-[44ch] text-[13.5px] leading-relaxed text-[var(--ink-muted)] sm:text-[15.5px]">
                {currentBeat.body}
              </p>

              {/* Inline Technical SCADA Simulator (NO serif inside operational controls) */}
              <div
                aria-label="Sabit istasyon ve yağış kapasite simülatörü"
                className="stage-sim mt-3 border border-[var(--hairline)] bg-[var(--paper-subtle)] p-3 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline)] pb-2">
                  <span className="font-mono-num inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--pine)]">
                    <Cpu size={13} weight="bold" />
                    Wilo Rexa DDI · Canlı Kapasite Simülasyonu
                  </span>
                  <span className="font-mono-num text-[10px] text-[var(--ink-muted)]">
                    ModBus / OPC UA
                  </span>
                </div>

                {/* Station state selector */}
                <div className="mt-3">
                  <span className="block text-[11px] font-medium text-[var(--ink)]">
                    Sabit İstasyon Durumu
                  </span>
                  <div
                    role="group"
                    aria-label="Sabit pompa istasyonu durumu"
                    className="mt-1.5 grid grid-cols-3 gap-1.5"
                  >
                    <button
                      type="button"
                      data-ddi="healthy"
                      aria-pressed={stationState === "healthy"}
                      onClick={() => setStationState("healthy")}
                      className={`tactile-btn font-mono-num border px-2 py-1.5 text-[11px] font-medium ${
                        stationState === "healthy"
                          ? "border-[var(--pine)] bg-[var(--pine)] text-[#f4f3ed]"
                          : "border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--pine)]"
                      }`}
                    >
                      Sağlıklı · 180
                    </button>
                    <button
                      type="button"
                      data-ddi="clogged"
                      aria-pressed={stationState === "clogged"}
                      onClick={() => setStationState("clogged")}
                      className={`tactile-btn font-mono-num inline-flex items-center justify-center gap-1 border px-2 py-1.5 text-[11px] font-medium ${
                        stationState === "clogged"
                          ? "border-[#b56f1b] bg-[#b56f1b] text-[#f4f3ed]"
                          : "border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] hover:border-[#b56f1b]"
                      }`}
                    >
                      <Wrench size={12} />
                      <span>Tıkalı · 90</span>
                    </button>
                    <button
                      type="button"
                      data-ddi="failed"
                      aria-pressed={stationState === "failed"}
                      onClick={() => setStationState("failed")}
                      className={`tactile-btn font-mono-num inline-flex items-center justify-center gap-1 border px-2 py-1.5 text-[11px] font-medium ${
                        stationState === "failed"
                          ? "border-[var(--signal)] bg-[var(--signal)] text-[#f4f3ed]"
                          : "border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--signal)]"
                      }`}
                    >
                      <WarningOctagon size={12} />
                      <span>Arızalı · 0</span>
                    </button>
                  </div>
                </div>

                {/* Rain intensity selector */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-[var(--ink)]">
                    Yağış Şiddeti (i)
                  </span>
                  <div
                    role="group"
                    aria-label="Yağış şiddeti seçimi"
                    className="flex gap-1.5"
                  >
                    {([20, 30, 40] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={rainIntensity === val}
                        onClick={() => setRainIntensity(val)}
                        className={`tactile-btn font-mono-num border px-2.5 py-1 text-[11px] ${
                          rainIntensity === val
                            ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                            : "border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                        }`}
                      >
                        {val} mm/sa
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equation readout */}
                <div
                  aria-live="polite"
                  className="mt-3 flex items-baseline justify-between gap-3 border-t border-[var(--hairline)] pt-2.5"
                >
                  <div>
                    <span className="font-mono-num block text-[11px] text-[var(--ink-muted)]">
                      {inflow} − {fixedCapacity} ={" "}
                      <strong className="text-[var(--ink)]">
                        {deficit} m³/sa açık
                      </strong>
                    </span>
                    <span className="block text-[10px] text-[var(--ink-muted)]">
                      Her mobil Padus PRO: 100 m³/sa etkin kapasite
                    </span>
                  </div>
                  <div className="shrink-0 whitespace-nowrap text-right">
                    <span
                      id="akay-units"
                      className="font-mono-num text-[28px] font-semibold leading-none text-[var(--signal)]"
                    >
                      {neededUnits}
                    </span>
                    <span className="ml-1 font-mono-num text-[11px] font-medium text-[var(--ink)]">
                      mobil pompa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
