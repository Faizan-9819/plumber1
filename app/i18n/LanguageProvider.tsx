"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { pathForLanguage } from "@/lib/i18n";
import type { Locale, Translation } from "./config";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (entry: Translation) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// `locale` is the app/[locale] route param — the language proxy.ts actually
// resolved this request to. It's used instead of usePathname(): behind the
// proxy's rewrite of "/" the client pathname can disagree with the server.
// Switching language crosses root layouts, so it's a full page load that
// re-renders this provider with the new param; no mirrored state needed.
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      router.push(pathForLanguage(next));
    },
    [locale, router],
  );

  const t = useCallback(
    (entry: Translation) => entry[locale] ?? entry.en,
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LanguageContext.Provider value={value}>
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
