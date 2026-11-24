"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, BookOpenText } from "@phosphor-icons/react";
import { GOVERNANCE_ROLES, KPI_TARGETS } from "@/data/dossier";
import { useStory } from "@/components/shell/StoryContext";

gsap.registerPlugin(ScrollTrigger);

const REPLAY_STRATEGIES = [
  {
    code: "S1",
    name: "İhbar Odaklı Müdahale",
    note: "Vatandaş ihbarı sonrası çıkış · yağışlı trafik gecikmesi",
  },
  {
    code: "S2",
    name: "Sabit Kritik Nokta Listesi",
    note: "Fırtına yönünü görmezden gelen ezbere yerleşim",
  },
  {
    code: "FİZİK",
    name: "Rasyonel Yöntem Kuralı",
    note: "Q = C · i · A referans fiziksel skor",
  },
  {
    code: "S3",
    name: "Yapay Zekâ + 2 Aşamalı Optimizasyon",
    note: "16 özellik + PU öğrenme + tampon rezerv stratejisi",
  },
] as const;

export function PilotEndingSection() {
  const { setSceneMeta, setDrawerMode, scrollToTarget } = useStory();
  const pilotRef = useRef<HTMLElement | null>(null);
  const govRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const t1 = pilotRef.current
      ? ScrollTrigger.create({
          trigger: pilotRef.current,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setSceneMeta("end", "PİLOT", "paper"),
          onEnterBack: () => setSceneMeta("end", "PİLOT", "paper"),
        })
      : null;

    const t2 = govRef.current
      ? ScrollTrigger.create({
          trigger: govRef.current,
          start: "top 42%",
          end: "bottom bottom",
          onEnter: () => setSceneMeta("end", "KURUMSAL", "paper"),
          onEnterBack: () => setSceneMeta("end", "KURUMSAL", "paper"),
        })
      : null;

    return () => {
      t1?.kill();
      t2?.kill();
    };
  }, [setSceneMeta]);

  return (
    <>
      {/* Screen 1: 3 June 2023 Pilot Replay Split (fits cleanly within 100svh) */}
      <section
        ref={pilotRef}
        id="pilot"
        aria-labelledby="pilot-heading"
        className="relative isolate overflow-hidden scroll-mt-[var(--head)] border-t border-[var(--hairline)] bg-[var(--paper)]"
      >
        <div className="grid grid-cols-1 border-b border-[var(--hairline)] lg:min-h-[calc(100svh-var(--head))] lg:grid-cols-2">
          <div className="pilot-copy flex flex-col justify-center px-[var(--edge)] py-6 lg:py-5 xl:py-8">
            <span className="eyebrow-label text-[var(--pine)]">
              Pilot Önerisi · 3 Haziran 2023 Ankara Sağanağı
            </span>
            <h2
              id="pilot-heading"
              className="font-display mt-1.5 text-[clamp(30px,min(3.8vw,5.4svh),68px)] font-normal leading-[0.94] tracking-[-0.048em] text-[var(--ink)]"
            >
              Aynı yağışı
              <br />
              <em className="font-normal italic">yeniden oynatalım.</em>
            </h2>

            <p className="pilot-lead mt-2.5 xl:mt-3 max-w-[46ch] text-[clamp(12.5px,1.65svh,15px)] leading-[1.48] text-[var(--ink-muted)]">
              Bir yolun sahada gerçekte kaç dakika açık kalacağını teoriden
              bilemeyiz. Bunu kanıtlamak için{" "}
              <strong className="font-medium text-[var(--ink)]">
                3 Haziran 2023
              </strong>{" "}
              Ankara sağanağını (Akay, Taurus ve Ceyhun Atuf Kansu müdahaleleri)
              aynı altı pompa ve yalnızca karar anındaki tahminlerle
              simülasyonda yeniden oynatmayı öneriyoruz.
            </p>

            {/* Primary KPI highlight band */}
            <div className="pilot-kpi mt-3 xl:mt-4 flex items-center gap-4 border-y border-[var(--hairline)] py-2.5 xl:py-3">
              <span className="font-display text-[clamp(30px,3.8svh,52px)] leading-none tracking-tight text-[var(--pine)]">
                ≥ %50
              </span>
              <div>
                <span className="eyebrow-label block text-[10px] text-[var(--ink-muted)]">
                  Jüriye Sunulan Gerçek Pilot Hedefi
                </span>
                <span className="mt-0.5 block text-[12.5px] xl:text-[13px] font-medium text-[var(--ink)]">
                  Ortalama müdahale süresinde azalma (yağmursuz günler dahil
                  yanlış alarm testiyle)
                </span>
              </div>
            </div>

            {/* 4 Benchmarked Strategies */}
            <div className="pilot-methods mt-3 xl:mt-4">
              <span className="eyebrow-label text-[10px] text-[var(--ink-muted)]">
                Adil Tekrarda Yarışan 4 Yöntem
              </span>
              <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:gap-2">
                {REPLAY_STRATEGIES.map((st) => (
                  <div
                    key={st.code}
                    className={`pilot-card border p-2 xl:p-2.5 ${
                      st.code === "S3"
                        ? "border-[var(--pine)] bg-[#e2e9df]"
                        : "border-[var(--hairline)] bg-[var(--paper-subtle)]"
                    }`}
                  >
                    <span className="font-mono-num text-[10px] font-semibold uppercase tracking-wider text-[var(--pine)]">
                      {st.code}
                    </span>
                    <div className="mt-0.5 text-[12px] xl:text-[12.5px] font-semibold text-[var(--ink)]">
                      {st.name}
                    </div>
                    <p className="mt-0.5 text-[11px] xl:text-[11.5px] leading-snug text-[var(--ink-muted)]">
                      {st.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            role="img"
            aria-label="Yağmur sonrası aynı alt geçidin ıslak zemin görünümü"
            className="min-h-[40svh] bg-cover bg-[67%_52%] lg:min-h-full"
            style={{ backgroundImage: "url('/media/film-end.webp')" }}
          />
        </div>
      </section>

      {/* Screen 2: 7 KPIs, Institutional Governance & Footer (fits cleanly within final 100svh) */}
      <section
        ref={govRef}
        id="kurumsal"
        aria-label="Pilot KPI hedefleri ve kurumsal rol dağılımı"
        className="deck-slide relative isolate overflow-hidden scroll-mt-[var(--head)] justify-between bg-[var(--paper)]"
      >
        <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.25fr] lg:gap-10 xl:gap-14">
          {/* 7 Measurable KPIs */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="eyebrow-label text-[var(--pine)]">
                Ölçülebilir Pilot Başarı Kriterleri (s. 10–11)
              </span>
              <h3 className="font-display mt-1.5 text-[clamp(22px,min(2.7vw,3.9svh),38px)] font-normal leading-tight tracking-[-0.04em] text-[var(--ink)]">
                Başarı tek metrikle değil, yedi eşikle ölçülür.
              </h3>

              <dl className="mt-2.5 xl:mt-3 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                {KPI_TARGETS.map((item) => (
                  <div
                    key={item.metric}
                    className="flex items-baseline justify-between gap-4 py-1 xl:py-1.5 text-[11.5px] xl:text-[12px]"
                  >
                    <dt className="text-[var(--ink)]">{item.metric}</dt>
                    <dd className="font-mono-num shrink-0 font-semibold text-[var(--pine)]">
                      {item.target}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Honest Scope Boundary & Hackathon Flexibility */}
            <div className="mt-2.5 xl:mt-3.5 border border-[var(--hairline)] bg-[var(--paper-subtle)] p-2.5 xl:p-3">
              <span className="eyebrow-label text-[10px] text-[var(--signal)]">
                Dürüst Kapsam Sınırı ve Hackathon Günü Esnekliği
              </span>
              <p className="mt-1 text-[11px] xl:text-[11.5px] leading-snug text-[var(--ink)]">
                Sistem şebeke içme suyu kaybını değil, ani sağanak kaynaklı
                kentsel su baskınlarını hedefler; büyük dere taşkınları mobil
                pompalarla durdurulamaz. 4 katmanlı çekirdek (Özellik → PU ML +
                XAI → Stokastik Optimizasyon → Operatör Onayı) yarışma günü
                farklı bir su problemine de uyarlanabilir.
              </p>
            </div>
          </div>

          {/* Institutional Ownership & Procurement Readiness */}
          <div>
            <span className="eyebrow-label text-[var(--ink-muted)]">
              Kurumsal Rol Dağılımı ve Mevzuata Uygun Alım (s. 12–13)
            </span>
            <h3 className="font-display mt-1.5 text-[clamp(22px,min(2.7vw,3.9svh),38px)] font-normal leading-tight tracking-[-0.04em] text-[var(--ink)]">
              Kim kullanır, kim onaylar, nasıl alınır?
            </h3>

            <div className="mt-2.5 xl:mt-3 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {GOVERNANCE_ROLES.map((g) => (
                <div
                  key={g.role}
                  className="grid grid-cols-1 gap-1 py-1.5 xl:py-2 sm:grid-cols-[175px_1fr]"
                >
                  <div>
                    <span className="eyebrow-label block text-[10px] text-[var(--pine)]">
                      {g.role}
                    </span>
                    <span className="mt-0.5 block text-[12px] xl:text-[12.5px] font-semibold text-[var(--ink)]">
                      {g.actor}
                    </span>
                  </div>
                  <div className="text-[11.5px] xl:text-[12px] leading-snug">
                    <p className="text-[var(--ink)]">{g.expectation}</p>
                    <p className="mt-0.5 font-mono-num text-[10px] xl:text-[10.5px] text-[var(--ink-muted)]">
                      Uygulama: {g.proof}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mx-auto mt-2.5 xl:mt-3.5 w-full max-w-[1680px] border-t border-[var(--hairline)] pt-2.5 xl:pt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <strong className="block text-[14px] font-semibold tracking-tight text-[var(--ink)]">
                Yağmurdan Önce
              </strong>
              <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
                Akıllı Pompa Konuşlandırma · Wilo × imece Water AI Hackathon 2026
              </span>
            </div>

            <div className="flex items-center gap-6 text-[13px] font-medium text-[var(--ink)]">
              <button
                type="button"
                onClick={() => setDrawerMode("sources")}
                className="tactile-btn inline-flex items-center gap-1.5 hover:text-[var(--pine)] hover:underline underline-offset-4"
              >
                <BookOpenText size={15} weight="regular" />
                <span>Senaryo ve 25 Kaynak</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToTarget(0)}
                className="tactile-btn inline-flex items-center gap-1.5 hover:text-[var(--pine)] hover:underline underline-offset-4"
              >
                <span>Başa dön</span>
                <ArrowUp size={14} weight="bold" />
              </button>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
