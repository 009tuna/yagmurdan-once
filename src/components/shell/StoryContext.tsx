"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SceneKey } from "@/data/dossier";

export type NavTone = "hero" | "paper" | "night";
export type DrawerMode = "menu" | "sources" | null;

interface StoryContextValue {
  activeScene: SceneKey;
  clockLabel: string;
  navTone: NavTone;
  juryMode: boolean;
  soundEnabled: boolean;
  drawerMode: DrawerMode;
  progressBarRef: React.RefObject<HTMLSpanElement | null>;
  setSceneMeta: (scene: SceneKey, clock: string, tone: NavTone) => void;
  setJuryMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setDrawerMode: React.Dispatch<React.SetStateAction<DrawerMode>>;
  scrollToTarget: (target: string | number) => void;
  registerScrollHandler: (handler: (target: string | number) => void) => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [activeScene, setActiveScene] = useState<SceneKey>("hero");
  const [clockLabel, setClockLabel] = useState<string>("16.30");
  const [navTone, setNavTone] = useState<NavTone>("hero");
  const [juryMode, setJuryMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);

  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const scrollHandlerRef = useRef<(target: string | number) => void>(
    (target) => {
      if (typeof window === "undefined") return;
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
  );

  const setSceneMeta = useCallback(
    (scene: SceneKey, clock: string, tone: NavTone) => {
      setActiveScene((prev) => (prev === scene ? prev : scene));
      setClockLabel((prev) => (prev === clock ? prev : clock));
      setNavTone((prev) => (prev === tone ? prev : tone));
      if (typeof document !== "undefined") {
        document.body.dataset.scene = scene;
      }
    },
    [],
  );

  const registerScrollHandler = useCallback(
    (handler: (target: string | number) => void) => {
      scrollHandlerRef.current = handler;
    },
    [],
  );

  const scrollToTarget = useCallback((target: string | number) => {
    scrollHandlerRef.current(target);
  }, []);

  const value = useMemo<StoryContextValue>(
    () => ({
      activeScene,
      clockLabel,
      navTone,
      juryMode,
      soundEnabled,
      drawerMode,
      progressBarRef,
      setSceneMeta,
      setJuryMode,
      setSoundEnabled,
      setDrawerMode,
      scrollToTarget,
      registerScrollHandler,
    }),
    [
      activeScene,
      clockLabel,
      navTone,
      juryMode,
      soundEnabled,
      drawerMode,
      setSceneMeta,
      scrollToTarget,
      registerScrollHandler,
    ],
  );

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return ctx;
}
