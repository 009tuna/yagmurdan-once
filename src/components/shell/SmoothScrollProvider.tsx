"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useStory } from "./StoryContext";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { drawerMode, progressBarRef, registerScrollHandler } = useStory();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateProgress = () => {
      const bar = progressBarRef.current;
      if (!bar) return;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      bar.style.transform = `scaleX(${ratio})`;
    };

    const masterTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: updateProgress,
      onRefresh: updateProgress,
    });

    const mountLenis = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;

      if (reducedQuery.matches) {
        ScrollTrigger.refresh();
        return;
      }

      const lenis = new Lenis({
        lerp: 0.105,
        smoothWheel: true,
        syncTouch: false,
        prevent: (node) =>
          Boolean(node.closest("[data-scroll-lock='true']")),
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      registerScrollHandler((target) => {
        if (typeof target === "number") {
          lenis.scrollTo(target, { duration: 1.05 });
          return;
        }
        const el = document.querySelector(target);
        if (el) {
          lenis.scrollTo(el as HTMLElement, { offset: -64, duration: 1.15 });
        }
      });

      ScrollTrigger.refresh();

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    let cleanupLenis = mountLenis();

    const handleMotionChange = () => {
      cleanupLenis?.();
      cleanupLenis = mountLenis();
    };
    reducedQuery.addEventListener("change", handleMotionChange);

    // Keyboard navigation bypasses residual wheel inertia cleanly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(e.key)
      ) {
        lenisRef.current?.scrollTo(window.scrollY, {
          immediate: true,
          force: true,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Re-measure ScrollTrigger after Google fonts settle
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        updateProgress();
      });
    }

    updateProgress();

    return () => {
      reducedQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("keydown", handleKeyDown);
      cleanupLenis?.();
      masterTrigger.kill();
    };
  }, [progressBarRef, registerScrollHandler]);

  // Pause Lenis scrolling when Reference/Menu Drawer is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (drawerMode !== null) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [drawerMode]);

  return <>{children}</>;
}
