"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, X } from "@phosphor-icons/react";
import { VOICE_PATHS, VOICE_TRANSCRIPTS } from "@/data/dossier";
import { useStory } from "./StoryContext";

export function VoiceCaptionBar() {
  const { activeScene, soundEnabled, drawerMode, setSoundEnabled } = useStory();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(1);
    };
    const onTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!soundEnabled || drawerMode !== null || document.hidden) {
      audio.pause();
      return;
    }

    const src = VOICE_PATHS[activeScene];
    if (!src) return;

    debounceRef.current = window.setTimeout(() => {
      if (audio.src !== window.location.origin + src) {
        audio.src = src;
        setProgress(0);
      }
      audio.play().catch(() => {
        // Browser autoplay or interrupt blocked; allow manual toggle
        setIsPlaying(false);
      });
    }, 200);

    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [activeScene, soundEnabled, drawerMode]);

  useEffect(() => {
    const onVisChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        audio.pause();
      } else if (soundEnabled && drawerMode === null) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, [soundEnabled, drawerMode]);

  if (!soundEnabled) return null;

  const transcript = VOICE_TRANSCRIPTS[activeScene] ?? "";

  return (
    <div
      role="region"
      aria-label="Sesli anlatım altyazısı"
      className="fixed bottom-4 left-1/2 z-30 w-[min(94vw,680px)] -translate-x-1/2 border border-[#28423b] bg-[#10231f]/95 text-[#eef1e5] shadow-[0_18px_40px_rgba(16,35,31,0.35)] backdrop-blur-md"
    >
      <div className="relative flex items-start gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => {
            const audio = audioRef.current;
            if (!audio) return;
            if (audio.paused) {
              audio.play().catch(() => {});
            } else {
              audio.pause();
            }
          }}
          aria-label={isPlaying ? "Anlatımı duraklat" : "Anlatımı sürdür"}
          className="tactile-btn mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-[#3d5c52] bg-[#17332d] text-[#eef1e5]"
        >
          {isPlaying ? <Pause size={13} weight="bold" /> : <Play size={13} weight="bold" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono-num text-[10px] uppercase tracking-[0.09em] text-[#b6c7bb]">
              Türkçe Sesli Sunum · {activeScene.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-[#eef1e5]">
            {transcript}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(false)}
          aria-label="Sesi kapat"
          className="tactile-btn mt-0.5 p-1 text-[#b6c7bb] hover:text-[#eef1e5]"
        >
          <X size={15} weight="bold" />
        </button>

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[var(--signal)] transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
