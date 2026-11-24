"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle, Path, ShieldWarning } from "@phosphor-icons/react";
import { useStory } from "@/components/shell/StoryContext";
import { AtlasDispatchCanvas } from "./AtlasDispatchCanvas";

gsap.registerPlugin(ScrollTrigger);

export function AkomDispatchAct() {
  const { setSceneMeta } = useStory();
  const allocSectionRef = useRef<HTMLElement | null>(null);
  const allocProgressRef = useRef<number>(0);

  const [roadworkBypass, setRoadworkBypass] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);

  useEffect(() => {
    const sec = allocSectionRef.current;
    if (!sec) return;

    const trigger = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        allocProgressRef.current = Math.min(1, Math.max(0, self.progress));
        const rect = sec.getBoundingClientRect();
        const probe = window.innerHeight * 0.42;
        if (rect.top <= probe && rect.bottom > probe) {
          setSceneMeta("allocate", "16.40", "paper");
        }
      },
    });

    return () => trigger.kill();
  }, [setSceneMeta]);

  return (
    <section
      ref={allocSectionRef}
      id="filo"
      aria-label="III / Sahadaki Ekipler · 16.40 Ön Yerleşim"
      className="relative h-[160svh] scroll-mt-[var(--head)] border-b border-[var(--hairline)] bg-[var(--paper)]"
    >
      <div className="sticky top-0 h-[100svh] min-h-0 overflow-hidden">
        <div className="stage-pad mx-auto flex h-full w-full max-w-[1680px] flex-col px-[var(--edge)] pb-4 pt-[calc(var(--head)+14px)]">
          <div className="stage-head flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-2.5">
            <span className="eyebrow-label text-[var(--ink-muted)]">
              III <span className="opacity-45">/</span> AKOM Nöbetçi
              Koordinatör Ekranı
            </span>
            <span className="font-mono-num text-[11px] text-[var(--pine)]">
              4 Doğrudan + 2 Tampon · 12 Personel
            </span>
          </div>

          <div className="stage-grid grid min-h-0 flex-1 grid-cols-1 gap-4 pt-3 lg:grid-cols-[0.92fr_1.58fr] lg:items-center lg:gap-11">
            {/* Left Editorial + Interactive AKOM Dispatch Console */}
            <div className="stage-copy flex flex-col justify-center">
              <span className="eyebrow-label inline-flex items-center gap-2 text-[var(--pine)]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                  aria-hidden="true"
                />
                16.40 · ÖN YERLEŞİM VE İNSAN ONAYI
              </span>

              <h2 className="stage-h2 font-display mt-2 text-[clamp(28px,3.6vw,58px)] font-normal leading-[0.98] tracking-[-0.048em] text-[var(--ink)]">
                Dördü yola. İkisi beklemeye.
              </h2>

              <p className="stage-body mt-2 max-w-[44ch] text-[13.5px] leading-relaxed text-[var(--ink-muted)] sm:text-[15.5px]">
                Dört pompa doğrudan yüksek riskli noktalara (P1–P4), iki pompa
                ise ara bekleme bölgelerine (P5–P6) önerilir. Nihai kararı
                daima koordinatör verir.
              </p>

              {/* Interactive AKOM Control Card (Sans + Mono strictly) */}
              <div className="stage-sim mt-3 border border-[var(--hairline)] bg-[var(--paper-subtle)] p-3 sm:p-4">
                <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
                  <span className="font-mono-num text-[11px] font-semibold text-[var(--ink)]">
                    ATAMA LİSTESİ · 6 MOBİL ÜNİTE
                  </span>
                  <span className="font-mono-num text-[10px] text-[var(--pine)]">
                    Atama &lt; 2 dk
                  </span>
                </div>

                <ul className="mt-2.5 space-y-1.5 font-mono-num text-[11px]">
                  <li className="flex justify-between gap-2 text-[var(--ink)]">
                    <span>P1 Akay · P2 Taurus · P4 Bilkent</span>
                    <span className="text-[var(--signal)]">Doğrudan</span>
                  </li>
                  <li className="flex justify-between gap-2 text-[var(--ink)]">
                    <span>P3 Ceyhun Atuf Kansu</span>
                    <span className="text-[var(--signal)]">
                      {roadworkBypass ? "Alternatif Rota (+2 dk)" : "Ana Rota (5 dk)"}
                    </span>
                  </li>
                  <li className="flex justify-between gap-2 text-[var(--ink-muted)]">
                    <span>P5 Çetin Emeç · P6 Merkezi Çankaya</span>
                    <span className="text-[var(--pine)]">Tampon Hazır</span>
                  </li>
                </ul>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--hairline)] pt-3">
                  <button
                    type="button"
                    id="roadwork-toggle"
                    aria-pressed={roadworkBypass}
                    onClick={() => setRoadworkBypass((v) => !v)}
                    className={`tactile-btn inline-flex items-center gap-1.5 border px-3 py-1.5 text-[12px] font-medium ${
                      roadworkBypass
                        ? "border-[#b56f1b] bg-[#b56f1b] text-[#f4f3ed]"
                        : "border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <Path size={14} weight="bold" />
                    <span>
                      {roadworkBypass
                        ? "Yol Çalışması: P3 Kaydırıldı"
                        : "16.40 Yol Çalışması Engeli Ekle"}
                    </span>
                  </button>

                  <button
                    type="button"
                    id="approve-dispatch"
                    aria-pressed={approved}
                    onClick={() => setApproved(true)}
                    className={`tactile-btn inline-flex items-center gap-1.5 border px-3 py-1.5 text-[12px] font-medium ${
                      approved
                        ? "border-[var(--pine)] bg-[var(--pine)] text-[#f4f3ed]"
                        : "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--pine)] hover:border-[var(--pine)]"
                    }`}
                  >
                    <CheckCircle size={14} weight="bold" />
                    <span>
                      {approved
                        ? "Görev Kartları İletildi"
                        : "Planı Onayla ve İlet"}
                    </span>
                  </button>
                </div>

                {approved ? (
                  <p className="mt-2.5 flex items-center gap-1.5 font-mono-num text-[11px] text-[var(--pine)]">
                    <ShieldWarning size={14} weight="bold" />
                    <span>
                      4 doğrudan + 2 tampon görev kartı İtfaiye &amp; ASKİ ekip
                      şeflerine gönderildi.
                    </span>
                  </p>
                ) : null}
              </div>
            </div>

            {/* Right Atlas Plate */}
            <figure className="stage-figure flex h-[36svh] min-h-[195px] flex-col lg:h-[calc(100svh-var(--head)-80px)] lg:max-h-[660px]">
              <div className="min-h-0 flex-1 border border-[var(--hairline)] bg-[var(--paper)]">
                <AtlasDispatchCanvas
                  mode="allocate"
                  progressRef={allocProgressRef}
                  roadworkBypass={roadworkBypass}
                  approved={approved}
                />
              </div>
              <figcaption className="mt-2 border-t border-[var(--hairline)] pt-2 font-mono-num text-[10px] tracking-wide text-[var(--ink-muted)]">
                Pompa yerleşimi · P1–P4 doğrudan çıkış, P5–P6 ara tampon kapsama
                çemberleri (şematik)
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
