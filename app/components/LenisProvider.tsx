"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

type LenisInstance = NonNullable<LenisRef["lenis"]>;

interface LenisContextType {
  /** Read the live instance. Use a getter, not a stored value — the ref is
   *  null on the first render, so a snapshot taken then never updates. */
  getLenis: () => LenisInstance | null;
  stop: () => void;
  start: () => void;
  scrollTo: (...args: Parameters<LenisInstance["scrollTo"]>) => void;
}

const LenisContext = createContext<LenisContextType>({
  getLenis: () => null,
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
});

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef | null>(null);

  // Counts how many things currently want scrolling locked. Nested locks
  // (modal opened from a drawer) used to break each other: the first one to
  // close called start() and unlocked the page while the other was still open.
  const lockCount = useRef(0);
  const pendingFrame = useRef<number | null>(null);

  const applyLockState = useCallback(() => {
    const lenis = lenisRef.current?.lenis;

    // The ref attaches after children mount, so a child that locks scroll in
    // its own mount effect finds null here. Retry next frame instead of
    // silently no-opping — that no-op is the usual cause of "wheel is dead".
    if (!lenis) {
      pendingFrame.current = requestAnimationFrame(applyLockState);
      return;
    }

    pendingFrame.current = null;
    if (lockCount.current > 0) lenis.stop();
    else lenis.start();
  }, []);

  const stop = useCallback(() => {
    lockCount.current += 1;
    applyLockState();
  }, [applyLockState]);

  const start = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1);
    applyLockState();
  }, [applyLockState]);

  const scrollTo = useCallback<LenisContextType["scrollTo"]>((...args) => {
    lenisRef.current?.lenis?.scrollTo(...args);
  }, []);

  useEffect(() => {
    return () => {
      if (pendingFrame.current !== null) {
        cancelAnimationFrame(pendingFrame.current);
      }
    };
  }, []);

  const value = useMemo<LenisContextType>(
    () => ({
      getLenis: () => lenisRef.current?.lenis ?? null,
      stop,
      start,
      scrollTo,
    }),
    [stop, start, scrollTo],
  );

  return (
    <LenisContext.Provider value={value}>
      <ReactLenis
        ref={lenisRef}
        root
        options={{
          lerp: 0.1, // 0.08 with a reduced wheelMultiplier feels broken on a mouse
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          smoothWheel: true,
          // Otherwise Lenis silently forces lerp to 1 (no easing) whenever the
          // OS/browser reports prefers-reduced-motion, which reads as "smooth
          // scroll doesn't work" on a plain mouse wheel.
          respectReducedMotion: false,
        }}
      >
        {children}
      </ReactLenis>
    </LenisContext.Provider>
  );
}

export const useLenisControl = () => useContext(LenisContext);
