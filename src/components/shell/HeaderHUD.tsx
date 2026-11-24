"use client";

import React from "react";
import {
  BookOpenText,
  List,
  PresentationChart,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import { JURY_PITCH_CHAPTERS } from "@/data/dossier";
import { useStory } from "./StoryContext";

export function HeaderHUD() {
  const {
    clockLabel,
    navTone,
    juryMode,
    soundEnabled,
    progressBarRef,
    setJuryMode,
    setSoundEnabled,
    setDrawerMode,
    scrollToTarget,
  } = useStory();

  const surfaceClass =
    navTone === "hero"
      ? "bg-[#10231f]/55 text-[#fffdf4] border-white/25 backdrop-blur-md"
      : navTone === "night"
        ? "bg-[#10231f] text-[#eef1e5] border-[#28423b]"
        : "bg-[#f4f3ed]/95 text-[#132825] border-[#c5ccc0] backdrop-blur-sm";

  const mutedText =
    navTone === "hero"
      ? "text-[#e3ebe4]/80"
      : navTone === "night"
        ? "text-[#b6c7bb]"
        : "text-[#465852]";

  return (
    <>
      <a
        href="#problem"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget("#problem");
        }}
        className="fixed left-5 -top-16 z-50 bg-[#f4f3ed] px-3 py-2 text-xs font-medium text-[#132825] border border-[#132825] focus:top-3 transition-[top] duration-150"
      >
        Hikâyeye geç
      </a>

      <header
        id="bar"
        className={`fixed inset-x-0 top-0 z-40 h-[var(--head)] border-b transition-colors duration-200 ${surfaceClass}`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1680px] items-center gap-3 px-[var(--edge)] md:gap-7">
          <a
            href="#giris"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(0);
            }}
            className="flex shrink-0 items-center gap-2.5 text-[16px] md:text-[18px] font-semibold tracking-[-0.04em]"
            aria-label="Yağmurdan Önce, başa dön"
          >
            <span
              className="flex h-5 w-5 -skew-x-[17deg] items-center gap-[2px]"
              aria-hidden="true"
            >
              <i className="block h-[13px] w-[3.5px] bg-current" />
              <i className="block h-[20px] w-[3.5px] bg-current" />
              <i className="block h-[13px] w-[3.5px] bg-current" />
            </span>
            <span>Yağmurdan Önce</span>
          </a>

          <div
            className={`hidden md:flex items-center gap-2.5 border-l pl-5 eyebrow-label ${
              navTone === "hero"
                ? "border-white/25"
                : navTone === "night"
                  ? "border-[#28423b]"
                  : "border-[#c5ccc0]"
            } ${mutedText}`}
          >
            <span>Çankaya / Ankara</span>
            <span aria-hidden="true" className="opacity-45">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono-num text-[11px] font-medium">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                aria-hidden="true"
              />
              {clockLabel}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4 md:gap-5">
            <button
              type="button"
              onClick={() => setJuryMode((v) => !v)}
              aria-pressed={juryMode}
              className={`tactile-btn hidden sm:inline-flex items-center gap-1.5 border px-2.5 py-1 text-[12px] font-medium tracking-tight ${
                juryMode
                  ? "border-[var(--signal)] bg-[var(--signal)] text-[#f4f3ed]"
                  : navTone === "hero"
                    ? "border-white/30 text-[#fffdf4] hover:border-white/60"
                    : navTone === "night"
                      ? "border-[#3c5a51] text-[#eef1e5] hover:border-[#6a8e82]"
                      : "border-[#c5ccc0] text-[#132825] hover:border-[#236a52]"
              }`}
              title="3 dakikalık yarışma sunumu zaman çizelgesi"
            >
              <PresentationChart size={15} weight="regular" />
              <span>3 dk Jüri Modu</span>
            </button>

            <button
              type="button"
              id="sound-toggle"
              onClick={() => setSoundEnabled((v) => !v)}
              aria-pressed={soundEnabled}
              className={`tactile-btn inline-flex items-center gap-1.5 px-1.5 py-1.5 text-[12px] md:text-[13px] font-medium ${
                soundEnabled ? "text-[var(--signal)]" : ""
              }`}
            >
              {soundEnabled ? (
                <SpeakerHigh size={16} weight="bold" />
              ) : (
                <SpeakerSlash size={16} weight="regular" />
              )}
              <span>{soundEnabled ? "Sesi kapat" : "Sesi aç"}</span>
            </button>

            <button
              type="button"
              onClick={() => setDrawerMode("sources")}
              className="tactile-btn hidden lg:inline-flex items-center gap-1.5 px-1.5 py-1.5 text-[13px] font-medium opacity-85 hover:opacity-100"
            >
              <BookOpenText size={16} weight="regular" />
              <span>Kaynakça</span>
            </button>

            <button
              type="button"
              id="contents-toggle"
              onClick={() => setDrawerMode("menu")}
              aria-haspopup="dialog"
              className="tactile-btn inline-flex items-center gap-1.5 px-1.5 py-1.5 text-[12px] md:text-[13px] font-medium"
            >
              <span>Bölümler</span>
              <List size={17} weight="regular" />
            </button>
          </div>
        </div>

        <span
          ref={progressBarRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-[var(--signal)] will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </header>

      {/* 3-Minute Jury Pitch Quick-Jump Spine */}
      {juryMode ? (
        <aside
          aria-label="3 dakikalık jüri sunum omurgası"
          className="fixed left-1/2 top-[calc(var(--head)+10px)] z-30 hidden w-[min(92vw,920px)] -translate-x-1/2 border border-[#28423b] bg-[#10231f]/95 text-[#eef1e5] backdrop-blur-md md:block"
        >
          <div className="grid grid-cols-5 divide-x divide-[#28423b]">
            {JURY_PITCH_CHAPTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToTarget(`#${item.id}`)}
                className="tactile-btn group px-3 py-2 text-left transition-colors hover:bg-[#19352f]"
              >
                <span className="block font-mono-num text-[10px] tracking-wider text-[var(--signal)]">
                  {item.time}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-medium text-[#eef1e5] group-hover:underline">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </aside>
      ) : null}
    </>
  );
}
