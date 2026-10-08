import type { Language } from "@/settings";

// Every language this template has copy for — i.e. the values the
// app/[locale] route accepts. Which of them are actually switched on, and
// which one is the main language, lives in settings.ts (read via lib/i18n).
export const SUPPORTED_LOCALES = ["en", "nl"] as const satisfies readonly Language[];
export type Locale = Language;

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "nl";
}

export type Translation = { en: string; nl: string };
