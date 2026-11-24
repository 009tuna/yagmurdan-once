"use client";

import React, { useEffect } from "react";
import { ArrowDownRight, X } from "@phosphor-icons/react";
import { CHAPTER_INDEX, REFERENCES_LIST } from "@/data/dossier";
import { useStory } from "./StoryContext";

export function ReferenceDrawer() {
  const { drawerMode, setDrawerMode, scrollToTarget } = useStory();
  const isOpen = drawerMode !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerMode(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setDrawerMode]);

  return (
    <div
      data-scroll-lock={isOpen ? "true" : "false"}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        onClick={() => setDrawerMode(null)}
        className="absolute inset-0 bg-[#10231f]/55 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={drawerMode === "sources" ? "Kaynakça ve Teknik Dayanak" : "Bölümler"}
        style={{ transitionTimingFunction: "var(--ease-drawer)" }}
        className={`absolute right-0 top-0 flex h-full w-[min(94vw,540px)] flex-col border-l border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-[var(--hairline)] px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerMode("menu")}
              className={`eyebrow-label px-2 py-1 transition-colors ${
                drawerMode === "menu"
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Bölümler
            </button>
            <button
              type="button"
              onClick={() => setDrawerMode("sources")}
              className={`eyebrow-label px-2 py-1 transition-colors ${
                drawerMode === "sources"
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Kaynakça ({REFERENCES_LIST.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDrawerMode(null)}
            className="tactile-btn inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink)]"
          >
            <span>Kapat</span>
            <X size={16} weight="bold" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {drawerMode === "menu" ? (
            <div>
              <h2 className="font-display text-3xl tracking-tight text-[var(--ink)]">
                Akış Dizini
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                16.30 uyarısından 17.02 yağış kaymasına ve 3 Haziran 2023 test
                planına doğrudan atlayın.
              </p>
              <nav className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                {CHAPTER_INDEX.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setDrawerMode(null);
                      window.setTimeout(() => scrollToTarget(item.href), 60);
                    }}
                    className="tactile-btn flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-[var(--ink)] hover:text-[var(--pine)]"
                  >
                    <span>{item.label}</span>
                    <ArrowDownRight size={16} weight="regular" />
                  </button>
                ))}
              </nav>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-3xl tracking-tight text-[var(--ink)]">
                Senaryo ve Kaynakça
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                Bu sunum, 24 Kasım 2026 tarihli{" "}
                <em>
                  Yağmurdan Önce Akıllı Pompa Konuşlandırma · Nihai Proje
                  Dosyası
                </em>{" "}
                temel alınarak hazırlanmıştır. Harita şematik, sokak görselleri
                temsili canlandırmadır; müdahale süreleri proje dosyasındaki
                örnek senaryoya aittir.
              </p>

              <ol className="mt-6 space-y-3 border-t border-[var(--hairline)] pt-5 text-[13px] leading-relaxed text-[var(--ink)]">
                {REFERENCES_LIST.map((ref, idx) => (
                  <li key={ref} className="flex gap-3">
                    <span className="font-mono-num w-6 shrink-0 text-[11px] font-medium text-[var(--pine)]">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    <span>{ref}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
