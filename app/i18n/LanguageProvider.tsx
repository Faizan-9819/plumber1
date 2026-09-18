"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale, type Translation } from "./config";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (entry: Translation) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on mount — `locale` is already seeded from `initialLocale`.
    // Only resync from the URL on actual navigations, so this doesn't
    // race with (and silently revert) a manual toggle right after load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const next: Locale =
      pathname === "/nl" || pathname.startsWith("/nl/") ? "nl" : "en";
    setLocaleState(next);
    if (typeof document !== "undefined") document.documentElement.lang = next;
  }, [pathname]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocaleCookie(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const t = useCallback(
    (entry: Translation) => entry[locale] ?? entry.en,
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
