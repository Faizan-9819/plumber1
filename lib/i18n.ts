import {
  DEFAULT_LANGUAGE,
  EN_ENABLED,
  EN_URL,
  NL_ENABLED,
  NL_URL,
  type Language,
} from "@/settings";

/** The languages switched on, falling back to the main one if both are off. */
export function enabledLanguages(): Language[] {
  const languages: Language[] = [];
  if (EN_ENABLED) languages.push("en");
  if (NL_ENABLED) languages.push("nl");
  return languages.length > 0 ? languages : [DEFAULT_LANGUAGE];
}

/** Does this site ship that language at all? */
export function isLanguageEnabled(lang: Language): boolean {
  return enabledLanguages().includes(lang);
}

/** Are both languages on? */
export function isMultiLanguage(): boolean {
  return enabledLanguages().length > 1;
}

/** The main language, corrected if DEFAULT_LANGUAGE is switched off. */
export function defaultLanguage(): Language {
  const languages = enabledLanguages();
  return languages.includes(DEFAULT_LANGUAGE) ? DEFAULT_LANGUAGE : languages[0];
}

/** The URL a language is served from. A single-language site lives on "/". */
export function pathForLanguage(lang: Language): string {
  if (!isMultiLanguage()) return "/";
  return lang === "nl" ? NL_URL : EN_URL;
}

/** The language living on "/", if either of them is. */
export function rootLanguage(): Language | null {
  return enabledLanguages().find((lang) => pathForLanguage(lang) === "/") ?? null;
}

/** Which language a URL belongs to. */
export function languageFromPathname(pathname: string): Language {
  for (const lang of enabledLanguages()) {
    const url = pathForLanguage(lang);
    if (url === "/") continue;
    if (pathname === url || pathname.startsWith(`${url}/`)) return lang;
  }
  return rootLanguage() ?? defaultLanguage();
}
