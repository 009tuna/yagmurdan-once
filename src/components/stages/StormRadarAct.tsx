"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  UNDERPASS_SITES,
  type SceneKey,
  type UnderpassSite,
} from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";
import { StormRadarWebGL } from "./StormRadarWebGL";

gsap.registerPlugin(ScrollTrigger);

interface BeatSpec {
  key: SceneKey;
  clock: string;
  heading: string;
  body: string;
  caption: string;
}

const ACT1_BEATS: readonly BeatSpec[] = [
  {
    key: "front",
    clock: "16.30",
    heading: "Bir uyarı geldi.",
    body: "Çankaya’da yollar açık. Yarım saat sonra kuvvetli yağış bekleniyor. Nöbetçi koordinatör, ilk ihbar gelmeden altı mobil pompayı hazırlayabilir. Peki hangi yöne?",
    caption: "Yağış hücresi · yandan görünüşten radar izine dönüşüm (WebGL 3B)",
  },
  {
    key: "forecast",
    clock: "16.30",
    heading: "Bulutun birkaç yolu var.",
    body: "Open-Meteo Ensemble tahminleri aynı yağış hücresini biraz farklı koridorlardan geçiriyor. Altı ekibin hepsini tek olasılığa kilitlemek riskli bir karardır.",
    caption: "Olası yağış koridorları · batı, merkez ve doğu ensemble kolları",
  },
  {
    key: "sites",
    clock: "16.33",
    heading: "Hangi yol önce su alır?",
    body: "Yağış izi kentin eğimi, geçirimsiz yüzeyleri ve sabit istasyon durumuyla çakışıyor. On iki aday alt geçitten dördü doğrudan destek için öne çıkıyor. En kritik noktaya inelim: Akay.",
    caption: "12 aday ulaşım noktası · sentetik olasılık sıralaması (%92 — %18)",
  },
];

export function StormRadarAct() {
  const { setSceneMeta, scrollToTarget } = useStory();
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<number>(0);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeBeat, setActiveBeat] = useState<number>(0);
  const [selectedSite, setSelectedSite] = useState<UnderpassSite>(
    UNDERPASS_SITES[0],
  );

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
        progressRef.current = p;

        const exact = p * ACT1_BEATS.length;
        const idx = Math.min(ACT1_BEATS.length - 1, Math.floor(exact));
        setActiveBeat((prev) => (prev === idx ? prev : idx));

        barRefs.current.forEach((bar, i) => {
          if (!bar) return;
          const fill = Math.min(1, Math.max(0, exact - i));
          bar.style.transform = `scaleX(${fill})`;
        });

        const rect = section.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          const beat = ACT1_BEATS[idx];
          setSceneMeta(beat.key, beat.clock, "paper");
        }
      },
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

  const currentBeat = ACT1_BEATS[activeBeat];

  return (
    <section
      ref={sectionRef}
      id="hava"
      aria-label="I / Gökyüzü ve 3B Radar"
      className="relative h-[310svh] scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
    >
      <div className="sticky top-0 h-[100svh] min-h-0 overflow-hidden">
        <div className="stage-pad mx-auto flex h-full w-full max-w-[1680px] flex-col px-[var(--edge)] pb-4 pt-[calc(var(--head)+14px)]">
          {/* Top metadata + mini progress bars */}
          <div className="stage-head flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-2.5">
            <span className="eyebrow-label text-[var(--ink-muted)]">
              I <span className="opacity-45">/</span> Gökyüzü ve Belirsizlik
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {ACT1_BEATS.map((beat, i) => (
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

          {/* Main asymmetric grid */}
          <div className="stage-grid grid min-h-0 flex-1 grid-cols-1 gap-4 pt-3 lg:grid-cols-[0.88fr_1.62fr] lg:items-center lg:gap-12">
            {/* Editorial Copy + Inline 12-Site Inspector */}
            <div className="stage-copy flex flex-col justify-center">
              <span className="eyebrow-label inline-flex items-center gap-2 text-[var(--pine)]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                  aria-hidden="true"
                />
                {currentBeat.clock}
              </span>

              <h2 className="stage-h2 font-display mt-2 text-[clamp(30px,4vw,66px)] font-normal leading-[0.98] tracking-[-0.05em] text-[var(--ink)]">
                {currentBeat.heading}
              </h2>

              <p className="stage-body mt-2.5 max-w-[44ch] text-[13.5px] leading-relaxed text-[var(--ink-muted)] sm:text-[16px]">
                {currentBeat.body}
              </p>

              {/* Inline 12-candidate selector (replaces modal from v1) */}
              <div className="stage-sim mt-4 border-t border-[var(--hairline)] pt-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow-label text-[10px] text-[var(--ink-muted)]">
                    Aday Nokta Seçimi ({UNDERPASS_SITES.length} Alt Geçit)
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToTarget("#kesit")}
                    className="eyebrow-label text-[10px] text-[var(--pine)] underline underline-offset-4 hover:text-[var(--signal)]"
                  >
                    Akay Kesitine İn →
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {UNDERPASS_SITES.slice(0, 8).map((site) => {
                    const active = selectedSite.id === site.id;
                    return (
                      <button
                        key={site.id}
                        type="button"
                        onClick={() => setSelectedSite(site)}
                        className={`tactile-btn font-mono-num border px-2 py-1 text-[10.5px] leading-none ${
                          active
                            ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                            : site.tier === "direct"
                              ? "border-[var(--signal)]/50 bg-[var(--paper-subtle)] text-[var(--ink)] hover:border-[var(--signal)]"
                              : "border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--pine)]"
                        }`}
                      >
                        {site.id} · %{site.riskPct}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-[var(--paper-subtle)] px-2.5 py-1.5 text-[11.5px]">
                  <span className="font-medium text-[var(--ink)]">
                    {selectedSite.id} · {selectedSite.name}
                  </span>
                  <span className="font-mono-num text-[11px] text-[var(--signal)]">
                    {selectedSite.assignment}
                  </span>
                  <span className="w-full text-[11px] text-[var(--ink-muted)]">
                    {selectedSite.basis}
                  </span>
                </div>
              </div>
            </div>

            {/* 3D WebGL Plate */}
            <figure className="stage-figure flex h-[38svh] min-h-[200px] flex-col lg:h-[calc(100svh-var(--head)-80px)] lg:max-h-[660px]">
              <div className="min-h-0 flex-1">
                <StormRadarWebGL
                  progressRef={progressRef}
                  selectedSiteId={selectedSite.id}
                  onSelectSite={setSelectedSite}
                />
              </div>
              <figcaption className="mt-2 border-t border-[var(--hairline)] pt-2 font-mono-num text-[10px] tracking-wide text-[var(--ink-muted)]">
                {currentBeat.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
