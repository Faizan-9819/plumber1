import "server-only";
import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
} from "./config";

function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, qStr] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: qStr ? Number(qStr) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("nl")) return "nl";
    if (tag.startsWith("en")) return "en";
  }
  return null;
}

function fromCountry(country: string | null): Locale | null {
  if (!country) return null;
  return country.toUpperCase() === "NL" ? "nl" : null;
}

export async function detectInitialLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const fromProxy = headerList.get("x-locale");
  if (isLocale(fromProxy)) return fromProxy;

  // Detect from URL path — /nl or /nl/* means Dutch regardless of cookie/header
  const pathname =
    headerList.get("x-pathname") ??
    headerList.get("x-invoke-path") ??
    headerList.get("x-matched-path") ??
    "";
  if (pathname === "/nl" || pathname.startsWith("/nl/")) return "nl";

  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const fromHeader = fromAcceptLanguage(headerList.get("accept-language"));
  if (fromHeader) return fromHeader;

  const country =
    headerList.get("x-vercel-ip-country") ?? headerList.get("cf-ipcountry");
  const fromGeo = fromCountry(country);
  if (fromGeo) return fromGeo;

  return DEFAULT_LOCALE;
}

export async function detectInitialPathname(): Promise<string | null> {
  const headerList = await headers();
  return headerList.get("x-pathname");
}
